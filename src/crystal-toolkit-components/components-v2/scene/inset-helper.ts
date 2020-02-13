import * as THREE from 'three';

export class InsetHelper {
  private insetCamera: THREE.Camera;
  private frontRotation;

  constructor(
    private axis: THREE.Object3D,
    private insetScene: THREE.Scene,
    private origin: [number, number, number],
    private cameraToFollow: THREE.Camera,
    private insetWidth = 100,
    private insetHeight = 100,
    private insetPadding = 10
  ) {
    //TODO(chab) extract the cube from the axis
    this.insetCamera = new THREE.OrthographicCamera(-4, 4, 4, -4, -20, 20);
    this.frontRotation = this.cameraToFollow.rotation.clone();
    this.setup();
  }
  private setup() {
    this.insetCamera.position.z = -2;
    const [x, y, z] = this.origin;
    this.insetCamera.position.set(x, y, z);
    this.insetCamera.rotation.copy(this.frontRotation);
    this.insetCamera.updateMatrix();
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
    let c = center
      .clone()
      .add(new THREE.Vector3(extents.x, extents.y, extents.z))
      .project(this.insetCamera);
    let d = center
      .clone()
      .add(new THREE.Vector3(-extents.x, extents.y, -extents.z))
      .project(this.insetCamera);

    let widthOnScreenBuffer = Math.max(a.distanceTo(b));
    const width = (widthOnScreenBuffer / 2) * this.insetWidth;
    const scale = this.insetWidth / 2 / width;
    this.axis.scale.set(scale, scale, scale);
    this.insetCamera.position.set(x * scale, y * scale, z * scale);
  }

  public updateAxis(axis) {
    this.insetScene.remove(this.axis);
    this.axis = axis;
    this.insetScene.add(this.axis);
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
      renderer.render(this.insetScene, this.insetCamera);
      renderer.setScissorTest(false);
    }
  }
}
