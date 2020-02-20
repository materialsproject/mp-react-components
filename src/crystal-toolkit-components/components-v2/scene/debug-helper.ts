import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const DEBUG_SIZE = 500;

export class DebugHelper {
  private cameraHelper: THREE.CameraHelper;
  private debugCamera: THREE.Camera;
  private debugRenderer: THREE.WebGLRenderer; // no SVG
  private controls: OrbitControls;

  constructor(private mountNode, private scene, private cameraToTrack, private setting) {
    // debug settings

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
    this.debugRenderer.render(this.scene, this.debugCamera);
    this.cameraHelper.visible = false;
    this.scene.background = oldBackgroundColor;
  }

  public onDestroy() {
    this.scene.dispose();
    this.controls.dispose();
    this.debugRenderer.forceContextLoss();
    this.debugRenderer.dispose();
    this.debugRenderer.domElement!.parentElement!.removeChild(this.debugRenderer.domElement);
    this.debugRenderer.domElement = (undefined as unknown) as any;
    this.debugRenderer = (null as unknown) as any;
  }
}
