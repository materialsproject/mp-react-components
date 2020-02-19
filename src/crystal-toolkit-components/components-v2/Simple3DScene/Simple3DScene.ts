import * as THREE from 'three';
import { Object3D, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer';
import { ColladaExporter } from 'three/examples/jsm/exporters/ColladaExporter';
import {
  DEFAULT_LIGHT_COLOR,
  defaults,
  ExportType,
  JSON3DObject,
  Light,
  Material,
  Renderer
} from './constants';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TooltipHelper } from '../scene/tooltip-helper';
import { InsetHelper, ScenePosition } from '../scene/inset-helper';
import { ThreeBuilder } from './three_builder';

export default class Simple3DScene {
  private settings;
  private renderer!: THREE.WebGLRenderer | SVGRenderer;
  private labelRenderer!: CSS2DRenderer;
  private scene!: THREE.Scene;
  private cachedMountNodeSize!: { width: number; height: number };
  private camera!: THREE.OrthographicCamera;
  private insetCamera!: THREE.OrthographicCamera;
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
    //TODO(chab) determine what's going on
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
    this.camera = this.getCamera();
    ///this.scene.add(this.camera);
    this.addToScene(sceneJson);
    const lights = this.makeLights(this.settings.lights);
    this.scene.add(lights);
    this.scene.add(this.tooltipHelper.tooltip);
    const controls = new OrbitControls(this.camera, this.renderer.domElement as HTMLElement);
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.enabled = true;

    this.renderer.domElement.addEventListener('mousemove', (e: any) => {
      const p = this.getClickedReference(e.offsetX, e.offsetY);

      if (p) {
        const { object, point } = p;
        this.tooltipHelper.updateTooltip(point, object!.jsonObject, object!.sceneObject);
        this.renderScene();
      } else {
        this.tooltipHelper.hideTooltipIfNeeded() && this.renderScene();
      }
    });

    this.controls = controls;

    if (this.settings.staticScene) {
      // only re-render when scene is rotated
      controls.addEventListener('change', () => {
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

  private getCamera() {
    const { width, height } = this.cachedMountNodeSize;
    // TODO: change so camera dimensions match scene, not dom_elt?
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -2000,
      2000
    );
    // need to offset for OrbitControls
    camera.position.z = 2;
    // axis would be at the medium

    return camera;
  }

  constructor(sceneJson, domElement: Element, settings, size, padding) {
    this.settings = Object.assign(defaults, settings);
    this.objectBuilder = new ThreeBuilder(this.settings);
    this.cacheMountBBox(domElement);
    this.configureSceneRenderer(domElement);
    this.configureLabelRenderer(domElement);
    this.configureScene(sceneJson);
    window.addEventListener('resize', () => this.resizeRendererToDisplaySize(), false);
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
  }

  updateInsetSettings(inletSize: number, inletPadding: number, axisView) {
    this.inletPosition = axisView as ScenePosition;
    this.inset.updateViewportsize(inletSize, inletPadding);
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

  download(filename: string, filetype: ExportType) {
    switch (filetype) {
      case ExportType.png:
        this.downloadScreenshot(filename);
        break;
      case ExportType.dae:
        this.downloadCollada(filename);
        break;
      default:
        throw new Error('Unknown filetype.');
    }
  }

  downloadScreenshot(filename: string) {
    //TODO(chab) extract as a general utility method
    // throw if svg render is used

    // using method from Three.js editor
    // create a link and hide it from end-user
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    // force a render (in case buffer has been cleared)
    this.renderScene();
    // and set link href to renderer contents
    link.href = (<HTMLCanvasElement>this.renderer.domElement).toDataURL('image/png');
    // click link to download
    link.download = filename || 'screenshot.png';
    link.click();
  }

  downloadCollada(filename) {
    // Note(chab) i think it's better to use callback, so we can manage failure
    const files = new ColladaExporter().parse(
      this.scene,
      r => {
        console.log('result', r);
      },
      {}
    )!;
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = 'data:text/plain;base64,' + btoa(files.data);
    link.download = filename || 'scene.dae';
    link.click();
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
          parent.add(threeObject);
          traverse_scene(childObject, threeObject);
          if (threeObject.name === 'axes') {
            this.axis = threeObject.clone();
            this.axisJson = { ...childObject };
            console.log('....', this.axisJson);
          }
        }
      });
    };

    traverse_scene(sceneJson, rootObject);
    console.log('rootObject', rootObject);
    this.scene.add(rootObject);

    // auto-zoom to fit object
    // TODO: maybe better to move this elsewhere (what if using perspective?)
    const box = new THREE.Box3();
    box.setFromObject(rootObject);
    const { width, height } = this.cachedMountNodeSize;
    // TODO: improve auto-zoom
    this.camera.zoom =
      Math.min(
        Math.max(width, height) / (box.max.x - box.min.x),
        Math.max(width, height) / (box.max.y - box.min.y),
        Math.max(width, height) / (box.max.z - box.min.z)
      ) * this.settings.defaultZoom;

    this.camera.updateProjectionMatrix();
    this.camera.updateMatrix();
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

  makeLights(light_json) {
    const lights = new THREE.Object3D();
    lights.name = 'lights';
    light_json.forEach(light => {
      let lightObj;
      switch (light.type) {
        case Light.DirectionalLight:
          lightObj = new THREE.DirectionalLight(...light.args);
          if (light.helper) {
            const lightHelper = new THREE.DirectionalLightHelper(lightObj, 5, DEFAULT_LIGHT_COLOR);
            lightObj.add(lightHelper);
          }
          break;
        case Light.AmbientLight:
          lightObj = new THREE.AmbientLight(...light.args);
          break;
        case Light.HemisphereLight:
          lightObj = new THREE.HemisphereLight(...light.args);
          break;
        default:
          throw new Error('Unknown light.');
      }
      if (light.position) {
        lightObj.position.set(...light.position);
      }
      lights.add(lightObj);
    });

    return lights;
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
    }

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    this.inset &&
      this.inletPosition !== ScenePosition.HIDDEN &&
      this.inset.render(this.renderer, this.getInletOrigin(this.inletPosition));
  }

  toggleVisibility(namesToVisibility) {
    if (!!namesToVisibility) {
      Object.keys(namesToVisibility).forEach(objName => {
        if (!!namesToVisibility[objName]) {
          const obj = this.scene.getObjectByName(objName);
          if (obj) {
            obj.visible = Boolean(namesToVisibility[objName]);
          }
        }
      });
      this.renderScene();
    }
  }

  // i know this is can be done by implementing a color buffer, with each color matching one
  // object
  getClickedReference(clientX, clientY) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const size = new THREE.Vector2();
    (this.renderer as WebGLRenderer).getSize(size);
    mouse.x = (clientX / size.width) * 2 - 1;
    mouse.y = -(clientY / size.height) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.tooltipObjects, true);
    // they are a few cases where this does not work :( try to understand why
    if (intersects.length > 0) {
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

  // call this when the parent component is destroyed
  public onDestroy() {
    (this.renderer as THREE.WebGLRenderer).forceContextLoss();
    (this.renderer as THREE.WebGLRenderer).dispose();
    this.renderer.domElement!.parentElement!.removeChild(this.renderer.domElement);
    (this.renderer as any).domElement = undefined;
    (this as any).renderer = null;
    this.controls.dispose();
    this.stop();
  }

  removeObjectByName(name) {
    // name is not necessarily unique, make this recursive ?
    const object = this.scene.getObjectByName(name);
    typeof object !== 'undefined' && this.scene.remove(object);
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
}

export function getSceneWithBackground(settings) {
  const scene = new THREE.Scene();
  //background
  if (!settings.transparentBackground) {
    scene.background = new THREE.Color(settings.background);
  }
  return scene;
}
