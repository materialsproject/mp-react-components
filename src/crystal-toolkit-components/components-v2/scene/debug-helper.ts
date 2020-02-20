import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

const DEBUG_SIZE = 500;

/**
 *
 * In the current implementation, this is destroyed/re-created on the fly.
 * We could wait for the first instantiation, and then just remove the node
 * and stop rendering.
 *
 * This will allow us to have a simpler managment of the object in the scenes
 *
 */

export class DebugHelper {
  private cameraHelper: THREE.CameraHelper;
  private debugCamera: THREE.Camera;
  private debugRenderer: THREE.WebGLRenderer; // no SVG
  private controls: OrbitControls;

  private showAxis = true;
  private showGrid = true;
  private axis: THREE.AxesHelper;
  private grid: THREE.GridHelper;

  constructor(private mountNode, private scene, private cameraToTrack, private settings) {
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
    (this.axis.material as LineMaterial).linewidth = 5; // this does not work due to limitation
    this.scene.add(this.axis);
    this.grid = new THREE.GridHelper(50, 50); // size 10, division 10

    this.scene.add(this.grid); // TODO( three grids on each word axis )
    this.scene.add(this.axis);

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
  }

  public render() {
    this.cameraHelper.update();
    const oldBackgroundColor = this.scene.background;
    this.scene.background = new THREE.Color('#000000');
    this.cameraHelper.visible = true;
    this.axis.visible = true;
    this.grid.visible = true;
    this.debugRenderer.render(this.scene, this.debugCamera);
    this.cameraHelper.visible = false;
    this.axis.visible = false;
    this.grid.visible = false;
    this.scene.background = oldBackgroundColor;
  }

  public onDestroy() {
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
