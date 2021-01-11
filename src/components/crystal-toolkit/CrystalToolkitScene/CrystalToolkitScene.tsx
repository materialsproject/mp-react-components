import PropTypes, { InferProps } from 'prop-types';
import React, { MutableRefObject, useContext, useEffect, useRef } from 'react';
import Scene from '../scene/Scene';
import { subscribe } from '../scene/download-event';
import './CrystalToolkitScene.less';
import {
  AnimationStyle,
  DEBUG_STYLE,
  DEFAULT_SCENE_SIZE,
  ExportType,
  MOUNT_DEBUG_NODE_CLASS,
  MOUNT_NODE_CLASS,
  MOUNT_NODE_STYLE,
} from '../scene/constants';
import { CameraContext } from '../CameraContextProvider';
import { CameraReducerAction } from '../CameraContextProvider/camera-reducer';
import SimpleSlider from '../scene/animation-slider';
import { usePrevious } from '../../../utils/hooks';
import toDataUrl from 'svgtodatauri';
import { WebGLRenderer } from 'three';
import { ColladaExporter } from 'three/examples/jsm/exporters/ColladaExporter';

const getSceneSize = (sceneSize) => (sceneSize ? sceneSize : DEFAULT_SCENE_SIZE);

let ID_GENERATOR = 0;
/**
 * CrystalToolkitScene is intended to draw simple 3D scenes using the popular
 * Three.js scene graph library. In particular, the JSON representing the 3D scene
 * is intended to be human-readable, and easily generated via Python. This is not
 * intended to be a replacement for a full scene graph library, but for rapid
 * prototyping by non-experts.
 */
export function CrystalToolkitScene({
  id,
  debug,
  data,
  inletSize,
  inletPadding,
  settings,
  animation,
  imageRequest = {},
  imageData,
  onObjectClicked,
  toggleVisibility,
  axisView,
  sceneSize,
}: InferProps<typeof CrystalToolkitScene.propTypes>) {
  // mount nodes, those are passed in the template and are populated when
  // the component is mounted
  const mountNodeRef = useRef(null);
  const mountNodeDebugRef = useRef(null);
  const _id = useRef(++ID_GENERATOR + '');
  const previousAnimationSetting = usePrevious(animation);
  // we use a ref to keep a reference to the underlying scene
  const scene: MutableRefObject<Scene | null> = useRef(null);

  const setPngData = (filename: string, sceneComponent) => {
    if (sceneComponent.renderer instanceof WebGLRenderer) {
      const oldRatio = sceneComponent.renderer.getPixelRatio();
      sceneComponent.renderer.setPixelRatio(8);
      sceneComponent.renderScene();
      imageData = sceneComponent.renderer.domElement.toDataURL('image/png');
      // wait for next event loop before rendering
      setTimeout(() => {
        sceneComponent.renderer.setPixelRatio(oldRatio);
        sceneComponent.renderScene();
      });
    } else {
      sceneComponent.renderScene();
      toDataUrl(sceneComponent.renderer.domElement, 'image/png', {
        callback: function (data) {
          imageData = data;
        },
      });
    }
  };

  const setColladaData = (filename: string, sceneComponent: Scene) => {
    // Note(chab) i think it's better to use callback, so we can manage failure
    const files = new ColladaExporter().parse(
      sceneComponent.scene,
      (r) => {
        console.log('result', r);
      },
      {}
    )!;
    imageData = 'data:text/plain;base64,' + btoa(files.data);
  };

  const requestImage = (filename: string, filetype: ExportType, sceneComponent: Scene) => {
    // force a render (in case buffer has been cleared)
    switch (filetype) {
      case ExportType.png:
        setPngData(filename, sceneComponent);
        break;
      case ExportType.dae:
        setColladaData(filename, sceneComponent);
        break;
      default:
        throw new Error('Unknown filetype.');
    }
  };

  // called after the component is mounted, so refs are correctly populated
  useEffect(() => {
    const _s = (scene.current = new Scene(
      data,
      mountNodeRef.current!,
      settings,
      inletSize,
      inletPadding,
      (objects) => {
        if (onObjectClicked) {
          onObjectClicked(objects);
        }
      },
      (position, quaternion, zoom) => {
        cameraContext.dispatch &&
          cameraContext.dispatch({
            type: CameraReducerAction.NEW_POSITION,
            payload: {
              componentId: _id.current,
              position,
              quaternion,
              zoom,
            },
          });
      },
      mountNodeDebugRef.current!
    ));
    const subscription = subscribe(({ filename, filetype }) =>
      requestImage(filename, filetype, _s)
    );
    return () => {
      // clean up code
      subscription.unsubscribe();
      _s.onDestroy();
    };
  }, []);

  // Note(chab) those hooks will be executed sequentially at mount time, and on change of the deps array elements
  useEffect(() => scene.current!.enableDebug(debug!, mountNodeDebugRef.current), [debug]);
  // An interesting classical react issue that we fixed : look at the stories, we do not pass anymore an empty object,
  // but a reference to an empty object, otherwise, it will be a different reference, and treated as a different object, thus
  // triggering the effect
  useEffect(() => {
    if (!data || !(data as any).name || !(data as any).contents) {
      console.warn('no data passed ( or missing name /content ), scene will not be updated', data);
      return;
    }

    //FIXME(chab) we have to much calls to renderScene
    !!data && scene.current!.addToScene(data, true);
    scene.current!.toggleVisibility(toggleVisibility as any);
  }, [data]);
  useEffect(() => scene.current!.toggleVisibility(toggleVisibility as any), [toggleVisibility]);
  useEffect(() => scene.current!.updateInsetSettings(inletSize!, inletPadding!, axisView), [
    inletSize,
    inletPadding,
    axisView,
  ]);

  useEffect(() => {
    scene.current!.resizeRendererToDisplaySize();
  }, [sceneSize]);

  useEffect(() => {
    const { filename, filetype, n_requests } = imageRequest as any;
    if (n_requests > 0 && filename && filename.length > 0) {
      requestImage(filename, filetype, scene.current!);
    }
  }, [(imageRequest as any).n_requests]);

  // use to dispatch camera changes, and react to them
  // not this is not the  implementation, as react will re-render
  // when dispatch is called ( ideally, we could just use RxJS to react to the changes,
  // in that case we will just update the camera position... instead of re-rendering the component )
  // but the perf impact is like 0.20

  const cameraContext = useContext(CameraContext);
  if (cameraContext.state) {
    const state = cameraContext.state;
    useEffect(() => {
      if (
        _id.current == state.fromComponent ||
        !state.position ||
        !state.quaternion ||
        !state.zoom
      ) {
      } else {
        scene.current!.updateCamera(state.position, state.quaternion, state.zoom);
      }
    }, [state.position, state.quaternion]);
  }
  //
  useEffect(() => {
    animation && scene.current!.updateAnimationStyle(animation as AnimationStyle);
  }, [animation]);

  const size = getSceneSize(sceneSize);

  // NOTE(chab) we could let the user opt for a flex layout, instead of using relative/absolute
  return (
    <>
      <div className="three-wrapper" style={{ position: 'relative', width: size, height: size }}>
        <div
          id={id!}
          style={{ ...MOUNT_NODE_STYLE, width: size, height: size }}
          className={MOUNT_NODE_CLASS}
          ref={mountNodeRef}
        />
      </div>
      {debug && (
        <div style={DEBUG_STYLE} className={MOUNT_DEBUG_NODE_CLASS} ref={mountNodeDebugRef} />
      )}

      {animation === AnimationStyle.SLIDER && (
        <SimpleSlider
          onUpdate={(a) => {
            scene.current!.updateTime(a / 100);
          }}
        />
      )}
    </>
  );
}

//TODO(chab) add isRequired stuff, so TS will not complain
// or just use plain types, and use propTypes in dash

CrystalToolkitScene.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id: PropTypes.string,

  /**
   * Add a debugging view
   */
  debug: PropTypes.bool,

  /**
   * Scene JSON, the easiest way to generate this is to use the Scene class
   * in crystal_toolkit.core.scene and its to_json method.
   */
  data: PropTypes.object,

  /**
   * Options used for generating scene.
   * Supported options and their defaults are given as follows:
   * {
   *    antialias: true, // set to false to improve performance
   *    renderer: 'webgl', // 'svg' also an option, used for unit testing
   *    transparentBackground: false, // transparent background
   *    background: '#ffffff', // background color if not transparent,
   *    sphereSegments: 32, // decrease to improve performance
   *    cylinderSegments: 16, // decrease to improve performance
   *    staticScene: true, // disable if animation required
   *    defaultZoom: 1, // 1 will zoom to fit object exactly, <1 will add padding between object and box bounds
   *    zoomToFit2D: false // if true, will zoom to fit object only along the X and Y axes (not Z)
   *    extractAxis: false // will remove the axis from the main scene
   * }
   * There are several additional options used for debugging and testing,
   * please consult the source code directly for these.
   */
  settings: PropTypes.object,

  /**
   * Hide/show nodes in scene by its name (key), value is 1 to show the node
   * and 0 to hide it.
   */
  toggleVisibility: PropTypes.object,

  /**
   * Set to trigger a screenshot or scene download. Should be an object with
   * the structure:
   * {
   *    "n_requests": n_requests, // increment to trigger a new image request
   *    "filename": request_filename, // the image filename
   *    "filetype": "png", // the image format
   * }
   */
  imageRequest: PropTypes.object,
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Data string for the image generated by imageRequest
   * This string can be downloaded as the filetype specified in your imageRequest object
   */
  imageData: PropTypes.string,
  onObjectClicked: PropTypes.func,
  /**
   * Size of axis inlet
   */
  inletSize: PropTypes.number,
  /**
   * Size of scene
   */
  sceneSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**
   * Padding of axis inlet
   */
  inletPadding: PropTypes.number,
  /**
   * Orientation of axis view
   */
  axisView: PropTypes.string,
  /**
   * Animation
   *
   * Set up animation styles
   *
   * 'play'
   * 'none'
   * 'slider'
   */
  animation: PropTypes.string,
};
