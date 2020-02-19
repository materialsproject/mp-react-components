import * as THREE from 'three';
import { getSceneWithBackground } from '../Simple3DScene/Simple3DScene';
import { ThreeBuilder } from '../Simple3DScene/three_builder';

export enum ScenePosition {
  NW = 'NW',
  NE = 'NE',
  SE = 'SE',
  SW = 'SW',
  HIDDEN = 'HIDDEN'
}

const AXIS_RADIUS = 0.07;
const HEAD_AXIS_LENGTH = 0.24;
const HEAD_WIDTH = 0.14;

export class InsetHelper {
  private insetCamera: THREE.OrthographicCamera;
  private frontRotation;
  private axisPadding = 10; // the space between the edge of the inset and the axis bounding box
  private scene: THREE.Scene;

  constructor(
    private axis: THREE.Object3D,
    private axisJson: any,
    baseScene: THREE.Scene,
    private origin: [number, number, number],
    private cameraToFollow: THREE.Camera,
    private threebuilder: ThreeBuilder,
    private insetWidth = 200,
    private insetHeight = 200,
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

    // calculate scale
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

    // we should perform the calculation for both width and height, and take the smallest one
    let widthOnScreenBuffer = Math.min(a.distanceTo(b));
    const width = (widthOnScreenBuffer / 2) * this.insetWidth;
    const scale = (this.insetWidth / 2 - this.axisPadding) / width;

    this.axis.scale.set(scale, scale, scale);
    // the axis are set to fill up the second view, now we want to compensate the scaling we did
    // we are going to add a bigger radius

    // to be pixel perfect, we should calculate the length of the end of the arrow and remove it

    const targetRadius = AXIS_RADIUS / (scale / 1.7);
    const targetHeadLength = HEAD_AXIS_LENGTH / (scale / 1.7);
    const targetWidth = HEAD_WIDTH / (scale / 1.7);
    // we assume an axis is made of three arrows and one sphere
    this.axisJson.contents = this.axisJson.contents.map(a => {
      return { ...a, radius: targetRadius, headLength: targetHeadLength, headWidth: targetWidth };
    });
    this.axis.remove(this.axis.children[0], this.axis.children[1], this.axis.children[2]);
    this.axis.add(
      this.makeObject(this.axisJson.contents[0]),
      this.makeObject(this.axisJson.contents[1]),
      this.makeObject(this.axisJson.contents[2])
    );

    this.insetCamera.position.set(x * scale, y * scale, z * scale);
    this.insetCamera.updateProjectionMatrix();
  }

  makeObject(object_json) {
    const obj = new THREE.Object3D();

    return this.threebuilder.makeObject(object_json, obj);
  }

  public updateViewportsize(size, padding) {
    if (!size || !padding) {
      console.warn('fallback to default settings when resizing');
      return;
    }

    this.insetPadding = padding;

    if (size < 50) {
      size = 50;
    }
    if (size != this.insetHeight) {
      this.insetWidth = this.insetHeight = size;
      this.setup();
    }
  }

  public updateAxis(axis, axisJson) {
    this.scene.remove(this.axis);
    this.axis = axis;
    this.axisJson = axisJson;
    this.scene.add(this.axis);
    this.setup();
  }

  public render(renderer, [x, y]: any) {
    if (renderer instanceof THREE.WebGLRenderer) {
      renderer.setScissorTest(true);
      // everything outside should be discarded
      renderer.setScissor(x, y, this.insetWidth, this.insetHeight);
      renderer.setViewport(x, y, this.insetWidth, this.insetHeight);
      this.insetCamera.rotation.copy(this.cameraToFollow.rotation);
      renderer.clearDepth(); // important!
      renderer.render(this.scene, this.insetCamera);
      renderer.setScissorTest(false);
    }
  }

  public getPadding() {
    return this.insetPadding;
  }

  public getSize() {
    return this.insetWidth;
  }
}
