import PropTypes, { InferProps } from 'prop-types';
import React, { MutableRefObject, useEffect, useRef } from 'react';
import Simple3DScene from './Simple3DScene';
import { subscribe } from './Simple3DSceneDownloadEvent';
import './Simple3DScene.less';
import { download } from './utils';
import {
  DEBUG_STYLE,
  MOUNT_DEBUG_NODE_CLASS,
  MOUNT_NODE_CLASS,
  MOUNT_NODE_STYLE
} from './constants';

/**
 * Simple3DSceneComponent is intended to draw simple 3D scenes using the popular
 * Three.js scene graph library. In particular, the JSON representing the 3D scene
 * is intended to be human-readable, and easily generated via Python. This is not
 * intended to be a replacement for a full scene graph library, but for rapid
 * prototyping by non-experts.
 */
export default function Simple3DSceneComponent({
  id,
  debug,
  data,
  inletSize,
  inletPadding,
  settings,
  onObjectClicked,
  toggleVisibility,
  axisView
}: InferProps<typeof Simple3DSceneComponent.propTypes>) {

  // mount nodes, those are passed in the template and are populated when
  // the component is mounted
  const mountNodeRef = useRef(null);
  const mountNodeDebugRef = useRef(null);

  // we use a ref to keep a reference to the underlying scene
  const scene: MutableRefObject<Simple3DScene | null> = useRef(null);

  // called after the component is mounted, so refs are correctly populated
  useEffect(() => {
    const _s = (scene.current = new Simple3DScene(
      data,
      mountNodeRef.current!,
      settings,
      inletSize,
      inletPadding,
      objects => {
        if (onObjectClicked) {
          console.log('clicked', objects);
          onObjectClicked(objects);
        }
      },
      mountNodeDebugRef.current!
    ));
    const subscription = subscribe(({ filename, filetype }) => download(filename, filetype, _s));
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
  useEffect(() => scene.current!.toggleVisibility(toggleVisibility as any), [toggleVisibility]);
  // FIXME(chab) addToScene is breaking event handlers if we call it multiple time
  //useEffect(() => {scene.current!.addToScene(data); scene.current!.toggleVisibility(toggleVisibility)},[data]);
  useEffect(() => scene.current!.updateInsetSettings(inletSize!, inletPadding!, axisView), [
    inletSize,
    inletPadding,
    axisView
  ]);

  return (
    <>
      <div id={id!} style={MOUNT_NODE_STYLE} className={MOUNT_NODE_CLASS} ref={mountNodeRef} />
      {debug && (
        <div style={DEBUG_STYLE} className={MOUNT_DEBUG_NODE_CLASS} ref={mountNodeDebugRef} />
      )}
    </>
  );
}

//TODO(chab) add isRequired stuff, so TS will not complain
// or just use plain types, and use propTypes in dash

Simple3DSceneComponent.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id: PropTypes.string,

  /**
   * Add a debugging view
   */
  debug: PropTypes.bool,

  /**
   * Simple3DScene JSON, the easiest way to generate this is to use the Scene class
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
   *    defaultZoom: 1, // 1 will fill the screen with sufficient room to rotate
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
   *    "n_requests": n_requests, // increment to trigger a new download request
   *    "filename": request_filename, // the download filename
   *    "filetype": "png", // the download format
   * }
   */
  downloadRequest: PropTypes.object,
  onObjectClicked: PropTypes.func,
  /**
   * Size of axis inlet
   */
  inletSize: PropTypes.number,

  /**
   * Padding of axis inlet
   */
  inletPadding: PropTypes.number,
  /**
   * Orientation of axis view
   */
  axisView: PropTypes.string
};
