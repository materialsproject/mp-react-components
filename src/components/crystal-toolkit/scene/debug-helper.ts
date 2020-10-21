import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { CameraHelper } from 'three';
import { disposeSceneHierarchy } from '../Simple3DScene/utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const DEBUG_SIZE = 500;

/**
 *
 * In the current implementation, this is destroyed/re-created on the fly.
 * We could wait for the first instantiation, and then just remove the node
 * and stop rendering.
 *
 * This will allow us to have a simpler management of the object in the scenes
 *
 */

const background = new THREE.Color('#000000');

export class DebugHelper {
  private cameraHelper: THREE.CameraHelper;
  private debugCamera: THREE.Camera;
  private debugRenderer: THREE.WebGLRenderer; // no SVG
  private controls: any;

  private showAxis = true;
  private showGrid = true;
  private showLights = false;

  private axis: THREE.AxesHelper;
  private grid: THREE.GridHelper;
  private lights!: THREE.Object3D;
  private insetHelper: THREE.Object3D;

  constructor(
    private mountNode,
    private scene,
    private cameraToTrack,
    private settings,
    private builder,
    insetCameraHelper
  ) {
    if (!mountNode) {
      console.error('No mount node passed for the debug view');
    }
    this.debugRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    (this.debugRenderer as any).gammaFactor = 2.2;
    this.debugRenderer.setSize(DEBUG_SIZE, DEBUG_SIZE);

    // FIXME
    this.mountNode.appendChild(this.debugRenderer.domElement);
    this.cameraHelper = new THREE.CameraHelper(cameraToTrack);
    this.scene.add(this.cameraHelper);

    this.axis = new THREE.AxesHelper(100);
    (this.axis.material as LineMaterial).linewidth = 2.5; // this does not work due to limitation
    this.grid = new THREE.GridHelper(20, 20); // size 10, division 10

    const lights = this.scene.getObjectByName('lights');
    if (!lights || lights.children.length === 0) {
      console.warn('No lights defined in the scene');
    } else {
      this.lights = this.builder.makeLightsHelper(lights.children);
    }

    this.showAxis && this.scene.add(this.axis);
    this.showGrid && this.scene.add(this.grid); // TODO( three grids on each word axis )
    this.showLights && this.scene.add(this.lights);

    this.debugCamera = new THREE.PerspectiveCamera(
      60, // fov
      1, // aspect
      0.1, // near
      300 // far
    );
    this.debugCamera.position.set(10, 20, -10);
    this.debugRenderer.setSize(DEBUG_SIZE, DEBUG_SIZE);
    this.debugRenderer.setViewport(0, 0, DEBUG_SIZE, DEBUG_SIZE);
    this.debugCamera.lookAt(0, 0, 0);
    const controls2 = new OrbitControls(this.debugCamera, this.debugRenderer.domElement);
    controls2.target.set(0, 5, 0);
    controls2.update();
    // we are assuming a static scene
    // only re-render when scene is rotated
    controls2.addEventListener('change', () => {
      this.render();
    });
    controls2.addEventListener('start', () => {
      controls2.update();
    });
    controls2.addEventListener('end', () => {
      controls2.update();
    });
    this.controls = controls2;
    this.insetHelper = new THREE.Object3D();
    insetCameraHelper && this.insetHelper.add(insetCameraHelper);
    this.scene.add(this.insetHelper);
  }

  public render() {
    this.cameraHelper.update();
    this.insetHelper.children[0] && (this.insetHelper.children[0] as CameraHelper).update();
    const oldBackgroundColor = this.scene.background;
    this.scene.background = background;
    this.setHelperObjectVisibility(true);
    this.debugRenderer.render(this.scene, this.debugCamera);
    this.setHelperObjectVisibility(false);
    this.scene.background = oldBackgroundColor;
  }

  private setHelperObjectVisibility(isVisible) {
    this.cameraHelper.visible = this.axis.visible = this.grid.visible = this.lights.visible = this.insetHelper.visible = isVisible;
  }

  public onDestroy() {
    disposeSceneHierarchy(this.scene);
    this.scene.remove(this.cameraHelper);
    this.axis && this.scene.remove(this.axis);
    this.grid && this.scene.remove(this.grid);
    this.scene.dispose();
    this.controls.dispose();
    this.debugRenderer.forceContextLoss();
    this.debugRenderer.dispose();
    this.debugRenderer.domElement!.parentElement!.removeChild(this.debugRenderer.domElement);
    this.debugRenderer.domElement = (undefined as unknown) as any;
    this.debugRenderer = (null as unknown) as any;
  }
}
