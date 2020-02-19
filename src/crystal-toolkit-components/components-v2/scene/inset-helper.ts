import * as THREE from 'three';
import { getSceneWithBackground, ThreeBuilder } from '../Simple3DScene/three_builder';

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
  private axisPadding = 1; // the space between the edge of the inset and the axis bounding box
  private scene: THREE.Scene;

  constructor(
    private axis: THREE.Object3D,
    private axisJson: any,
    baseScene: THREE.Scene,
    private origin: [number, number, number],
    private cameraToFollow: THREE.Camera,
    private threebuilder: ThreeBuilder,
    private insetWidth = 130,
    private insetHeight = 130,
    private insetPadding = 0
  ) {
    //TODO(chab) extract the cube from the axis
    this.insetCamera = new THREE.OrthographicCamera(-4, 4, 4, -4, -20, 20);
    this.frontRotation = this.cameraToFollow.rotation.clone();
    this.scene = getSceneWithBackground({ transparentBackground: true });
    this.scene.background = new THREE.Color('#ffffff');
    const baseLights = baseScene.getObjectByName('lights');
    if (!baseLights) {
      console.warn('no lights in base scene');
    } else {
      this.scene.add(baseLights.clone(true));
    }
    if (this.axis) {
      this.scene.add(this.axis);
      this.setup();
    }
  }
  private setup() {
    if (!this.axis) {
      console.warn('setup should not be called if no axis is there');
      return;
    }

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
    const size = new THREE.Vector3();
    box.getSize(size);
    size.project(this.insetCamera);
    let widthOnScreenBuffer = Math.max(size.x, size.y, size.z);
    const width = (widthOnScreenBuffer / 2) * this.insetWidth;
    // the axis is always centered, so the max extent of its box should match half of the screen
    // ( e.g consider a edge case of all axis point in the same direction, if the BB
    // take all the size, it will overflow)
    const scale = (this.insetWidth / 2 - this.axisPadding * 2) / width;
    // maybe we should do is to consider the origin in the axis, in the bounding box
    // and find the largest vector from center - bbextent, this will tell us how much
    // the axis need from the center to one point

    // manually rescale axis properties, so it looks not too thin
    const targetRadius = AXIS_RADIUS * (scale / 1.5);
    const targetHeadLength = HEAD_AXIS_LENGTH * (scale / 1.5);
    const targetWidth = HEAD_WIDTH * (scale / 1.5);
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

    this.axis.scale.set(scale, scale, scale);
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
    if (renderer instanceof THREE.WebGLRenderer && this.axis) {
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

  public onDestroy() {
    this.scene.dispose();
    // Note ONLY USE THIS PATTERN IN DISPOSAL METHOD
    this.cameraToFollow = (null as unknown) as THREE.Camera;
    this.insetCamera = (null as unknown) as THREE.OrthographicCamera;
    this.axis = (null as unknown) as THREE.Object3D;
  }
}
