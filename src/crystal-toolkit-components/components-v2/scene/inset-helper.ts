import * as THREE from 'three';
import { getSceneWithBackground } from '../Simple3DScene/Simple3DScene';

export class InsetHelper {
  private insetCamera: THREE.OrthographicCamera;
  private frontRotation;
  private axisPadding = 5; // the space between the edge of the inset and the axis bounding box
  private scene: THREE.Scene;

  constructor(
    private axis: THREE.Object3D,
    baseScene: THREE.Scene,
    private origin: [number, number, number],
    private cameraToFollow: THREE.Camera,
    private insetWidth = 100,
    private insetHeight = 100,
    private insetPadding = 10
  ) {
    //TODO(chab) extract the cube from the axis
    this.insetCamera = new THREE.OrthographicCamera(-4, 4, 4, -4, -20, 20);
    this.frontRotation = this.cameraToFollow.rotation.clone();
    this.scene = getSceneWithBackground({ transparentBackground: true });
    this.scene.background = new THREE.Color('#eeeeee');
    this.scene.add(baseScene.getObjectByName('lights')?.clone()!);
    this.scene.add(this.axis);
    this.setup();
  }
  private setup() {
    // put back the axis in its normal scale for the calculation
    const [x, y, z] = this.origin;
    this.insetCamera.position.set(x, y, z);
    this.insetCamera.rotation.set(
      this.frontRotation.x,
      this.frontRotation.y,
      this.frontRotation.z,
      this.frontRotation.order
    );
    this.axis.scale.set(1, 1, 1);
    this.insetCamera.updateProjectionMatrix();
    const box = new THREE.Box3().setFromObject(this.axis);
    let center = new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      (box.min.y + box.max.y) / 2,
      (box.min.z + box.max.z) / 2
    );
    let extents = new THREE.Vector3(
      (box.max.x - box.min.x) / 2,
      (box.max.y - box.min.y) / 2,
      (box.max.z - box.min.z) / 2
    );
    let a = center
      .clone()
      .add(new THREE.Vector3(-extents.x, -extents.y, -extents.z))
      .project(this.insetCamera);
    let b = center
      .clone()
      .add(new THREE.Vector3(extents.x, -extents.y, extents.z))
      .project(this.insetCamera);

    // we should perform the calculation for both width and height, and t
    // take the smallest scaling
    let widthOnScreenBuffer = Math.max(a.distanceTo(b));
    const width = (widthOnScreenBuffer / 2) * this.insetWidth;
    const scale = (this.insetWidth / 2 - this.axisPadding - this.insetPadding) / width;
    this.axis.scale.set(scale, scale, scale);
    this.insetCamera.position.set(x * scale, y * scale, z * scale);
    this.insetCamera.updateProjectionMatrix();
  }

  public updateViewportsize(size, padding) {
    this.insetPadding = padding;

    if (size < 50) {
      size = 50;
    }
    if (size != this.insetHeight) {
      this.insetWidth = this.insetHeight = size;
      this.setup();
    }
  }

  public updateAxis(axis) {
    this.scene.remove(this.axis);
    this.axis = axis;
    this.scene.add(this.axis);
    this.setup();
  }

  public render(renderer) {
    if (renderer instanceof THREE.WebGLRenderer) {
      renderer.setScissorTest(true);
      // everything outside should be discarded
      renderer.setScissor(this.insetPadding, this.insetPadding, this.insetWidth, this.insetHeight);
      renderer.setViewport(this.insetPadding, this.insetPadding, this.insetWidth, this.insetHeight);
      this.insetCamera.rotation.copy(this.cameraToFollow.rotation);
      renderer.clearDepth(); // important!
      renderer.render(this.scene, this.insetCamera);
      renderer.setScissorTest(false);
    }
  }
}
