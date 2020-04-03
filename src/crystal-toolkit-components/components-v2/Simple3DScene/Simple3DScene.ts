import * as THREE from 'three';
import {
  BufferAttribute,
  BufferGeometry,
  Object3D,
  Quaternion,
  Vector3,
  WebGLRenderer
} from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer';
import {
  AnimationStyle,
  Control,
  defaults,
  ExportType,
  JSON3DObject,
  Renderer,
  ThreePosition
} from './constants';
import { TooltipHelper } from '../scene/tooltip-helper';
import { InsetHelper, ScenePosition } from '../scene/inset-helper';
import { getSceneWithBackground, ThreeBuilder } from './three_builder';
import { DebugHelper } from '../scene/debug-helper';
import { disposeSceneHierarchy, download, getThreeScreenCoordinate, ObjectRegistry } from './utils';
// @ts-ignore
//import img from './glass.png';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { ConvexBufferGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { SceneJsonObject } from '../scene/simple-scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

  private outline!: OutlineEffect;
  private selectedJsonObjects: any[] = [];
  private outlineScene = new THREE.Scene();

  private threeUUIDTojsonObject: { [uuid: string]: any } = {};
  private computeIdToThree: { [id: string]: THREE.Object3D } = {};

  // handle multiSelection via shift key
  private isMultiSelectionEnabled = false;
  private registry = new ObjectRegistry();

  private mixer: THREE.AnimationMixer[] = [];
  private clock = new THREE.Clock();

  private lineGeometriesToUpdate: THREE.LineSegments[] = [];

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
    if (p) {
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

  addToScene(sceneJson: SceneJsonObject, bypassRendering = false) {
    // we need to clarify the  current semantics
    // currently, it will remove the old scene if the name is the same,
    // otherwise it will keep it
    // it will then zoom on the content of the added scene

    // if we found an object, we should remove all tootips and clicks related to it
    let outlinedObject: string[] = [];
    let bp = false;
    if (this.scene.getObjectByName(sceneJson.name!)) {
      console.log('Regenerating scene');
      // see https://jsfiddle.net/L981td24/17/
      this.mixer.forEach(m => m.stopAllAction());
      this.mixer = [];
      this.lineGeometriesToUpdate = [];
      this.clickableObjects = [];
      this.tooltipObjects = [];
      this.threeUUIDTojsonObject = [];
      this.registry.clear();
      this.removeObjectByName(sceneJson.name!);
      if (this.outlineScene.children.length > 0) {
        outlinedObject = this.selectedJsonObjects.map(o => o.id);
        this.outlineScene.remove(...this.outlineScene.children);
      }
      bp = false;
    } else {
      console.log('The scene is a new scene:', sceneJson.name);
    }

    const rootObject = new THREE.Object3D();
    rootObject.name = sceneJson.name!;
    sceneJson.visible && (rootObject.visible = sceneJson.visible);

    const objectToAnimate = new Set<string>();
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

    traverse_scene(sceneJson, rootObject, '');
    // can cause memory leak
    //console.log('rootObject', rootObject, rootObject);
    this.scene.add(rootObject);
    this.setupCamera(rootObject);

    if (outlinedObject.length > 0) {
      this.outlineScene.remove(...this.outlineScene.children);
      outlinedObject.forEach(id => {
        const three = this.computeIdToThree[id];
        this.addClonedObject(three);
        this.outlineScene.add(this.registry.getObjectFromRegistry(three.uuid));
      });
      // update inlet
      this.inset.showObject(this.outlineScene.children);
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
      const kf = (json as any).keyframes;
      const kfl: number = kf.length;

      if (json.type === JSON3DObject.SPHERES) {
        const animations = json.animate!;

        if (Array.isArray(animations[0])) {
          animations.forEach((animation: any, idx) => {
            let _three = three.children[idx];
            const st = [_three.position.x, _three.position.y, _three.position.z];
            const values = [
              ...st,
              ...[st[0] + animation[0], st[1] + animation[1], st[2] + animation[2]]
            ];
            const positionKF = new THREE.VectorKeyframeTrack('.position', [...kf], values);
            const clip = new THREE.AnimationClip('Action', kfl, [positionKF]);
            const mixer = new THREE.AnimationMixer(_three);
            this.mixer.push(mixer);
            const ca = mixer.clipAction(clip);
            ca.play();
          });
        } else {
          const st = [three.position.x, three.position.y, three.position.z];
          const values = [...st, ...json.animate!]; //FIXME it's absolute, make it relative ?
          const positionKF = new THREE.VectorKeyframeTrack('.position', [...kf], values);
          const clip = new THREE.AnimationClip('Action', kfl, [positionKF]);
          const mixer = new THREE.AnimationMixer(three);
          this.mixer.push(mixer);
          const ca = mixer.clipAction(clip);
          ca.play();
        }
      } else if (json.type === JSON3DObject.CYLINDERS) {
        const animations = json.animate!;
        animations.forEach((animation, aIdx) => {
          const idx = animation[2];
          const positionPair = json.positionPairs![idx];
          const start = positionPair[0];
          const end = positionPair[1];
          const targetPP = [
            [start[0] + animation[0][0], start[1] + animation[0][1], start[2] + animation[0][2]],
            [end[0] + animation[1][0], end[1] + animation[1][1], end[2] + animation[1][2]]
          ];
          const scaleStart = three.children[idx].scale;
          const positionStart = three.children[idx].position;
          const rotation = three.children[idx].quaternion;
          const st = [positionStart.x, positionStart.y, positionStart.z];
          const qt = [rotation.x, rotation.y, rotation.z, rotation.w];
          const { position, scale, quaternion: quaternionEnd } = this.objectBuilder.getCylinderInfo(
            targetPP
          );
          let valuesp = [...st, ...position];
          let valuesq = [
            ...qt,
            ...[quaternionEnd.x, quaternionEnd.y, quaternionEnd.z, quaternionEnd.w]
          ];
          const positionKF = new THREE.VectorKeyframeTrack('.position', [...kf], valuesp);
          const scaleKF = new THREE.NumberKeyframeTrack(
            '.scale',
            [...kf],
            [scaleStart.x, scaleStart.y, scaleStart.z, scaleStart.x, scale, scaleStart.z]
          );
          const quaternion = new THREE.VectorKeyframeTrack('.quaternion', [...kf], valuesq);
          const clip = new THREE.AnimationClip('Cylinder' + idx, kfl, [
            positionKF,
            scaleKF,
            quaternion
          ]);
          const mixer = new THREE.AnimationMixer(three.children[idx]);
          const ca = mixer.clipAction(clip);
          this.mixer.push(mixer);
          ca.play();
        });
      } else if (json.type === JSON3DObject.LINES && true) {
        const animations = json.animate!;
        const pt: number[] = [];
        json.positions!.forEach((p, idx) => {
          pt.push(p[0] + animations[idx][0], p[1] + animations[idx][1], p[2] + animations[idx][2]);
        });
        const array = new Float32Array(pt);
        const lines = three.children[0] as THREE.LineSegments;
        const a: any = ((lines.geometry as THREE.BufferGeometry).attributes
          .position as BufferAttribute).array;
        (lines as any).value = [...a];
        const keyFrame2 = new THREE.NumberKeyframeTrack('.value', kf, [...a, ...pt]);
        this.lineGeometriesToUpdate.push(lines as THREE.LineSegments);
        const clip2 = new THREE.AnimationClip('Lines', kfl, [keyFrame2]);
        const mixer2 = new THREE.AnimationMixer(lines);
        const ca2 = mixer2.clipAction(clip2);
        this.mixer.push(mixer2);
        ca2.play();
        //const verts = new THREE.Float32BufferAttribute(pt, 3);
        //const geom = new THREE.BufferGeometry();
        //geom.setAttribute('position', verts);
      } else if (json.type === JSON3DObject.CONVEX) {
        const animations = json.animate!;
        const mesh = three.children[0] as THREE.Mesh;
        const lines = three.children[1] as THREE.LineSegments;
        const geo = mesh.geometry as BufferGeometry;
        geo.morphAttributes.position = [];
        // calculate morph target
        const pt = json.positions!.map((p, idx) => {
          //console.log(json.positions, animations, animations[idx]);
          return new THREE.Vector3(
            ...[
              p[0] + animations[idx][0][0],
              p[1] + animations[idx][0][1],
              p[2] + animations[idx][0][2]
            ]
          );
        });
        const geom = new ConvexBufferGeometry(pt);
        geo.morphAttributes.position[0] = geom.attributes.position;
        mesh.morphTargetInfluences = [0];

        //https://stackoverflow.com/questions/35374650
        //Buffergeometry.morphTargets = [];
        //Buffergeometry.morphTargets.push(0);

        const keyFrame = new THREE.NumberKeyframeTrack('.morphTargetInfluences', kf, [0.0, 1.0]);
        const clip = new THREE.AnimationClip('Convex', kfl, [keyFrame]);
        const mixer = new THREE.AnimationMixer(mesh);
        const ca = mixer.clipAction(clip);
        this.mixer.push(mixer);
        ca.play();
        const edges = new THREE.EdgesGeometry(geom);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: '#000000', linewidth: 1 })
        );

        /*(lines.geometry as THREE.BufferGeometry).setAttribute(
          'position',
          edges.getAttribute('position')
        );*/
        const a: any = ((lines.geometry as THREE.BufferGeometry).attributes
          .position as BufferAttribute).array;
        const p: any = (line.geometry as any).attributes.position.array;
        (lines as any).value = [...a];
        const keyFrame2 = new THREE.NumberKeyframeTrack('.value', kf, [...a, ...p]);
        this.lineGeometriesToUpdate.push(lines as THREE.LineSegments);
        const clip2 = new THREE.AnimationClip('Convexlines', kfl, [keyFrame2]);
        const mixer2 = new THREE.AnimationMixer(lines);
        const ca2 = mixer2.clipAction(clip2);
        this.mixer.push(mixer2);
        ca2.play();
      } else if (json.type === JSON3DObject.CUBES) {
        // if it's position, we add a mixer for each cube
        // if it's the width/height/depth, we need a morph target
        console.warn('Animation not supported', json.type);
      } else if (json.type === JSON3DObject.BEZIER) {
        console.warn('Animation not supported', json.type);
      } else {
        console.warn('Animation not supported', json.type);
      }
    });

    if (!bypassRendering) {
      this.renderScene();
    }
  }

  private useMorphTargetForAnimation(type: JSON3DObject): boolean {
    return (
      type === JSON3DObject.CUBES || type === JSON3DObject.CONVEX || type === JSON3DObject.LINES
    );
  }

  private setupCamera(rootObject: THREE.Object3D) {
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
    const length = bbox.max.sub(bbox.min).length() + 1;

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

    this.camera.zoom = 2;
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
    const delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.forEach(m => m.update(delta));
    }
    this.lineGeometriesToUpdate.forEach(l => {
      const geom = l.geometry as THREE.BufferGeometry;
      const values = (l as any).value;
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(values), 3));
      (geom.attributes.position as BufferAttribute).needsUpdate = true; // what if InterleavedBufferAttribute
    });

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
      this.renderScene();
    }
  }

  // i know this is can be done by implementing a color buffer, with each color matching one
  // object
  getClickedReference(clientX: number, clientY: number, objectsToCheck: Object3D[]) {
    if (!objectsToCheck || objectsToCheck.length === 0) {
      return;
    }

    const size = new THREE.Vector2(this.cachedMountNodeSize.width, this.cachedMountNodeSize.height);

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
    if (this.mixer) {
      this.mixer.forEach(m => m.setTime(time));
    }
    this.lineGeometriesToUpdate.forEach(l => {
      const geom = l.geometry as THREE.BufferGeometry;
      const values = (l as any).value;
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(values), 3));
      (geom.attributes.position as BufferAttribute).needsUpdate = true; // what if InterleavedBufferAttribute
    });

    this.refreshOutline();
    this.renderScene();
  }

  // for testing purposes
  public download() {
    download('rr', ExportType.png, this);
  }
}
