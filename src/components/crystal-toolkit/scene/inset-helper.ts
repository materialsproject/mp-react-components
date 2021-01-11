import * as THREE from 'three';
import { getSceneWithBackground, ThreeBuilder } from './three_builder';
import { disposeSceneHierarchy } from '../utils';
import { ThreePosition } from './constants';

export enum ScenePosition {
  NW = 'NW',
  NE = 'NE',
  SE = 'SE',
  SW = 'SW',
  HIDDEN = 'HIDDEN',
}

const AXIS_RADIUS = 0.07;
const HEAD_AXIS_LENGTH = 0.24;
const HEAD_WIDTH = 0.14;
const MIN_SIZE = 50;
const DEFAULT_SIZE = 130;

export class InsetHelper {
  private insetCamera: THREE.OrthographicCamera;
  private frontRotation;
  private axisPadding = 0; // the space between the edge of the inset and the axis bounding box
  private scene: THREE.Scene;
  public helper;
  private axis;

  constructor(
    private detailedObject: THREE.Object3D,
    private axisJson: any,
    baseScene: THREE.Scene,
    private origin: ThreePosition,
    private cameraToFollow: THREE.Camera,
    private threebuilder: ThreeBuilder,
    private insetWidth = DEFAULT_SIZE,
    private insetHeight = DEFAULT_SIZE,
    private insetPadding = 0
  ) {
    this.axis = this.detailedObject;
    this.insetCamera = new THREE.OrthographicCamera(-4, 4, 4, -4, -10, 10);
    this.frontRotation = this.cameraToFollow.rotation.clone();
    this.scene = getSceneWithBackground({ transparentBackground: true, background: '#ffffff' });

    const baseLights = baseScene.getObjectByName('lights');
    if (!baseLights) {
      console.warn('no lights in base scene');
    } else {
      this.scene.add(baseLights.clone(true));
    }
    if (this.detailedObject) {
      this.scene.add(this.detailedObject);
      this.setup();
      this.helper = new THREE.CameraHelper(this.insetCamera);
      this.helper.update();
    }
  }
  private setup() {
    if (!this.detailedObject) {
      console.warn('setup should not be called if no detailedObject is there');
      return;
    }
    // put back the detailedObject in its normal scale for the calculation

    const box = new THREE.Box3().setFromObject(this.detailedObject);
    const maxDimension = Math.max(
      box.max.x - box.min.x,
      box.max.y - box.min.y,
      box.max.z - box.min.z
    );
    const [x, y, z] = this.origin;
    this.insetCamera.position.set(x, y, z);
    this.insetCamera.left = this.insetCamera.bottom = this.insetCamera.near = -maxDimension;
    this.insetCamera.right = this.insetCamera.top = this.insetCamera.far = maxDimension;
    this.insetCamera.rotation.set(
      this.frontRotation.x,
      this.frontRotation.y,
      this.frontRotation.z,
      this.frontRotation.order
    );
    this.insetCamera.zoom = 1;
    this.insetCamera.updateProjectionMatrix();
  }

  setAxis(axis, axisJson) {
    this.axis = axis;
    this.axisJson = axisJson;
  }

  makeObject(object_json) {
    const obj = new THREE.Object3D();

    return this.threebuilder.makeObject(object_json, obj);
  }

  public updateViewportsize(size: number, padding: number) {
    if (!size || !padding) {
      console.warn('fallback to default settings when resizing');
      return;
    }

    this.insetPadding = padding;

    if (size < MIN_SIZE) {
      size = MIN_SIZE;
    }
    if (size != this.insetHeight) {
      this.insetWidth = this.insetHeight = size;
      this.setup();
    }
  }

  public showObject(selection: THREE.Object3D[]) {
    const object = new THREE.Object3D();
    object.add(
      ...selection.map((a) => {
        const b = a.clone();
        b.matrixAutoUpdate = false;
        return b;
      })
    );
    this.updateSelectedObject(object, {});
  }

  public showAxis() {
    if (this.detailedObject === this.axis) {
      return;
    }
    this.updateSelectedObject(this.axis, this.axisJson);
  }

  public updateSelectedObject(object: THREE.Object3D, objectJson: any) {
    this.scene.remove(this.detailedObject);
    this.detailedObject = object;
    this.scene.add(this.detailedObject);
    if (objectJson.origin) {
      this.origin = objectJson.origin;
    } else {
      const box = new THREE.Box3().setFromObject(this.detailedObject);
      let center = new THREE.Vector3();
      box.getCenter(center);
      center = object.localToWorld(center);
      this.origin = [center.x, center.y, center.z];
    }

    // things work a bit by luck.. when we copy the object, we loose the parent frame
    // that's why the camera seems misplaced in the inset helper.. it's in fact because
    // the object itself is not in the same position in the inset view..
    // things looks correct in the debug view when there is no parent transformation
    // we'll need to bring back the parent transformation when cloning the object
    this.setup();
  }

  public render(renderer, [x, y]: [number, number]) {
    // NOTE(chab) this will not work with the SVG renderer, as it has no notion of
    // viewport, if we want the SVG render to work, we'll need to have a separated renderer
    if (renderer instanceof THREE.WebGLRenderer && this.detailedObject) {
      renderer.setScissorTest(true);
      // everything outside should be discarded
      renderer.setScissor(x, y, this.insetWidth, this.insetHeight);
      renderer.setViewport(x, y, this.insetWidth, this.insetHeight);
      this.insetCamera.rotation.copy(this.cameraToFollow.rotation);
      this.insetCamera.updateProjectionMatrix();
      renderer.render(this.scene, this.insetCamera);
      renderer.clearDepth(); // important! clear the depth buffer
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
    disposeSceneHierarchy(this.scene);
    // this.scene.dispose();
    // Note ONLY USE THIS PATTERN IN DISPOSAL METHOD
    this.cameraToFollow = (null as unknown) as THREE.Camera;
    this.insetCamera = (null as unknown) as THREE.OrthographicCamera;
    this.detailedObject = (null as unknown) as THREE.Object3D;
  }

  // TODO(chab) let's do something simple like having a width of 5 px
  private rescaleAxis() {
    // calculate scale
    const box = new THREE.Box3().setFromObject(this.detailedObject);
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
    this.axisJson.contents = this.axisJson.contents.map((a) => {
      return { ...a, radius: targetRadius, headLength: targetHeadLength, headWidth: targetWidth };
    });
    this.detailedObject.remove(
      this.detailedObject.children[0],
      this.detailedObject.children[1],
      this.detailedObject.children[2]
    );
    this.detailedObject.add(
      this.makeObject(this.axisJson.contents[0]),
      this.makeObject(this.axisJson.contents[1]),
      this.makeObject(this.axisJson.contents[2])
    );
  }
}
