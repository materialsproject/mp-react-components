import PropTypes, { InferProps } from 'prop-types';
import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
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
  MOUNT_NODE_STYLE
} from '../scene/constants';
import { CameraContext } from '../CameraContextProvider';
import {
  CameraActionPayload,
  cameraReducer,
  CameraReducerAction,
  CameraState,
  initialState
} from '../CameraContextProvider/camera-reducer';
import SimpleSlider from '../scene/animation-slider';
import { usePrevious } from '../../../utils/hooks';
import toDataUrl from 'svgtodatauri';
import * as THREE from 'three';
import { Quaternion, Vector3, WebGLRenderer } from 'three';
import { ColladaExporter } from 'three/examples/jsm/exporters/ColladaExporter';
import { Action } from '../utils';
import useResizeObserver from 'use-resize-observer';
import { Enlargeable } from '../../data-display/Enlargeable';
import {
  FaCamera,
  FaCog,
  FaCogs,
  FaCompress,
  FaCompressAlt,
  FaExpand,
  FaExpandAlt,
  FaTimesCircle
} from 'react-icons/fa';
import { ButtonBar } from '../../data-display/ButtonBar';
import { Dropdown } from '../../navigation/Dropdown';
import classNames from 'classnames';
import { Tooltip } from '../../data-display/Tooltip';
import ReactTooltip from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';
import { ModalCloseButton } from '../../data-display/Modal/ModalCloseButton';

const getSceneSize = (sceneSize) => (sceneSize ? sceneSize : DEFAULT_SCENE_SIZE);

let ID_GENERATOR = 0;

export interface CrystalToolkitSceneProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Class name that will wrap around the whole scene component.
   * When enlarged, this class name is applied to the modal-content element.
   */
  className?: string;

  /**
   * Add a debugging view
   */
  debug?: boolean;

  /**
   * Scene JSON, the easiest way to generate this is to use the Scene class
   * in crystal_toolkit.core.scene and its to_json method.
   */
  data: any;

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
  settings?: any;

  /**
   * Hide/show nodes in scene by its name (key), value is 1 to show the node
   * and 0 to hide it.
   */
  toggleVisibility?: any;
  /**
   * File type to be downloaded as an image. Either png or dae
   */
  imageType?: ExportType;
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Data string for the image generated on image button click
   */
  imageData?: string;
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Date string that represents the time imageData was set.
   * Use this prop in dash callbacks to trigger downloads of imageData.
   */
  imageDataTimestamp?: string;
  /**
   * List of options to show in file download dropdown
   */
  fileOptions?: string[];
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * The last file type clicked in the file download menu
   */
  fileType?: string;
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Date string that represents the time fileType was set.
   * Use this prop in dash callbacks to trigger file downloads.
   */
  fileTimestamp?: any;
  onObjectClicked?: (value: any) => any;
  /**
   * Size of axis inlet
   */
  inletSize?: number;
  /**
   * Size of scene
   */
  sceneSize?: number | string;
  /**
   * Padding of axis inlet
   */
  inletPadding?: number;
  /**
   * Orientation of axis view
   */
  axisView?: string;
  /**
   * Animation
   *
   * Set up animation styles
   *
   * 'play'
   * 'none'
   * 'slider'
   */
  animation?: string;
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Object that maintains the current state of the camera.
   * e.g.
   * {
   *   position: {x: 0, y: 0, z: 0},
   *   quarternion: {x: 0, y: 0, z: 0, w: 0},
   *   zoom: 1,
   *   setByComponentId: "1",
   *   following: true
   * }
   */
  currentCameraState?: CameraState;
  /**
   * Object for setting the scene to a custom camera state.
   * When modified, the camera will update to new custom state.
   * e.g.
   * {
   *   position: {x: 0, y: 0, z: 0},
   *   quarternion: {x: 0, y: 0, z: 0, w: 0}, (optional)
   *   zoom: 1 (optional)
   * }
   */
  customCameraState?: CameraState;
  hideControls?: boolean;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
}

/**
 * This component is intended to draw simple 3D scenes using the popular
 * Three.js scene graph library. In particular, the JSON representing the 3D scene
 * is intended to be human-readable, and easily generated via Python. This is not
 * intended to be a replacement for a full scene graph library, but for rapid
 * prototyping by non-experts.
 */
export const CrystalToolkitScene: React.FC<CrystalToolkitSceneProps> = ({
  imageType = ExportType.png,
  setProps = () => null,
  ...otherProps
}) => {
  let props = { imageType, setProps, ...otherProps };
  /**
   * mount nodes, those are passed in the template and are populated when
   * the component is mounted
   */
  const mountNodeRef = useRef(null);

  /**
   * Wrap mountNodeRef in a resize observer so that the scene
   * can resize properly even when the window size doesn't change
   */
  const { width, height } = useResizeObserver<HTMLDivElement>({
    ref: mountNodeRef,
    onResize: ({ width, height }) => {
      if (scene.current) {
        console.log('resizing');
        scene.current.resizeRendererToDisplaySize();
      }
    }
  });

  const mountNodeDebugRef = useRef(null);
  const componentId = useRef((++ID_GENERATOR).toString());
  const previousAnimationSetting = usePrevious(props.animation);
  // we use a ref to keep a reference to the underlying scene
  const scene: MutableRefObject<Scene | null> = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const settingsPanel = React.Children.map(props.children, (child, i) => (i === 0 ? child : null));
  const legend = React.Children.map(props.children, (child, i) => (i === 1 ? child : null));
  const tooltipId = uuidv4();

  /**
   * Handle saving image to png
   * If using the SVG Renderer, convert svg to canvas image first
   * Set imageData prop to data uri
   */
  const setPngData = (sceneComponent) => {
    if (sceneComponent.renderer instanceof WebGLRenderer) {
      sceneComponent.renderScene();
      const imageData = sceneComponent.renderer.domElement.toDataURL('image/png');
      const imageDataTimestamp = Date.now();
      props.setProps({ ...props, imageData, imageDataTimestamp });
      // wait for next event loop before rendering
      setTimeout(() => {
        sceneComponent.renderScene();
      });
    } else {
      sceneComponent.renderScene();
      toDataUrl(sceneComponent.renderer.domElement, 'image/png', {
        callback: function (imageData: string) {
          const imageDataTimestamp = Date.now();
          props.setProps({ ...props, imageData, imageDataTimestamp });
        }
      });
    }
  };

  /**
   * Handle saving image to collada file (.dae)
   * Set imageData prop to data uri
   */
  const setColladaData = (sceneComponent: Scene) => {
    // Note(chab) i think it's better to use callback, so we can manage failure
    const files = new ColladaExporter().parse(
      sceneComponent.scene,
      (r) => {
        console.log('result', r);
      },
      {}
    )!;
    const imageData = 'data:text/plain;base64,' + btoa(files.data);
    const imageDataTimestamp = Date.now();
    props.setProps({ imageData, imageDataTimestamp });
  };

  const requestImage = (filetype: ExportType, sceneComponent: Scene) => {
    // force a render (in case buffer has been cleared)
    switch (filetype) {
      case ExportType.png:
        setPngData(sceneComponent);
        break;
      case ExportType.dae:
        setColladaData(sceneComponent);
        break;
      default:
        throw new Error('Unknown filetype.');
    }
  };

  // called after the component is mounted, so refs are correctly populated
  useEffect(() => {
    const _s = (scene.current = new Scene(
      props.data,
      mountNodeRef.current!,
      props.settings,
      props.inletSize,
      props.inletPadding,
      (objects) => {
        if (props.onObjectClicked) {
          props.onObjectClicked(objects);
        }
      },
      /** Sets dispatch function on the scene object */
      (position, quaternion, zoom) => {
        cameraDispatch &&
          cameraDispatch({
            type: CameraReducerAction.NEW_POSITION,
            payload: {
              componentId: componentId.current,
              position,
              quaternion,
              zoom
            }
          });
      },
      mountNodeDebugRef.current!
    ));
    const subscription = subscribe(({ filetype }) => requestImage(filetype, _s));
    return () => {
      // clean up code
      subscription.unsubscribe();
      _s.onDestroy();
    };
  }, []);

  // Note(chab) those hooks will be executed sequentially at mount time, and on change of the deps array elements
  useEffect(
    () => scene.current!.enableDebug(props.debug!, mountNodeDebugRef.current),
    [props.debug]
  );
  // An interesting classical react issue that we fixed : look at the stories, we do not pass anymore an empty object,
  // but a reference to an empty object, otherwise, it will be a different reference, and treated as a different object, thus
  // triggering the effect
  useEffect(() => {
    if (!props.data || !(props.data as any).name || !(props.data as any).contents) {
      console.warn(
        'no data passed ( or missing name /content ), scene will not be updated',
        props.data
      );
      return;
    }

    //FIXME(chab) we have to much calls to renderScene
    !!props.data && scene.current!.addToScene(props.data, true);
    scene.current!.toggleVisibility(props.toggleVisibility as any);
  }, [props.data]);
  useEffect(
    () => scene.current!.toggleVisibility(props.toggleVisibility as any),
    [props.toggleVisibility]
  );
  useEffect(
    () => scene.current!.updateInsetSettings(props.inletSize!, props.inletPadding!, props.axisView),
    [props.inletSize, props.inletPadding, props.axisView]
  );

  useEffect(() => {
    scene.current!.resizeRendererToDisplaySize();
  }, [props.sceneSize]);

  /**
   * Manage camera state with context if component is wrapped in CameraContextProvider
   * otherwise use a reducer to manage camera state locally
   */
  const cameraContext = useContext(CameraContext);
  const [cameraReducerState, cameraReducerDispatch] = useReducer(cameraReducer, initialState);
  const cameraState = cameraContext ? cameraContext.state : cameraReducerState;
  const cameraDispatch = cameraContext ? cameraContext.dispatch : cameraReducerDispatch;
  if (cameraState) {
    useEffect(() => {
      props.setProps({ ...props, currentCameraState: cameraState });

      if (
        cameraState &&
        cameraState.setByComponentId !== componentId.current &&
        cameraState.position &&
        cameraState.quaternion &&
        cameraState.zoom
      ) {
        scene.current!.updateCamera(cameraState.position, cameraState.quaternion, cameraState.zoom);
      }
    }, [cameraState.position]);
  }

  /**
   * When customCameraState prop changes,
   * update the camera to the new state
   * and save the new state into the cameraState
   */
  useEffect(() => {
    if (props.customCameraState) {
      const { position: p, quaternion: q, zoom } = props.customCameraState;
      /**
       * Explicitly convert to Quaternion/Vector3 objects so that you
       * can pass simple objects to customCameraState prop.
       * (i.e. no need to use THREE.js constructors)
       */
      const quaternion = new THREE.Quaternion(q?.x, q?.y, q?.z, q?.w);
      const position = new THREE.Vector3(p?.x, p?.y, p?.z);
      scene.current!.updateCamera(position!, quaternion!, zoom!);
      if (cameraDispatch) {
        cameraDispatch({
          type: CameraReducerAction.NEW_POSITION,
          payload: {
            componentId: componentId.current,
            position,
            quaternion,
            zoom
          }
        });
      }
    }
    console.log('new props');
  }, [props.customCameraState]);

  useEffect(() => {
    props.animation && scene.current!.updateAnimationStyle(props.animation as AnimationStyle);
  }, [props.animation]);

  const size = getSceneSize(props.sceneSize);

  // NOTE(chab) we could let the user opt for a flex layout, instead of using relative/absolute
  return (
    <Enlargeable
      className={props.className}
      hideButton
      expanded={expanded}
      setExpanded={setExpanded}
    >
      <div className="mpc-crystal-toolkit-scene">
        {!props.hideControls && (
          <>
            <ButtonBar>
              <button
                className="button"
                onClick={() => {
                  ReactTooltip.hide();
                  setExpanded(!expanded);
                }}
                data-tip
                data-for={`expand-${tooltipId}`}
              >
                {expanded ? <FaCompress /> : <FaExpand />}
                <Tooltip id={`expand-${tooltipId}`} place="left">
                  {expanded ? 'Exit full screen' : 'Full screen'}
                </Tooltip>
              </button>
              <button
                className="button"
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                data-tip
                data-for={`settings-${tooltipId}`}
              >
                <FaCogs />
                <Tooltip id={`settings-${tooltipId}`} place="left">
                  {showSettingsPanel ? 'Hide settings' : 'Show settings'}
                </Tooltip>
              </button>
              <button
                className="button"
                onClick={() => requestImage(props.imageType, scene.current!)}
                data-tip
                data-for={`image-${tooltipId}`}
              >
                <FaCamera />
                <Tooltip id={`image-${tooltipId}`} place="left">
                  Download image
                </Tooltip>
              </button>
              <div onClick={() => ReactTooltip.hide()} data-tip data-for={`export-${tooltipId}`}>
                <Dropdown triggerIcon="fas fa-file-export" isArrowless isRight>
                  {props.fileOptions?.map((option, i) => (
                    <p
                      key={`file-export-${i}`}
                      className="dropdown-item"
                      onClick={() => {
                        props.setProps({ ...props, fileType: option, fileTimestamp: Date.now() });
                      }}
                    >
                      {option}
                    </p>
                  ))}
                </Dropdown>
                <Tooltip id={`export-${tooltipId}`} place="left">
                  Export as
                </Tooltip>
              </div>
            </ButtonBar>
            <div
              className={classNames('mpc-crystal-toolkit-settings-panel', {
                'is-hidden': !showSettingsPanel
              })}
            >
              <ModalCloseButton onClick={() => setShowSettingsPanel(false)} />
              {settingsPanel}
            </div>
          </>
        )}
        <div className="mpc-crystal-viewer-box">
          <div className="three-wrapper" style={{ width: size, height: size }}>
            <div
              id={props.id!}
              style={{ ...MOUNT_NODE_STYLE, width: size, height: size }}
              className={MOUNT_NODE_CLASS}
              ref={mountNodeRef}
            />
          </div>
          {props.debug && (
            <div style={DEBUG_STYLE} className={MOUNT_DEBUG_NODE_CLASS} ref={mountNodeDebugRef} />
          )}

          {props.animation === AnimationStyle.SLIDER && (
            <SimpleSlider
              onUpdate={(a) => {
                scene.current!.updateTime(a / 100);
              }}
            />
          )}
        </div>
      </div>
    </Enlargeable>
  );
};
