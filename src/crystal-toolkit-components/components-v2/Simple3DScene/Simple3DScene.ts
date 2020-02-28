import * as THREE from 'three';
import { Matrix4, Object3D, Quaternion, Vector3, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer';
import { defaults, Renderer } from './constants';
import { TooltipHelper } from '../scene/tooltip-helper';
import { InsetHelper, ScenePosition } from '../scene/inset-helper';
import { getSceneWithBackground, ThreeBuilder } from './three_builder';
import { DebugHelper } from '../scene/debug-helper';
import { disposeSceneHierarchy, getThreeScreenCoordinate } from './utils';
import { OrbitControls } from './orbitControls';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// @ts-ignore
import img from './glass.png'; // texture for selected elements

// note that it uses substractive blending, so colors are actually inverted
const OUTLINE_COLOR = new THREE.Color('#FFFFFF');
const POINTER_CLASS = 'show-pointer';

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

  private outlinePass!: OutlinePass;
  private composer!: EffectComposer;
  private selectedJsonObjects: any[] = [];

  // handle multiSelection via shift key
  private isMultiSelectionEnabled = true;

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
        renderer.gammaFactor = 2.2;
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

  private configureScene(sceneJson) {
    this.scene = getSceneWithBackground(this.settings);
    this.addToScene(sceneJson);
    const lights = this.objectBuilder.makeLights(this.settings.lights);
    this.scene.add(lights);
    this.scene.add(this.tooltipHelper.tooltip);
    const controls = new OrbitControls(this.camera, this.renderer.domElement as HTMLElement);
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.enabled = true;
    this.renderer.domElement.addEventListener('mousemove', (e: any) => {
      if (this.renderer instanceof WebGLRenderer) {
        // tooltips
        let p = this.getClickedReference(e.offsetX, e.offsetY, this.tooltipObjects);
        if (p) {
          const { object, point } = p;
          this.tooltipHelper.updateTooltip(point, object!.jsonObject, object!.sceneObject);
          this.renderScene();
        } else {
          this.tooltipHelper.hideTooltipIfNeeded() && this.renderScene();
        }
        // change mouse pointer for clickable objects
        p = this.getClickedReference(e.offsetX, e.offsetY, this.clickableObjects);
        if (p) {
          document.querySelector('body')!.classList.add(POINTER_CLASS);
        } else {
          document.querySelector('body')!.classList.remove(POINTER_CLASS);
        }
      } else {
        console.warn('No mousemove implementation for SVG');
      }
    });

    this.renderer.domElement.addEventListener('click', (e: any) => {
      if (this.renderer instanceof WebGLRenderer) {
        const p = this.getClickedReference(e.offsetX, e.offsetY, this.clickableObjects);
        this.onClickImplementation(p, e);
      } else {
        console.warn('No implementation of click for SVG');
      }
    });

    this.controls = controls;

    if (this.settings.staticScene) {
      // only re-render when scene is rotated
      controls.addEventListener('change', () => {
        this.dispatch(this.camera.position, this.camera.quaternion);
        this.renderScene();
      });
      controls.addEventListener('start', () => {
        controls.update();
      });
      controls.addEventListener('end', () => {
        controls.update();
      });
    } else {
      // constantly re-render (for animation)
      this.start();
    }
  }

  public updateCamera(position: Vector3, rotation: Quaternion) {
    this.camera.position.copy(position);
    this.camera.quaternion.copy(rotation);
    this.renderScene();
  }

  private onClickImplementation(p, e) {
    let needRedraw = false;
    //TODO(chab) make it more readale
    if (p) {
      const { object, point } = p;
      if (object?.sceneObject) {
        const sceneObject: Object3D = object?.sceneObject;
        const jsonObject: Object3D = object?.jsonObject;
        if (this.isMultiSelectionEnabled) {
          const objectIndex = this.outlinePass.selectedObjects.indexOf(sceneObject);
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
            this.outlinePass.selectedObjects.splice(objectIndex, 1);
          } else {
            if (e.shiftKey) {
              this.outlinePass.selectedObjects.push(sceneObject);
            } else {
              this.outlinePass.selectedObjects = [sceneObject];
            }
          }
        } else {
          this.outlinePass.selectedObjects = [sceneObject];
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
      if (this.outlinePass.selectedObjects.length > 0) {
        this.outlinePass.selectedObjects = [];
        needRedraw = true;
      }
    }
    needRedraw && this.renderScene();
  }

  private readonly windowListener = () => this.resizeRendererToDisplaySize();

  constructor(
    sceneJson,
    domElement: Element,
    settings,
    size,
    padding,
    clickCallback,
    private dispatch: (p: Vector3, r: Quaternion) => void,
    private debugDOMElement?
  ) {
    this.settings = Object.assign(defaults, settings);
    this.objectBuilder = new ThreeBuilder(this.settings);
    this.cacheMountBBox(domElement);
    this.configureSceneRenderer(domElement);
    this.configureLabelRenderer(domElement);
    this.configureScene(sceneJson);
    this.configurePostProcessing();
    this.clickCallback = clickCallback;
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
  }

  updateInsetSettings(inletSize: number, inletPadding: number, axisView) {
    this.inletPosition = axisView as ScenePosition;
    if (this.axis) {
      this.inset.updateViewportsize(inletSize, inletPadding);
    }
    this.renderScene();
  }

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement as HTMLCanvasElement;
    this.cacheMountBBox(canvas.parentElement as Element);
    const { width, height } = this.cachedMountNodeSize;
    if (canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, true);
      this.labelRenderer.setSize(width, height);

      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
    }
  }

  addToScene(sceneJson) {
    this.removeObjectByName(sceneJson.name);
    this.clickableObjects = [];
    this.objectDictionnary = {};

    const rootObject = new THREE.Object3D();
    rootObject.name = sceneJson.name;
    sceneJson.visible && (rootObject.visible = sceneJson.visible);

    // recursively visit the scene, starting with the root object
    const traverse_scene = (o, parent) => {
      o.contents.forEach(childObject => {
        if (childObject.type) {
          parent.add(this.makeObject(childObject));
        } else {
          const threeObject = new THREE.Object3D();
          threeObject.name = childObject.name;
          childObject.visible && (threeObject.visible = childObject.visible);
          if (childObject.origin) {
            const translation = new THREE.Matrix4();
            // note(chab) have a typedefinition for the JSON
            translation.makeTranslation(...(childObject.origin as [number, number, number]));
            threeObject.applyMatrix4(translation);
          }
          if (!this.settings.extractAxis || threeObject.name !== 'axes') {
            parent.add(threeObject);
          }
          traverse_scene(childObject, threeObject);
          if (threeObject.name === 'axes') {
            this.axis = threeObject.clone();
            this.axisJson = { ...childObject };
          }
        }
      });
    };

    traverse_scene(sceneJson, rootObject);
    // can cause memory leak
    //console.log('rootObject', rootObject, rootObject);
    this.scene.add(rootObject);
    this.setupCamera(rootObject);
    this.renderScene();

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

    if (this.inset) {
      this.inset.updateAxis(this.axis, this.axisJson);
    }
  }

  private setupCamera(rootObject) {
    const bbox = new THREE.Box3();
    bbox.setFromObject(rootObject);
    // auto-zoom to fit object
    // TODO: maybe better to move this elsewhere (what if using perspective?)
    const box = new THREE.Box3();
    box.setFromObject(rootObject);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    let maxDim = Math.max(size.x, size.y, size.z);
    const CAMERA_BOX_PADDING = maxDim / 1.65;
    // we add a bit of padding, let's suppose we rotate, we want to avoid the
    // object to go out of the camera
    const maxExtent = maxDim / 2 + CAMERA_BOX_PADDING / 2;
    // we add a lot of padding to make sure the camera is always beyond/behind the object
    const Z_PADDING = 50;
    this.camera = new THREE.OrthographicCamera(
      center.x - maxExtent,
      center.x + maxExtent,
      center.y + maxExtent,
      center.y - maxExtent,
      center.z - maxExtent - Z_PADDING,
      center.z + maxExtent + Z_PADDING
    );
    // position camera behind the object
    this.camera.position.z = center.z + maxExtent + Z_PADDING / 2;
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrix();
    this.scene.add(this.camera);
  }

  makeObject(object_json) {
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
    this.renderScene();
    this.frameId = window.requestAnimationFrame(() => this.animate());
  }

  renderScene() {
    if (this.renderer instanceof WebGLRenderer) {
      this.renderer.setClearColor(0x000000, 0.0);
      this.renderer.setSize(this.cachedMountNodeSize.width, this.cachedMountNodeSize.height);
      //TODO(chab) not sure to understand why we have to turn on/off scissor tests between renderings
      this.renderer.setScissorTest(true);
      this.renderer.setScissor(
        0,
        0,
        this.cachedMountNodeSize.width,
        this.cachedMountNodeSize.height
      );
    }

    // debug view
    if (this.debugHelper) {
      this.debugHelper.render();
    }

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    if (this.renderer instanceof WebGLRenderer) {
      this.renderer.setScissorTest(false);
    }

    //TODO(chab) make a decidated rendering for SVG
    this.composer && this.composer.render();

    this.inset &&
      this.inletPosition !== ScenePosition.HIDDEN &&
      this.inset.render(this.renderer, this.getInletOrigin(this.inletPosition));
  }

  toggleVisibility(namesToVisibility: { [objectName: string]: boolean }) {
    if (!!namesToVisibility) {
      Object.keys(namesToVisibility).forEach(objName => {
        if (!!namesToVisibility[objName]) {
          const obj = this.scene.getObjectByName(objName);
          if (obj) {
            obj.visible = !!namesToVisibility[objName];
          }
        }
      });
      this.renderScene();
    }
  }

  // i know this is can be done by implementing a color buffer, with each color matching one
  // object
  getClickedReference(clientX, clientY, objectsToCheck: Object3D[]) {
    if (!objectsToCheck || objectsToCheck.length === 0) {
      return;
    }

    const size = new THREE.Vector2();
    (this.renderer as WebGLRenderer).getSize(size);
    this.raycaster.setFromCamera(getThreeScreenCoordinate(size, clientX, clientY), this.camera);
    const intersects = this.raycaster.intersectObjects(objectsToCheck, true);
    if (intersects.length > 0) {
      // we catch the first object that the ray touches
      return { point: intersects[0].point, object: this.getParentObject(intersects[0].object) };
    }
    return null;
  }

  getParentObject(object: Object3D): { sceneObject: Object3D; jsonObject: any } | null {
    if (!object.parent) {
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

  // call this when the parent component is destroyed
  public onDestroy() {
    window.removeEventListener('resize', this.windowListener, false);
    this.debugHelper && this.debugHelper.onDestroy();
    this.inset.onDestroy();
    this.controls.dispose();
    disposeSceneHierarchy(this.scene);
    this.scene.dispose();
    if (this.renderer instanceof THREE.WebGLRenderer) {
      this.outlinePass.dispose();
      this.renderer.forceContextLoss();
      this.renderer.dispose();
    }
    this.renderer.domElement!.parentElement!.removeChild(this.renderer.domElement);
    this.renderer.domElement = undefined as any;
    this.renderer = null as any;
    this.stop();
  }

  removeObjectByName(name) {
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

  private getInletOrigin(pos: ScenePosition) {
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
    // We use the Three EffectComposer to implements the selection outline
    // the composer starts with a rendering pass, which is the standard rendering
    // then

    if (this.settings.renderer === Renderer.SVG) {
      console.warn('No post processing pass for SVG');
      return;
    }

    const composer = new EffectComposer(this.renderer as WebGLRenderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);
    composer.setSize(this.cachedMountNodeSize.width, this.cachedMountNodeSize.height);
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.cachedMountNodeSize.width, this.cachedMountNodeSize.height),
      this.scene,
      this.camera
    );
    this.outlinePass.usePatternTexture = true;
    this.outlinePass.visibleEdgeColor = OUTLINE_COLOR;
    this.outlinePass.hiddenEdgeColor = OUTLINE_COLOR;
    this.outlinePass.edgeGlow = 0;
    this.outlinePass.edgeStrength = 5;
    this.outlinePass.edgeThickness = 0.01;
    this.outlinePass.pulsePeriod = 0;
    this.outlinePass.overlayMaterial.blending = THREE.SubtractiveBlending;

    const onLoad = texture => {
      (this.outlinePass as any).patternTexture = texture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    };
    const loader = new THREE.TextureLoader();
    loader.load(img, onLoad);

    // fast anti-aliasing shader
    let effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(
      1 / this.cachedMountNodeSize.width,
      1 / this.cachedMountNodeSize.height
    );
    effectFXAA.renderToScreen = true;
    composer.addPass(effectFXAA);
    composer.addPass(this.outlinePass);
    this.composer = composer;
  }
}
