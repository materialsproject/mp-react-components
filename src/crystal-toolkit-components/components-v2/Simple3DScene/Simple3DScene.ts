import * as THREE from 'three';
import { Object3D, Quaternion, Vector3, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer';
import {
  AnimationStyle,
  Control,
  defaults,
  ExportType,
  Renderer,
  ThreePosition
} from './constants';
import { TooltipHelper } from '../scene/tooltip-helper';
import { InsetHelper, ScenePosition } from '../scene/inset-helper';
import { getSceneWithBackground, ThreeBuilder } from './three_builder';
import { DebugHelper } from '../scene/debug-helper';
import {
  disposeSceneHierarchy,
  download,
  getScreenCoordinate,
  getThreeScreenCoordinate,
  moveAndUnprojectPoint,
  ObjectRegistry
} from './utils';
// @ts-ignore
//import img from './glass.png';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { SceneJsonObject } from '../scene/simple-scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AnimationHelper } from '../scene/animation-helper';
import './Simple3DScene.less';

const POINTER_CLASS = 'show-pointer';
let D;
export default class Simple3DScene {
  private settings;
  private renderer!: THREE.WebGLRenderer | SVGRenderer;
  private labelRenderer!: CSS2DRenderer;
  public scene!: THREE.Scene; // expose getter instead
  private cachedMountNodeSize!: { width: number; height: number };
  private camera!: THREE.OrthographicCamera;
  private frameId?: number;
  private clickableObjects: THREE.Object3D[] = [];
  private tooltipObjects: THREE.Object3D[] = [];
  private objectDictionnary: { [id: string]: any } = {};
  private controls;
  private tooltipHelper = new TooltipHelper();
  private axis!: Object3D;
  private axisJson: any;
  private inset!: InsetHelper;
  private inletPosition!: ScenePosition;
  private objectBuilder: ThreeBuilder;
  private clickCallback: (objects: any[]) => void;
  private debugHelper!: DebugHelper;
  private readonly raycaster = new THREE.Raycaster();
  private scenesContainer!: THREE.Object3D;

  private outline!: OutlineEffect;
  private outline!: OutlineEffect;
  private selectedJsonObjects: any[] = [];
  private outlineScene = new THREE.Scene();

  private threeUUIDTojsonObject: { [uuid: string]: any } = {};
  private computeIdToThree: { [id: string]: THREE.Object3D } = {};

  // handle multiSelection via shift key
  private isMultiSelectionEnabled = false;
  private registry = new ObjectRegistry();

  private clock = new THREE.Clock();
  private animationHelper: AnimationHelper;

  private cacheMountBBox(mountNode: Element) {
    this.cachedMountNodeSize = { width: mountNode.clientWidth, height: mountNode.clientHeight };
  }

  private determineSceneRenderer() {
    switch (this.settings.renderer) {
      case Renderer.WEBGL: {
        const renderer = new THREE.WebGLRenderer({
          antialias: this.settings.antialias,
          alpha: this.settings.transparentBackground
        });
        renderer.autoClear = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.gammaFactor = 2.2;
        renderer.setClearColor(0xfffff, 0.0);
        return renderer;
      }
      case Renderer.SVG: {
        return new SVGRenderer();
      }
      default: {
        console.error('Invalid renderer passed', this.settings.renderer);
        return null;
      }
    }
  }

  private configureSceneRenderer(mountNode: Element) {
    const renderer = this.determineSceneRenderer();
    if (!renderer) {
      throw new Error('No renderer');
    }
    this.renderer = renderer;
    this.renderer.setSize(this.cachedMountNodeSize.width, this.cachedMountNodeSize.height);
    //TODO(chab) This should be simpler
    mountNode.appendChild(this.renderer.domElement);
  }

  private configureLabelRenderer(mountNode: Element) {
    const labelRenderer = new CSS2DRenderer();
    this.labelRenderer = labelRenderer;
    const width = mountNode.clientWidth;
    const height = mountNode.clientHeight;
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'relative';
    labelRenderer.domElement.style.top = `-${height}px`;
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountNode.appendChild(labelRenderer.domElement);
  }

  mouseMoveListener = e => {
    if (this.renderer instanceof WebGLRenderer || true) {
      // tooltips
      let p = this.getClickedReference(e.offsetX, e.offsetY, this.tooltipObjects);
      if (p && p.object) {
        const { object, point } = p;
        this.tooltipHelper.updateTooltip(point, object!.jsonObject, object!.sceneObject);
        this.renderScene();
      } else {
        this.tooltipHelper.hideTooltipIfNeeded() && this.renderScene();
      }
      // change mouse pointer for clickable objects
      p = this.getClickedReference(e.offsetX, e.offsetY, this.clickableObjects);
      if (p && p.object) {
        this.renderer.domElement.classList.add(POINTER_CLASS);
      } else {
        this.renderer.domElement.classList.remove(POINTER_CLASS);
      }
    } else {
      console.warn('No mousemove implementation for SVG');
    }
  };
  clickListener = e => {
    if (this.renderer instanceof WebGLRenderer || true) {
      const p = this.getClickedReference(e.offsetX, e.offsetY, this.clickableObjects);
      this.onClickImplementation(p, e);
    } else {
      console.warn('No implementation of click for SVG');
    }
  };

  private configureScene() {
    this.scene = getSceneWithBackground(this.settings);
    this.clickableObjects = [];
    this.objectDictionnary = {};
    // default camera
    this.scenesContainer = new THREE.Object3D();
    this.scene.add(this.scenesContainer);
    this.camera = new THREE.OrthographicCamera(100, 100, 100, 100, 100);
    const lights = this.objectBuilder.makeLights(this.settings.lights);
    this.scene.add(lights);
    this.scene.add(this.tooltipHelper.tooltip);
    this.scene.add(this.camera);
    this.renderer.domElement.addEventListener('mousemove', this.mouseMoveListener);
    this.renderer.domElement.addEventListener('click', this.clickListener);
    // when the component is mounted, the camera can be updated in the same event loop
    // if the scene is configured
    // we defer the initialization of the control to the next event loop to avoid
    // some control events that would trigger unnecessary rendering
    setTimeout(() => this.configureControls(), 0);
  }

  private configureControls() {
    switch (this.settings.controls) {
      case Control.ORBIT: {
        const controls = new OrbitControls(this.camera, this.renderer.domElement as HTMLElement);
        controls.rotateSpeed = 2.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.enabled = true;
        this.controls = controls;
        break;
      }
      default: {
        const controls = new TrackballControls(
          this.camera,
          this.renderer.domElement as HTMLElement
        );
        controls.rotateSpeed = 2.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.enabled = true;
        controls.staticMoving = true;
        this.controls = controls;
        break;
      }
    }

    if (
      this.settings.staticScene ||
      this.settings.animation === AnimationStyle.NONE ||
      this.settings.animation === AnimationStyle.SLIDER
    ) {
      // only re-render when scene is rotated
      this.controls.addEventListener('change', () => {
        this.dispatch(this.camera.position, this.camera.quaternion, this.camera.zoom);
        this.renderScene();
      });
      this.controls.addEventListener('start', () => {
        this.controls.update();
        this.settings.controls === Control.TRACKBALL &&
          document.addEventListener('mousemove', this.mouseTrackballUpdate, false);
      });
      this.controls.addEventListener('end', () => {
        this.controls.update();
        this.settings.controls === Control.TRACKBALL &&
          document.removeEventListener('mousemove', this.mouseTrackballUpdate, false);
      });
    } else {
      // constantly re-render (for animation)
      this.start();
    }
  }

  private readonly mouseTrackballUpdate = () => {
    this.controls.update();
  };

  public updateCamera(position: Vector3, rotation: Quaternion, zoom: number) {
    // zoom seems to be updated, be not rendered
    this.camera.zoom = zoom;
    this.camera.position.copy(position);
    this.camera.quaternion.copy(rotation);
    this.camera.updateProjectionMatrix(); // needed for the zoom
    this.renderScene();
  }

  private onClickImplementation(p, e) {
    let needRedraw = false;
    //TODO(chab) make it more readale
    if (p && p.object) {
      const { object, point } = p;
      if (object?.sceneObject) {
        const sceneObject: Object3D = object?.sceneObject;
        const jsonObject: Object3D = object?.jsonObject;
        if (this.isMultiSelectionEnabled) {
          // if the object is not in the registry, it just means it's the first time
          // we select it
          const objectIndex = this.outlineScene.children.indexOf(
            this.registry.getObjectFromRegistry(sceneObject.uuid)
          );
          const jsonObjectIndex = this.selectedJsonObjects.indexOf(jsonObject);
          if (
            (objectIndex === -1 && jsonObjectIndex > -1) ||
            (jsonObjectIndex === -1 && objectIndex > -1)
          ) {
            console.warn(
              'During selection found a THREE object without a corresponding json object ( or vice-versa'
            );
            console.warn('THREE OBJECT', object, 'JSON', jsonObject);
          }

          if (jsonObjectIndex > -1) {
            this.selectedJsonObjects.splice(jsonObjectIndex, 1);
          } else {
            if (e.shiftKey) {
              this.selectedJsonObjects.push(jsonObject);
            } else {
              this.selectedJsonObjects = [jsonObject];
            }
          }

          //TODO(chab) log warning if we have a json object without a three object, and vice-versa
          if (objectIndex > -1) {
            const object = this.outlineScene.children[objectIndex];
            const sceneObject = this.registry.getObjectFromRegistry(object.uuid);
            this.outlineScene.remove(sceneObject);
          } else {
            if (!this.registry.registryHasObject(sceneObject)) {
              this.addClonedObject(sceneObject);
            }
            const threeObjectForOutlineScene = this.registry.getObjectFromRegistry(
              sceneObject.uuid
            );
            if (e.shiftKey) {
              this.outlineScene.add(threeObjectForOutlineScene);
            } else {
              if (this.outlineScene.children.length > 0) {
                this.outlineScene.remove(...this.outlineScene.children);
              }
              this.outlineScene.add(threeObjectForOutlineScene);
            }
          }
        } else {
          disposeSceneHierarchy(this.outlineScene);
          if (!this.registry.registryHasObject(sceneObject)) {
            this.addClonedObject(sceneObject);
          }
          const threeObjectForOutlineScene = this.registry.getObjectFromRegistry(sceneObject.uuid);
          if (this.outlineScene.children.length > 0) {
            this.outlineScene.remove(...this.outlineScene.children);
          }
          this.outlineScene.add(threeObjectForOutlineScene);
          this.selectedJsonObjects = [jsonObject];
        }
        needRedraw = true;
      }
      this.clickCallback(this.selectedJsonObjects);
    } else {
      if (this.selectedJsonObjects.length > 0) {
        this.clickCallback([]);
      }

      this.selectedJsonObjects = [];
      if (this.outlineScene.children.length > 0) {
        disposeSceneHierarchy(this.outlineScene);
        this.outlineScene.remove(...this.outlineScene.children);
        needRedraw = true;
      }
    }

    if (this.settings.secondaryObjectView) {
      this.outlineScene.children.length > 0
        ? this.inset.showObject(this.outlineScene.children)
        : this.inset.showAxis();
    }
    needRedraw && this.renderScene();
  }

  private addClonedObject(sceneObject: THREE.Object3D) {
    const clone = sceneObject.clone();
    clone.matrixAutoUpdate = false;
    clone.uuid = sceneObject.uuid;
    this.registry.addToObjectRegisty(clone);
  }

  public updateAnimationStyle(animationStyle: AnimationStyle) {
    this.settings.animation = animationStyle;
    switch (animationStyle) {
      case AnimationStyle.SLIDER:
      case AnimationStyle.NONE: {
        setTimeout(() => this.stop(), 0);
        break;
      }
      case AnimationStyle.PLAY: {
        setTimeout(() => this.start(), 0);
      }
    }
  }

  private readonly windowListener = () => this.resizeRendererToDisplaySize();

  constructor(
    sceneJson,
    domElement: Element,
    settings,
    size,
    padding,
    clickCallback,
    private dispatch: (p: Vector3, r: Quaternion, zoom: number) => void,
    private debugDOMElement?
  ) {
    this.settings = Object.assign(defaults, settings);
    this.objectBuilder = new ThreeBuilder(this.settings);
    this.cacheMountBBox(domElement);
    this.configureSceneRenderer(domElement);
    this.configureLabelRenderer(domElement);
    this.configureScene();
    this.configurePostProcessing();
    this.clickCallback = clickCallback;
    this.outlineScene.autoUpdate = false;
    this.animationHelper = new AnimationHelper(this.objectBuilder);
    window.addEventListener('resize', this.windowListener, false);
    this.inset = new InsetHelper(
      this.axis,
      this.axisJson,
      this.scene,
      sceneJson.origin,
      this.camera,
      this.objectBuilder,
      size,
      size,
      padding
    );
    if (this.debugDOMElement) {
      this.debugHelper = this.getHelper();
    }
    this.isMultiSelectionEnabled = this.settings.isMultiSelectionEnabled;
  }

  updateInsetSettings(inletSize: number, inletPadding: number, axisView) {
    this.inletPosition = axisView as ScenePosition;
    if (this.axis) {
      this.inset.updateViewportsize(inletSize, inletPadding);
    }
    this.renderInlet();
  }

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement as HTMLCanvasElement;
    this.cacheMountBBox(canvas.parentElement as Element);
    const { width, height } = this.cachedMountNodeSize;
    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.top = `-${height}px`;
    if (this.renderer instanceof SVGRenderer) {
      this.renderer.setSize(width, height);
    }
    if (canvas.width !== width || canvas.height !== height) {
      this.renderScene();
    }
  }

  cloneElement(element: THREE.Object3D, displacement: [number, number, number]) {
    const clone = element.clone();
    clone.translateX(displacement[0]);
    clone.translateY(displacement[1]);
    clone.translateZ(displacement[2]);
    this.scene.add(clone);
  }

  cloneScene(sceneJson, x, y, z, iterations) {
    for (let i = 0; i < iterations; i++) {
      const newScene = JSON.parse(JSON.stringify(sceneJson));
      newScene.name = newScene.name + '_clone_' + i;
      newScene.origin = [
        newScene.origin[0] + x * (i + 1),
        newScene.origin[1] + y * (i + 1),
        newScene.origin[2] + z * (i + 1)
      ];
      this.addToScene(newScene);
    }
  }

  addToScene(sceneJson: SceneJsonObject, bypassRendering = false) {
    // we need to clarify the  current semantics
    // currently, it will remove the old scene if the name is the same,
    // otherwise it will keep it
    // it will then zoom on the content of the added scene

    // if we found an object, we should remove all tootips and clicks related to it
    let outlinedObject: string[] = [];
    if (this.scene.getObjectByName(sceneJson.name!)) {
      console.log('Regenerating scene');
      // see https://jsfiddle.net/L981td24/17/
      this.animationHelper.reset();
      this.clickableObjects = [];
      this.tooltipObjects = [];
      this.threeUUIDTojsonObject = {};
      this.computeIdToThree = {};
      this.registry.clear();
      this.removeObjectByName(sceneJson.name!);
      if (this.outlineScene.children.length > 0) {
        outlinedObject = this.selectedJsonObjects.map(o => o.id);
        console.log(outlinedObject);
        this.outlineScene.remove(...this.outlineScene.children);
      }
      this.selectedJsonObjects = [];
    } else {
      console.log('The scene is a new scene:', sceneJson.name);
    }

    // recursively visit the scene, starting with the root object
    const traverse_scene = (o: SceneJsonObject, parent: THREE.Object3D, currentId: string) => {
      o.contents!.forEach((childObject, idx) => {
        if (childObject.type) {
          const object = this.makeObject(childObject);
          parent.add(object);
          this.threeUUIDTojsonObject[object.uuid] = childObject;
          this.computeIdToThree[`${currentId}--${idx}`] = object;
          childObject.id = `${currentId}--${idx}`;
          if (childObject.animate) {
            objectToAnimate.add(`${currentId}--${idx}`);
          }
        } else {
          const threeObject = new THREE.Object3D();
          threeObject.name = childObject.name!;
          this.computeIdToThree[`${currentId}--${threeObject.name}`] = threeObject;
          childObject.id = `${currentId}--${threeObject.name}`;
          threeObject.visible = childObject.visible === undefined ? true : !!childObject.visible;
          if (childObject.origin) {
            const translation = new THREE.Matrix4();
            // note(chab) have a typedefinition for the JSON
            translation.makeTranslation(...(childObject.origin as ThreePosition));
            threeObject.applyMatrix4(translation);
            console.log('>>>>>.', translation, childObject.origin, childObject.id);
          }
          if (!this.settings.extractAxis || threeObject.name !== 'axes') {
            parent.add(threeObject);
          }
          traverse_scene(childObject, threeObject, `${currentId}--${threeObject.name}`);
          if (threeObject.name === 'axes') {
            this.axis = threeObject.clone();
            this.axisJson = { ...childObject };
          }
        }
      });
    };
    const objectToAnimate = new Set<string>();

    // add initial object
    const rootObject = new THREE.Object3D();
    rootObject.name = sceneJson.name!;
    sceneJson.visible && (rootObject.visible = sceneJson.visible);
    const translation = new THREE.Matrix4();
    // note(chab) have a typedefinition for the JSON
    translation.makeTranslation(...(sceneJson.origin as ThreePosition));
    rootObject.applyMatrix4(translation);
    traverse_scene(sceneJson, rootObject, '');
    // can cause memory leak
    //console.log('rootObject', rootObject, rootObject);
    this.scenesContainer.add(rootObject);

    if (sceneJson.repeat) {
      const vectorA = sceneJson.lattice[0];
      const vectorB = sceneJson.lattice[1];
      const vectorC = sceneJson.lattice[2];

      for (let i = 0; i < sceneJson.repeat[0]; i++) {
        for (let j = 0; j < sceneJson.repeat[1]; j++) {
          for (let k = 0; k < sceneJson.repeat[2]; k++) {
            const rootObject = new THREE.Object3D();
            rootObject.name = sceneJson.name!;
            sceneJson.visible && (rootObject.visible = sceneJson.visible);
            const translation = new THREE.Matrix4();
            // note(chab) have a typedefinition for the JSON
            const origin = [
              sceneJson.origin![0] + vectorA[0] * i + vectorB[0] * j + vectorC[0] * k,
              sceneJson.origin![1] + vectorA[1] * i + vectorB[1] * j + vectorC[1] * k,
              sceneJson.origin![2] + vectorA[2] * i + vectorB[2] * j + vectorC[2] * k
            ];
            console.log(origin);
            translation.makeTranslation(...(origin as ThreePosition));
            rootObject.applyMatrix4(translation);
            traverse_scene(sceneJson, rootObject, '');
            this.scenesContainer.add(rootObject);
          }
        }
      }
    }
    /*

        for (let k = 0; k < repeat; k++) {
          const rootObject = new THREE.Object3D();
          rootObject.name = sceneJson.name!;
          sceneJson.visible && (rootObject.visible = sceneJson.visible);
          const translation = new THREE.Matrix4();
          // note(chab) have a typedefinition for the JSON
          const origin = [
            sceneJson.origin![0] + vector[0] * (k + 1),
            sceneJson.origin![1] + vector[1] * (k + 1),
            sceneJson.origin![2] + vector[2] * (k + 1)
          ];
          console.log(origin);
          translation.makeTranslation(...(origin as ThreePosition));
          rootObject.applyMatrix4(translation);
          traverse_scene(sceneJson, rootObject, '');
          this.scenesContainer.add(rootObject);
        }
      }
    }*/
    this.setupCamera(this.scenesContainer);

    // we try to update the outline from the preceding scene, but if the corresponding
    // object is not there, we'll remove the outline
    if (outlinedObject.length > 0) {
      this.outlineScene.remove(...this.outlineScene.children);
      outlinedObject.forEach(id => {
        const three = this.computeIdToThree[id];
        if (three) {
          this.addClonedObject(three);
          this.outlineScene.add(this.registry.getObjectFromRegistry(three.uuid));
          this.selectedJsonObjects.push(this.threeUUIDTojsonObject[three.uuid]);
        } else {
          // object has been removed from new scene, so we do not add it
        }
      });
      // update inlet
      this.outlineScene.children.length > 0 && this.inset.showObject(this.outlineScene.children);
    }

    // we can automatically output a screenshot to be the background of the parent div
    // this helps for automated testing, printing the web page, etc.
    if (this.settings.renderDivBackground) {
      this.renderer.domElement.parentElement!.style.backgroundSize = '100%';
      this.renderer.domElement.parentElement!.style.backgroundRepeat = 'no-repeat';
      this.renderer.domElement.parentElement!.style.backgroundPosition = 'center';
      if (this.renderer.domElement instanceof HTMLCanvasElement) {
        // TS magic, domElements is automatically coerced to HTMLCanvasElement
        this.renderer.domElement.parentElement!.style.backgroundImage = `url('${this.renderer.domElement.toDataURL(
          'image/png'
        )}')`;
      }
    }

    //FIXME(chab) try to move that before
    if (this.inset && !!this.axis && !!this.axisJson && this.outlineScene.children.length === 0) {
      this.inset.setAxis(this.axis, this.axisJson);
      this.inset.updateSelectedObject(this.axis, this.axisJson);
    }

    objectToAnimate.forEach((id: string) => {
      const three = this.computeIdToThree[id];
      const json: SceneJsonObject = this.threeUUIDTojsonObject[three.uuid];
      this.animationHelper.buildAnimationSupport(json, three);
    });
    if (!bypassRendering) {
      this.renderScene();
    }
  }

  private setupCamera(rootObject: THREE.Object3D) {
    // auto-zoom to fit object
    // TODO: maybe better to move this elsewhere (what if using perspective?)
    const box = new THREE.Box3();
    box.setFromObject(rootObject);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const length = box.max.sub(box.min).length() * 2;

    const bboxobject = new THREE.Box3Helper(box, new THREE.Color('blue'));
    this.scenesContainer.add(bboxobject);
    // we add a bit of padding, let's suppose we rotate, we want to avoid the
    // object to go out of the camera
    // we add a lot of padding to make sure the camera is always beyond/behind the object
    const Z_PADDING = 5;
    if (this.camera) {
      this.camera.left = center.x - length;
      this.camera.right = center.x + length;
      this.camera.top = center.y + length;
      this.camera.bottom = center.y - length;
      this.camera.near = center.z - length;
      this.camera.far = center.z + length;
    } else {
      this.camera = new THREE.OrthographicCamera(
        center.x - length,
        center.x + length,
        center.y + length,
        center.y - length,
        center.z - length - Z_PADDING,
        center.z + length + Z_PADDING
      );
    }

    this.camera.zoom = 4;
    // we put the camera behind the object, object should be in the middle of the view, closer to the far plane
    this.camera.position.z = center.z + length / 2;
    this.camera.position.y = center.y;
    this.camera.position.x = center.x;
    this.camera.lookAt(this.scene.position);

    this.camera.updateProjectionMatrix();
    this.camera.updateMatrix();
    if (this.controls) {
      this.controls.update();
    }
  }

  makeObject(object_json): THREE.Object3D {
    const obj = new THREE.Object3D();

    if (object_json.clickable) {
      this.clickableObjects.push(obj);
      this.objectDictionnary[obj.id] = object_json;
    }

    if (object_json.tooltip) {
      this.tooltipObjects.push(obj);
      this.objectDictionnary[obj.id] = object_json;
    }

    return this.objectBuilder.makeObject(object_json, obj);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(() => this.animate());
    } else {
      console.warn('Trying to start animation, but it seems an animation loop is already running');
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId!);
    this.frameId = undefined;
  }

  animate() {
    this.animationHelper.animate();

    this.controls.update();
    this.refreshOutline();
    this.renderScene();

    this.frameId = window.requestAnimationFrame(() => this.animate());
  }

  renderScene() {
    if (this.renderer instanceof WebGLRenderer) {
      this.renderer.clear();
      this.renderer.setSize(this.cachedMountNodeSize.width, this.cachedMountNodeSize.height);
      //TODO(chab) not sure to understand why we have to turn on/off scissor tests between renderings
      this.renderer.setScissorTest(true);
      this.renderer.setScissor(
        0,
        0,
        this.cachedMountNodeSize.width,
        this.cachedMountNodeSize.height
      );
      this.renderer.setViewport(
        0,
        0,
        this.cachedMountNodeSize.width,
        this.cachedMountNodeSize.height
      );
    }

    this.renderer.render(this.scene, this.camera);

    if (this.outline && this.outlineScene.children.length > 0) {
      this.outline.renderOutline(this.outlineScene, this.camera);
    }
    this.labelRenderer.render(this.scene, this.camera);

    if (this.renderer instanceof WebGLRenderer) {
      (this.renderer as any).clearDepth();
    }

    // debug view
    if (this.debugHelper) {
      this.debugHelper.render();
    }

    //TODO(chab) make a dedicated rendering for SVG
    this.renderInlet();
  }

  private renderInlet() {
    this.inset &&
      this.inletPosition !== ScenePosition.HIDDEN &&
      this.inset.render(this.renderer, this.getInletOrigin(this.inletPosition));
  }

  toggleVisibility(namesToVisibility: { [objectName: string]: boolean }) {
    if (!!namesToVisibility && Object.keys(namesToVisibility).length > 0) {
      Object.keys(namesToVisibility).forEach(objName => {
        const obj = this.scene.getObjectByName(objName);
        if (obj) {
          obj.visible = !!namesToVisibility[objName];
        }
      });
      // check all outlined objects, for each outlined object, their ancestors visibility can be false
      // if it's the case, we'll need to remove the outlined object
      // note that we consider that the selection is lost
      const idsToRemove: string[] = [];
      this.selectedJsonObjects = this.selectedJsonObjects.filter(o => {
        let threeobject = this.computeIdToThree[o.id];
        let visible = true;
        if (!threeobject.visible) {
          idsToRemove.push(threeobject.uuid);
          return false;
        } else {
          const baseObject = threeobject;
          // walk the object hierarchy to check if parent are visible
          while (threeobject.parent && visible) {
            threeobject = threeobject.parent;
            visible = threeobject.visible;
          }
          // if it's not visible, remove it
          !visible && idsToRemove.push(baseObject.uuid);
        }
        return visible;
      });
      idsToRemove.forEach(id => {
        const outlineObject = this.registry.getObjectFromRegistry(id);
        this.outlineScene.remove(outlineObject);
        // remove from inlet too
      });
      this.renderScene();
    }
  }

  // i know this is can be done by implementing a color buffer, with each color matching one
  // object
  getClickedReference(clientX: number, clientY: number, objectsToCheck: Object3D[]) {
    //FIXME(chab) ideally we should recompute the objectsToCheck array for better performance
    if (!objectsToCheck || objectsToCheck.length === 0) {
      return;
    }
    const size = new THREE.Vector2(this.cachedMountNodeSize.width, this.cachedMountNodeSize.height);
    this.raycaster.setFromCamera(getThreeScreenCoordinate(size, clientX, clientY), this.camera);
    const intersects = this.raycaster.intersectObjects(objectsToCheck, true);
    if (intersects.length > 0) {
      // we catch the first object that the ray touches
      let point = intersects[0].point;
      const screenPoint = getScreenCoordinate(this.cachedMountNodeSize, point, this.camera);
      const finalPoint = moveAndUnprojectPoint(this.cachedMountNodeSize, screenPoint, this.camera, {
        x: 0,
        y: -30
      });
      const info = {
        point: finalPoint,
        object: this.getParentObject(intersects[0].object)
      };
      return info;
    }
    return null;
  }

  getParentObject(object: Object3D): { sceneObject: Object3D; jsonObject: any } | null {
    if (!object.parent || !object.parent.visible || !object.visible) {
      return null;
    }
    if (!this.objectDictionnary[object.id]) {
      return this.getParentObject(object.parent);
    } else {
      return { sceneObject: object, jsonObject: this.objectDictionnary[object.id] };
    }
  }

  public enableDebug(debugEnabled: boolean, node) {
    if (!debugEnabled) {
      if (!this.debugHelper) {
        console.warn('Turning off debug, while its not on');
      } else {
        this.debugHelper.onDestroy();
        this.debugHelper = (null as unknown) as DebugHelper;
      }
    } else {
      if (this.debugHelper) {
        console.warn('Turning on debug, while its not off');
      } else {
        this.debugDOMElement = node;
        this.debugHelper = this.getHelper();
        this.debugHelper.render();
      }
    }
  }

  public removeListener() {
    window.removeEventListener('resize', this.windowListener, false);
    this.renderer.domElement.removeEventListener('mousemove', this.mouseMoveListener);
    this.renderer.domElement.removeEventListener('click', this.clickListener);
    document.removeEventListener('mousemove', this.mouseTrackballUpdate, false);
  }

  // call this when the parent component is destroyed
  public onDestroy() {
    this.computeIdToThree = {};
    this.threeUUIDTojsonObject = {};
    this.removeListener();
    this.debugHelper && this.debugHelper.onDestroy();
    this.inset.onDestroy();
    this.controls.dispose();
    disposeSceneHierarchy(this.scene);
    this.scene.dispose();
    if (this.renderer instanceof THREE.WebGLRenderer) {
      this.renderer.forceContextLoss();
      this.renderer.dispose();
    }
    this.renderer.domElement!.parentElement!.removeChild(this.renderer.domElement);
    this.renderer.domElement = undefined as any;
    this.renderer = null as any;
    this.stop();
  }

  removeObjectByName(name: string) {
    // name is not necessarily unique, make this recursive ?
    const object = this.scene.getObjectByName(name);
    typeof object !== 'undefined' && this.scene.remove(object);
  }

  private getHelper() {
    return new DebugHelper(
      this.debugDOMElement,
      this.scene,
      this.camera,
      this.settings,
      this.objectBuilder,
      this.inset.helper
    );
  }

  private getInletOrigin(pos: ScenePosition): [number, number] {
    switch (pos) {
      case ScenePosition.SW: {
        return [this.inset.getPadding(), this.inset.getPadding()];
      }
      case ScenePosition.SE: {
        return [
          this.cachedMountNodeSize.width - this.inset.getPadding() - this.inset.getSize(),
          this.inset.getPadding()
        ];
      }
      case ScenePosition.NW: {
        return [
          0 + this.inset.getPadding(),
          this.cachedMountNodeSize.height - this.inset.getPadding() - this.inset.getSize()
        ];
      }
      case ScenePosition.NE: {
        return [
          this.cachedMountNodeSize.width - this.inset.getPadding() - this.inset.getSize(),
          this.cachedMountNodeSize.height - this.inset.getPadding() - this.inset.getSize()
        ];
      }
      default:
        return [this.inset.getPadding(), this.inset.getPadding()];
    }
  }

  private configurePostProcessing() {
    if (this.settings.renderer === Renderer.SVG) {
      console.warn('No post processing pass for SVG');
      return;
    }
    //TODO(chab) look at three.js to implement the texture
    const outline = new OutlineEffect(this.renderer as WebGLRenderer, {
      defaultThickness: 0.01,
      defaultColor: [0, 0, 0],
      defaultAlpha: 1.0,
      defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
    });
    this.outline = outline;
  }

  public findObjectByUUID(uuid: string) {
    const threeObject = this.scene.getObjectByProperty('uuid', uuid);
    const jsonObject = this.threeUUIDTojsonObject[uuid];
    return {
      threeObject,
      jsonObject
    };
  }

  refreshOutline() {
    let outlinedObject: any[] = [];
    if (this.outlineScene.children.length > 0) {
      outlinedObject = this.selectedJsonObjects.map((o: any) => o.id);
      this.outlineScene.remove(...this.outlineScene.children);
    }
    if (outlinedObject.length > 0) {
      this.outlineScene.remove(...this.outlineScene.children);
      outlinedObject.forEach(id => {
        const three = this.computeIdToThree[id];
        this.addClonedObject(three);
        this.outlineScene.add(this.registry.getObjectFromRegistry(three.uuid));
      });
    }
  }

  updateTime(time: number) {
    this.animationHelper.updateTime(time);
    this.refreshOutline();
    this.renderScene();
  }

  // for testing purposes
  public download() {
    download('rr', ExportType.png, this);
  }
}
