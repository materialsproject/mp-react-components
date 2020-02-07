import React, {
  Component, RefObject
} from "react";
import PropTypes from "prop-types";
import Simple3DScene from "./Simple3DScene";
import { Subscription } from "rxjs";
import { subscribe } from "./Simple3DSceneDownloadEvent";

/**
 * Simple3DSceneComponent is intended to draw simple 3D scenes using the popular
 * Three.js scene graph library. In particular, the JSON representing the 3D scene
 * is intended to be human-readable, and easily generated via Python. This is not
 * intended to be a replacement for a full scene graph library, but for rapid
 * prototyping by non-experts.
 */
export default class Simple3DSceneComponent extends Component {
  //TODO(chab) try to use a functional component

  static propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks
     */
    id: PropTypes.string,

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
     *    defaultZoom: 0.8, // 1 will completely fill viewport with scene
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

    /**
     * Dash-assigned callback that should be called whenever any of the
     * properties change
     */
    setProps: PropTypes.func,
    /**
     * Reference to selected objects when clicked
     */
    selectedObjectReference: PropTypes.string,

    /**
     * Click count for selected object
     */
    selectedObjectCount: PropTypes.number
  };


  private scene!: Simple3DScene;
  private mountNodeRef: RefObject<HTMLDivElement>;
  private downloadSubscription: Subscription;

  constructor (public props: PropTypes.InferProps<typeof Simple3DSceneComponent.propTypes>) {
    super(props);
    this.mountNodeRef = React.createRef();
    this.downloadSubscription = subscribe(({filename, filetype}) => {
      this.scene.download(filename, filetype)
    })
  }

  componentDidMount () {
    // NOTE(chab) this.mount === this.scene.renderer.domElement.parentElement
    this.scene = new Simple3DScene(this.props.data, this.mountNodeRef.current!, this.props.settings);
    this.scene.toggleVisibility(this.props.toggleVisibility);
  }

  UNSAFE_componentWillUpdate (nextProps, nextState) {

    if (nextProps.data !== this.props.data) {
      this.scene.addToScene(nextProps.data);
      this.scene.toggleVisibility(this.props.toggleVisibility)
    }

    if (nextProps.toggleVisibility !== this.props.toggleVisibility) {
      this.scene.toggleVisibility(nextProps.toggleVisibility)
    }
  }

  componentWillUnmount () {
    // perform that in the onDestroy
    //this.mount.removeChild(this.scene.renderer.domElement);
    this.scene.onDestroy();
    this.downloadSubscription.unsubscribe();
  }

  handleClick (event) {
    event.preventDefault();

    const clickedReference = this.scene.getClickedReference(event.clientX, event.clientY);
    // Not sure what is the goal there ?
    if (this.props.selectedObjectReference === clickedReference) {
      this.setState((state: any) => {
        return { selectedObjectCount: state.selectedObjectCount + 1 }
      })
    } else {
      this.setState({
        selectedObjectReference: clickedReference,
        selectedObjectCount: 1
      })
    }
  }

  render () {
    return (<div id={this.props.id!}
      style={{width: '100%', height: '100%'}}
      className={'three-container'}
      ref={ this.mountNodeRef }
      onClick={ e => this.handleClick(e)}
    />
    )
  }
}



