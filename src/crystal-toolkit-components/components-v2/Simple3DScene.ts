import * as THREE from 'three'
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { Object3D, OrthographicCamera, Scene, WebGLRenderer } from "three";
import { ColladaExporter } from "three/examples/jsm/exporters/ColladaExporter";
import { Renderer, Light, DEFAULT_LIGHT_COLOR, Material, ExportType, defaults } from "./constants";


export default class Simple3DScene {

  private settings;
  private renderer!: WebGLRenderer | SVGRenderer;
  private labelRenderer!: CSS2DRenderer;
  private scene!: Scene;
  private cachedMountNodeSize!: {width: number, height: number};
  private camera!: OrthographicCamera;
  private frameId?: number;
  private clickableObjects: Object3D[] = [];
  private objectDictionnary: {[id:string]: any} = {};
  private controls;

  private cacheMountBBox(mountNode: Element) {
    this.cachedMountNodeSize = { width: mountNode.clientWidth, height: mountNode.clientHeight };
  }

  private determineSceneRenderer() {
    switch(this.settings.renderer) {
      case Renderer.WEBGL: {
        const renderer = new THREE.WebGLRenderer({
          antialias: this.settings.antialias,
          alpha: this.settings.transparentBackground,
        });
        renderer.gammaFactor = 2.2;
        return renderer;
      }
      case Renderer.SVG: {
        return new SVGRenderer()
      }
      default: {
        console.error('Invalid renderer passed', this.settings.renderer);
        return null;
      }
    }
  }

  private configureSceneRenderer(mountNode: Element) {
    const renderer = this.determineSceneRenderer();
    if (!renderer) { throw new Error('No renderer')}
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
    mountNode.appendChild(labelRenderer.domElement)
  }

  private configureScene(sceneJson) {
    this.scene = this.getSceneWithBackground();
    this.camera = this.getCamera();
    ///this.scene.add(this.camera);
    this.addToScene(sceneJson);
    const lights = this.makeLights(this.settings.lights);
    this.scene.add(lights);

    console.log(this.renderer.domElement);
    const controls = new TrackballControls(
      this.camera,
      this.renderer.domElement as HTMLElement
    );
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.keys = [ ];
    controls.enabled = true;
    //(controls as any).enableKeys = false; // uh ?

    // for OrbitControls
    // controls.minDistance = 20
    // controls.maxDistance = 50
    // controls.noPan = true
    // controls.noZoom = !this.settings.enableZoom
    // controls.rotateSpeed = 4.0
    // controls.zoomSpeed = 2.0
    // controls.staticMoving = true

    this.controls = controls;

    if (this.settings.staticScene) {
      // only re-render when scene is rotated
      controls.addEventListener('change', () => {
        this.renderScene()
      });
      controls.addEventListener('start', () => {
        controls.update();
      });
      controls.addEventListener('end', () => {
        controls.update();
      })
    } else {
      // constantly re-render (for animation)
      this.start()
    }
  }

  private getSceneWithBackground() {
    const scene = new Scene();
    //background
    if (!this.settings.transparentBackground) {
      scene.background = new THREE.Color(this.settings.background);
    }
    return scene;
  }

  private getCamera() {
    const {width, height} = this.cachedMountNodeSize;
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
    return camera;
  }

  constructor (sceneJson, domElement: Element, settings) {
    this.settings = Object.assign(defaults, settings);
    this.cacheMountBBox(domElement);
    this.configureSceneRenderer(domElement);
    this.configureLabelRenderer(domElement);
    this.configureScene(sceneJson);
    window.addEventListener('resize', this.resizeRendererToDisplaySize, false);
  }


  resizeRendererToDisplaySize () {
    const canvas = this.renderer.domElement as HTMLCanvasElement;
    this.cacheMountBBox(canvas.parentElement as Element);
    const {width, height} = this.cachedMountNodeSize;
    if (canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, true);
      this.labelRenderer.setSize(width, height);
    }

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera)
  }

  download (filename: string, filetype: ExportType ) {
    switch (filetype) {
      case ExportType.png:
        this.downloadScreenshot(filename);
        break;
      case ExportType.dae:
        this.downloadCollada(filename);
        break;
      default:
        throw new Error('Unknown filetype.')
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
    link.href = (<HTMLCanvasElement> this.renderer.domElement).toDataURL('image/png');
    // click link to download
    link.download = filename || 'screenshot.png';
    link.click();
  }

  downloadCollada (filename) {
    // Note(chab) i think it's better to use callback, so we can manage failure
    const files = new ColladaExporter().parse(this.scene, (r) => {
      console.log('result', r);
    }, {})!;
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = 'data:text/plain;base64,' + btoa(files.data);
    link.download = filename || 'scene.dae';
    link.click();
  }


  addToScene (sceneJson) {

    this.removeObjectByName(sceneJson.name);
    this.clickableObjects = [];
    this.objectDictionnary = {};

    const rootObject = new THREE.Object3D();
    rootObject.name = sceneJson.name;
    sceneJson.visible && (rootObject.visible = sceneJson.visible);

    // recursively visit the scene, starting with the root object
    const traverse_scene = (o, parent) => {
      o.contents.forEach((childObject) => {
        if (childObject.type) {
          parent.add(this.makeObject(childObject))
        } else {
          const threeObject = new THREE.Object3D();
          threeObject.name = childObject.name;
          childObject.visible && (threeObject.visible = childObject.visible);
          if (childObject.origin) {
            const translation = new THREE.Matrix4();
            // note(chab) have a typedefinition for the JSON
            translation.makeTranslation(...(childObject.origin as [number, number, number]));
            threeObject.applyMatrix4(translation)
          }
          parent.add(threeObject);
          traverse_scene(childObject, threeObject)
        }
      })
    };

    traverse_scene(sceneJson, rootObject);
    console.log("rootObject", rootObject);
    this.scene.add(rootObject);

    // auto-zoom to fit object
    // TODO: maybe better to move this elsewhere (what if using perspective?)
    const box = new THREE.Box3();
    box.setFromObject(rootObject);
    const {width, height} = this.cachedMountNodeSize;
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
        this.renderer.domElement.parentElement!.style.backgroundImage = `url('${this.renderer.domElement.toDataURL('image/png')}')`
      }
    }
  }

  makeLights (light_json) {
    const lights = new THREE.Object3D();
    lights.name = 'lights';
    light_json.forEach((light) => {
      let lightObj;
      switch (light.type) {
        case  Light.DirectionalLight:
          lightObj = new THREE.DirectionalLight(...light.args);
          if (light.helper) {
            const lightHelper = new THREE.DirectionalLightHelper(
              lightObj,
              5,
              DEFAULT_LIGHT_COLOR
            );
            lightObj.add(lightHelper)
          }
          break;
        case Light.AmbientLight:
          lightObj = new THREE.AmbientLight(...light.args);
          break;
        case Light.HemisphereLight:
          lightObj = new THREE.HemisphereLight(...light.args);
          break;
        default:
          throw new Error('Unknown light.')
      }
      if (light.position) {
        lightObj.position.set(...light.position);
      }
      lights.add(lightObj);
    });

    return lights;
  }

  makeObject (object_json) {
    const obj = new THREE.Object3D();

    if (object_json.clickable) {
      this.clickableObjects.push(obj);
      this.objectDictionnary[obj.id] = object_json;
    }

    // rely on the closure
    const getSphereBuffer = (scale) => {
      const geom = new THREE.SphereBufferGeometry(
        scale,
        this.settings.sphereSegments,
        this.settings.sphereSegments,
        object_json.phiStart || 0,
        object_json.phiEnd || Math.PI * 2
      );
      return {geom, mat: this.makeMaterial(object_json.color)};
    };

    switch (object_json.type) {
      case 'spheres': {
        const {geom, mat} = getSphereBuffer(object_json.radius * this.settings.sphereScale);
        object_json.positions.forEach((position) => {
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(...position as [number, number, number]); //FIXME
          obj.add(mesh);
          return mesh;
        });
        /* ^^ PULLED IN THE UPPER LOOP
        meshes.forEach(function (mesh) {
          obj.add(mesh)
        })*/
        return obj
      }
      case 'ellipsoids': {
        const {geom, mat} = getSphereBuffer(this.settings.sphereScale);
        const meshes = object_json.positions.map((position) => {
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(...position as [number, number, number]);
          mesh.scale.set(...object_json.scale as [number, number, number]); // TODO: Is this valid JS?
          meshes.push(mesh)
        });
        // TODO: test axes are correct!
        const vec_z = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion();
        object_json.rotate_to.forEach( (rotation, index) => {
          const rotation_vec = new THREE.Vector3(...rotation);
          quaternion.setFromUnitVectors(vec_z, rotation_vec.normalize());
          meshes[index].setRotationFromQuaternion(quaternion);
        });
        meshes.forEach(mesh => obj.add(mesh));
        return obj
      }
      case 'cylinders': {
        const radius = object_json.radius || 1;
        const geom = new THREE.CylinderBufferGeometry(
          radius * this.settings.cylinderScale,
          radius * this.settings.cylinderScale,
          1.0,
          this.settings.cylinderSegments
        );
        const mat = this.makeMaterial(object_json.color);
        const vec_y = new THREE.Vector3(0, 1, 0); // initial axis of cylinder
        const quaternion = new THREE.Quaternion();
        object_json.positionPairs.forEach((positionPair) => {
          // the following is technically correct but could be optimized?
          const mesh = new THREE.Mesh(geom, mat);
          const vec_a = new THREE.Vector3(...positionPair[0]);
          const vec_b = new THREE.Vector3(...positionPair[1]);
          const vec_rel = vec_b.sub(vec_a);
          // scale cylinder to correct length
          mesh.scale.y = vec_rel.length();
          // set origin at midpoint of cylinder
          const vec_midpoint = vec_a.add(vec_rel.clone().multiplyScalar(0.5));
          mesh.position.set(vec_midpoint.x, vec_midpoint.y, vec_midpoint.z);
          // rotate cylinder into correct orientation
          quaternion.setFromUnitVectors(vec_y, vec_rel.normalize());
          mesh.setRotationFromQuaternion(quaternion);
          obj.add(mesh)
        });
        return obj
      }
      case 'cubes': {
        const size = object_json.width * this.settings.sphereScale;
        const geom = new THREE.BoxBufferGeometry(size, size, size);
        const mat = this.makeMaterial(object_json.color);
        object_json.positions.forEach((position) => {
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(...position as [number, number, number]);
          obj.add(mesh);
        });

        return obj
      }
      case 'lines': {
        const verts = new THREE.Float32BufferAttribute(
          [].concat.apply([], object_json.positions),
          3
        );
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', verts);

        let mat;
        if (object_json.dashSize || object_json.scale || object_json.gapSize) {
          mat = new THREE.LineDashedMaterial({
            color: object_json.color || '#000000',
            linewidth: object_json.line_width || 1,
            scale: object_json.scale || 1,
            dashSize: object_json.dashSize || 3,
            gapSize: object_json.gapSize || 1
          });
        } else {
          mat = new THREE.LineBasicMaterial({
            color: object_json.color || '#2c3c54',
            linewidth: object_json.line_width || 1
          });
        }

        const mesh = new THREE.LineSegments(geom, mat);
        if (object_json.dashSize || object_json.scale || object_json.gapSize) {
          mesh.computeLineDistances()
        }
        obj.add(mesh);
        return obj;
      }
      case 'surface': {
        const verts = new THREE.Float32BufferAttribute(
          [].concat.apply([], object_json.positions),
          3
        );
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', verts);

        const opacity =
          object_json.opacity || this.settings.defaultSurfaceOpacity;
        const mat = this.makeMaterial(object_json.color, opacity);

        if (object_json.normals) {
          const normals = new THREE.Float32BufferAttribute(
            [].concat.apply([], object_json.normals),
            3
          );

          geom.setAttribute('normal', normals);
        } else {
          // see if there is alternative.. i think openGL dont provide it anymore
          //FIXME(chab) is it even called ?
          geom.computeVertexNormals(); // instead of computefacenormals ?
          mat.side = THREE.DoubleSide; // not sure if this is necessary if we compute normals correctly
        }

        if (opacity) {
          mat.transparent = true;
          mat.depthWrite = false;
        }

        const mesh = new THREE.Mesh(geom, mat);
        obj.add(mesh);
        // TODO: smooth the surfaces?
        return obj;
      }
      case 'convex': {
        const points = object_json.positions.map(p => new THREE.Vector3(...p));
        const geom = new ConvexBufferGeometry(points);
        const opacity =
          object_json.opacity || this.settings.defaultSurfaceOpacity;
        const mat = this.makeMaterial(object_json.color, opacity);
        if (opacity) {
          mat.transparent = true;
          mat.depthWrite = false;
        }

        const mesh = new THREE.Mesh(geom, mat);
        obj.add(mesh);
        const edges = new THREE.EdgesGeometry(geom);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: object_json.color }));
        obj.add(line);
        return obj
      }
      case 'arrows': {
        // take inspiration from ArrowHelper, user cones and cylinders
        const radius = object_json.radius || 1;
        const headLength = object_json.headLength || 2;
        const headWidth = object_json.headWidth || 2;

        // body
        const geom_cyl = new THREE.CylinderBufferGeometry(
          radius * this.settings.cylinderScale,
          radius * this.settings.cylinderScale,
          1.0,
          this.settings.cylinderSegments
        );
        // head
        const geom_head = new THREE.ConeBufferGeometry(
          headWidth * this.settings.cylinderScale,
          headLength * this.settings.cylinderScale,
          this.settings.cylinderSegments);

        const mat = this.makeMaterial(object_json.color);

        const vec_y = new THREE.Vector3(0, 1, 0); // initial axis of cylinder
        const quaternion = new THREE.Quaternion();
        const quaternion_head = new THREE.Quaternion();

        object_json.positionPairs.forEach((positionPair) => {
          // the following is technically correct but could be optimized?

          const mesh = new THREE.Mesh(geom_cyl, mat)
          const vec_a = new THREE.Vector3(...positionPair[0]);
          const vec_b = new THREE.Vector3(...positionPair[1]);
          const vec_head = new THREE.Vector3(...positionPair[1]);
          const vec_rel = vec_b.sub(vec_a);

          // scale cylinder to correct length
          mesh.scale.y = vec_rel.length();

          // set origin at midpoint of cylinder
          const vec_midpoint = vec_a.add(vec_rel.clone().multiplyScalar(0.5));
          mesh.position.set(vec_midpoint.x, vec_midpoint.y, vec_midpoint.z);

          // rotate cylinder into correct orientation
          quaternion.setFromUnitVectors(vec_y, vec_rel.normalize());
          mesh.setRotationFromQuaternion(quaternion);

          obj.add(mesh);

          // add arrowhead
          const mesh_head = new THREE.Mesh(geom_head, mat);
          mesh_head.position.set(vec_head.x, vec_head.y, vec_head.z);
          // rotate cylinder into correct orientation
          quaternion_head.setFromUnitVectors(vec_y, vec_rel.normalize());
          mesh_head.setRotationFromQuaternion(quaternion_head);
          obj.add(mesh_head);
        });
        return obj
      }
      case 'labels': {
        const label = document.createElement('div');
        label.className = 'tooltip';
        label.textContent = object_json.label;
        if (object_json.hoverLabel) {
          const hoverLabel = document.createElement('span');
          hoverLabel.textContent = object_json.hoverLabel;
          hoverLabel.className = 'tooltiptext';
          label.appendChild(hoverLabel);
        }
        const labelObject = new CSS2DObject(label);
        obj.add(labelObject);
        return obj
      }
      default: {
        return obj
      }
    }
  }

  makeMaterial (color = '#52afb0', opacity = 1.0) {
    const parameters = Object.assign(this.settings.material.parameters, {
      color: color,
      opacity: opacity
    });

    if (this.settings.renderer === Renderer.SVG) {
      return new THREE.MeshBasicMaterial(parameters);
    }

    switch (this.settings.material.type) {
      case Material.standard: {
        return new THREE.MeshStandardMaterial(parameters);
      }
      default:
        throw new Error('Unknown material.');
    }
  }

  start () {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(() => this.animate());
    } else {
      console.warn('Trying to start animation, but it seems an animation loop is already running');
    }
  }

  stop () {
    cancelAnimationFrame(this.frameId!);
    this.frameId = undefined;
  }

  animate () {
    this.renderScene();
    this.frameId = window.requestAnimationFrame(() => this.animate());
  }

  renderScene () {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  toggleVisibility (namesToVisibility) {
    if (!!namesToVisibility) {
      Object.keys(namesToVisibility).forEach((objName) => {
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

  // i know this is done by implementing a color buffer, with each color matching one
  // object
  getClickedReference (clientX, clientY) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera);
    // Three.js objects with click handlers we are interested in
    const intersects = raycaster.intersectObjects(Object.values(this.clickableObjects));
    if (intersects.length > 0) {
      console.log('intersects', intersects[0].object);
      return this.objectDictionnary[intersects[0].object.id];
    }
    return null;
  }


  // call this when the parent component is destroyed
  public onDestroy() {
    //FIXME
    (this.renderer as WebGLRenderer).forceContextLoss();
    (this.renderer as WebGLRenderer).dispose();
    this.renderer.domElement!.parentElement!.removeChild(this.renderer.domElement);
    (this.renderer as any).domElement = undefined;
    // domElement can be removed from parent there
    (this as any).renderer = null;
    this.controls.dispose();
    this.stop();
  }

  removeObjectByName (name) {
    // name is not necessarily unique, make this recursive ?
    const object = this.scene.getObjectByName(name);
    typeof object !== 'undefined' && this.scene.remove(object);
  }
}
