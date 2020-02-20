import React, { Component, RefObject } from 'react';
import PropTypes from 'prop-types';
import Simple3DScene from './Simple3DScene';
import { Subscription } from 'rxjs';
import { subscribe } from './Simple3DSceneDownloadEvent';
import './Simple3DScene.less';
import { download } from './utils';

/**
 * Simple3DSceneComponent is intended to draw simple 3D scenes using the popular
 * Three.js scene graph library. In particular, the JSON representing the 3D scene
 * is intended to be human-readable, and easily generated via Python. This is not
 * intended to be a replacement for a full scene graph library, but for rapid
 * prototyping by non-experts.
 */
export default class Simple3DSceneComponent extends Component<
  PropTypes.InferProps<typeof Simple3DSceneComponent.propTypes>,
  any
> {
  //TODO(chab) try to use a functional component

  static propTypes = {
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
     *
     */
    axisView: PropTypes.string
  };

  private scene!: Simple3DScene;
  private mountNodeRef: RefObject<HTMLDivElement>;
  private mountNodeDebugRef: RefObject<HTMLDivElement>;
  private downloadSubscription: Subscription;

  constructor(public props) {
    super(props);
    this.mountNodeRef = React.createRef();
    this.mountNodeDebugRef = React.createRef();
    this.downloadSubscription = subscribe(({ filename, filetype }) => {
      download(filename, filetype, this.scene);
    });
  }

  componentDidMount() {
    // NOTE(chab) this.mount === this.scene.renderer.domElement.parentElement
    this.scene = new Simple3DScene(
      this.props.data,
      this.mountNodeRef.current!,
      this.props.settings,
      this.props.inletSize,
      this.props.inletPadding,
      objects => this.handleClick(objects),
      this.mountNodeDebugRef.current
    );
    this.scene.toggleVisibility(this.props.toggleVisibility);
  }

  UNSAFE_componentWillUpdate(nextProps: any, nextState) {
    if (nextProps.data !== this.props.data) {
      this.scene.addToScene(nextProps.data);
      this.scene.toggleVisibility(this.props.toggleVisibility);
    }

    this.scene.updateInsetSettings(nextProps.inletSize, nextProps.inletPadding, nextProps.axisView);

    if (nextProps.toggleVisibility !== this.props.toggleVisibility) {
      this.scene.toggleVisibility(nextProps.toggleVisibility);
    }
  }

  //TODO(chab) move everything here
  componentDidUpdate(
    prevProps: Readonly<PropTypes.InferProps<typeof Simple3DSceneComponent.propTypes>>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    if (prevProps.debug !== this.props.debug) {
      this.scene.enableDebug(this.props.debug, this.mountNodeDebugRef.current);
    }
  }

  componentWillUnmount() {
    // perform that in the onDestroy
    //this.mount.removeChild(this.scene.renderer.domElement);
    this.scene.onDestroy();
    this.downloadSubscription.unsubscribe();
  }

  // I've opted for a simple implementation, the click is handled directly in the scene, and
  // we update a prop there to let people know something has changed
  handleClick(object) {
    if (this.props.onObjectClicked) {
      console.log('clicked', object);
      (this.props.onObjectClicked as any)(object); // why TS complains ?
    }
  }

  render() {
    return (
      <>
        <div
          id={this.props.id!}
          style={{ width: '100%', height: '100%' }}
          className={'three-container'}
          ref={this.mountNodeRef}
        />
        {this.props.debug && (
          <div
            style={{
              width: '500px',
              height: '500px',
              position: 'absolute',
              top: '0',
              left: '500px'
            }}
            className={'three-debug-container'}
            ref={this.mountNodeDebugRef}
          />
        )}
      </>
    );
  }
}
