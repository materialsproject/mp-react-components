import * as THREE from 'three';
import { JSON3DObject, Light, Material, Renderer, ThreePosition } from './constants';
import { ConvexBufferGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { AmbientLight, DirectionalLight, HemisphereLight, Object3D } from 'three';

export const DEFAULT_DASHED_LINE_COLOR = '#000000';
export const DEFAULT_LINE_COLOR = '#2c3c54';
export const DEFAULT_MATERIAL_COLOR = '#52afb0';

/**
 *
 *  This class builds Three.js object.
 *
 *  TODO: implements lights/camera
 *
 */
export class ThreeBuilder {
  constructor(private settings) {}

  public makeCylinders(object_json, obj: THREE.Object3D) {
    const radius = object_json.radius || 1;
    const geom = this.getCylinderGeometry(radius, object_json.radiusTop, object_json.radiusBottom);
    const mat = this.makeMaterial(object_json.color);
    const vec_y = new THREE.Vector3(0, 1, 0); // initial axis of cylinder
    const quaternion = new THREE.Quaternion();
    object_json.positionPairs.forEach(positionPair => {
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
      obj.add(mesh);
    });
    return obj;
  }

  public makeLine(object_json, obj: THREE.Object3D) {
    const verts = new THREE.Float32BufferAttribute([].concat.apply([], object_json.positions), 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', verts);

    let mat;
    if (object_json.dashSize || object_json.scale || object_json.gapSize) {
      mat = new THREE.LineDashedMaterial({
        color: object_json.color || DEFAULT_DASHED_LINE_COLOR,
        linewidth: object_json.line_width || 1,
        scale: object_json.scale || 1,
        dashSize: object_json.dashSize || 3,
        gapSize: object_json.gapSize || 1
      });
    } else {
      mat = new THREE.LineBasicMaterial({
        color: object_json.color || DEFAULT_LINE_COLOR,
        linewidth: object_json.line_width || 1
      });
    }

    const mesh = new THREE.LineSegments(geom, mat);
    if (object_json.dashSize || object_json.scale || object_json.gapSize) {
      mesh.computeLineDistances();
    }
    obj.add(mesh);
    return obj;
  }

  public makeCube(object_json, obj: THREE.Object3D) {
    const size = object_json.width * this.settings.sphereScale;
    const geom = new THREE.BoxBufferGeometry(size, size, size);
    const mat = this.makeMaterial(object_json.color);
    object_json.positions.forEach((position: ThreePosition) => {
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...position);
      obj.add(mesh);
    });

    return obj;
  }

  public makeSurfaces(object_json, obj: THREE.Object3D) {
    const verts = new THREE.Float32BufferAttribute([].concat.apply([], object_json.positions), 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', verts);

    const opacity = object_json.opacity || this.settings.defaultSurfaceOpacity;
    const mat = this.makeMaterial(object_json.color, opacity);

    if (object_json.normals) {
      const normals = new THREE.Float32BufferAttribute([].concat.apply([], object_json.normals), 3);

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

  public makeConvex(object_json, obj: THREE.Object3D) {
    const points = object_json.positions.map(p => new THREE.Vector3(...p));
    const geom = new ConvexBufferGeometry(points);
    const opacity = object_json.opacity || this.settings.defaultSurfaceOpacity;
    const mat = this.makeMaterial(object_json.color, opacity);
    if (opacity) {
      mat.transparent = true;
      mat.depthWrite = false;
    }

    const mesh = new THREE.Mesh(geom, mat);
    obj.add(mesh);
    const edges = new THREE.EdgesGeometry(geom);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: object_json.color })
    );
    obj.add(line);
    return obj;
  }

  public getHeadGeometry(headWidth: number, headLength: number): THREE.ConeBufferGeometry {
    return new THREE.ConeBufferGeometry(
      headWidth * this.settings.cylinderScale,
      headLength * this.settings.cylinderScale,
      this.settings.cylinderSegments
    );
  }

  public getCylinderGeometry(
    radius: number,
    radiusTop?: number,
    radiusBottom?: number
  ): THREE.CylinderBufferGeometry {
    // body
    radiusTop == undefined && (radiusTop = radius);
    radiusBottom == undefined && (radiusBottom = radius);

    return new THREE.CylinderBufferGeometry(
      radiusTop * this.settings.cylinderScale,
      radiusBottom * this.settings.cylinderScale,
      1.0,
      this.settings.cylinderSegments
    );
  }

  public makeArrow(object_json, obj: THREE.Object3D) {
    // TODO obj is the parent object, rename to a better name
    const { radius = 1, radiusTop, radiusBottom, headLength = 2, headWidth = 2 } = object_json;
    // body
    const geom_cyl = this.getCylinderGeometry(radius, radiusTop, radiusBottom);
    // head
    const geom_head = this.getHeadGeometry(headWidth, headLength);
    const mat = this.makeMaterial(object_json.color);

    const vec_y = new THREE.Vector3(0, 1, 0); // initial axis of cylinder
    const quaternion = new THREE.Quaternion();

    // for each pairs, we have one cylinder and one head, so obj will have meshes as children
    // for 2 position pairs, 1cylinder, 1head, 2cylinder, 2head

    object_json.positionPairs.forEach(positionPair => {
      // the following is technically correct but could be optimized?
      const mesh = new THREE.Mesh(geom_cyl, mat);
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
      mesh_head.setRotationFromQuaternion(quaternion.clone());
      obj.add(mesh_head);
    });
    return obj;
  }

  public makeMaterial(color = DEFAULT_MATERIAL_COLOR, opacity = 1.0) {
    const parameters = Object.assign(this.settings.material.parameters, {
      color: color,
      opacity: opacity
    });

    if (this.settings.renderer === Renderer.SVG) {
      return new THREE.MeshBasicMaterial(parameters);
    }

    switch (this.settings.material.type) {
      case Material.standard: {
        const mat = new THREE.MeshStandardMaterial(parameters);
        return mat;
      }
      default:
        throw new Error('Unknown material.');
    }
  }

  public makeSphere(object_json, obj: THREE.Object3D) {
    const { geom, mat } = this.getSphereBuffer(
      object_json.radius * this.settings.sphereScale,
      object_json.color,
      object_json.phiStart,
      object_json.phiEnd
    );
    object_json.positions.forEach((position: ThreePosition) => {
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...position);
      obj.add(mesh);
      return mesh;
    });
    return obj;
  }

  public makeLabel(object_json, obj: THREE.Object3D) {
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
    return obj;
  }

  public makeEllipsoids(object_json, obj: THREE.Object3D) {
    const { geom, mat } = this.getSphereBuffer(
      this.settings.sphereScale,
      object_json.color,
      object_json.phiStart,
      object_json.phiEnd
    );
    const meshes = object_json.positions.map((position: ThreePosition) => {
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...position);
      mesh.scale.set(...(object_json.scale as ThreePosition));
      return mesh;
    });
    // TODO: test axes are correct!
    const vec_z = new THREE.Vector3(0, 0, 1);
    const quaternion = new THREE.Quaternion();
    if (object_json.rotate_to) {
      object_json.rotate_to.forEach((rotation: any, index) => {
        const rotation_vec = new THREE.Vector3(...rotation);
        quaternion.setFromUnitVectors(vec_z, rotation_vec.normalize());
        meshes[index].setRotationFromQuaternion(quaternion);
      });
    }
    meshes.forEach(mesh => obj.add(mesh));
    return obj;
  }

  public makeObject(object_json, obj: THREE.Object3D): THREE.Object3D {
    switch (object_json.type as JSON3DObject) {
      case JSON3DObject.SPHERES: {
        return this.makeSphere(object_json, obj);
      }
      case JSON3DObject.ELLIPSOIDS: {
        return this.makeEllipsoids(object_json, obj);
      }
      case JSON3DObject.CYLINDERS: {
        return this.makeCylinders(object_json, obj);
      }
      case JSON3DObject.CUBES: {
        return this.makeCube(object_json, obj);
      }
      case JSON3DObject.LINES: {
        return this.makeLine(object_json, obj);
      }
      case JSON3DObject.SURFACES: {
        return this.makeSurfaces(object_json, obj);
      }
      case JSON3DObject.CONVEX: {
        return this.makeConvex(object_json, obj);
      }
      case JSON3DObject.ARROWS: {
        // take inspiration from ArrowHelper, user cones and cylinders
        return this.makeArrow(object_json, obj);
      }
      case JSON3DObject.LABEL: {
        return this.makeLabel(object_json, obj);
      }
      default: {
        return obj;
      }
    }
  }

  public getSphereGeometry(radius: number, phiStart: number, phiEnd: number) {
    const geom = new THREE.SphereBufferGeometry(
      radius,
      this.settings.sphereSegments,
      this.settings.sphereSegments,
      phiStart || 0,
      phiEnd || Math.PI * 2
    );
    return geom;
  }

  private getSphereBuffer(radius: number, color: string, phiStart: number, phiEnd: number) {
    const geom = this.getSphereGeometry(radius, phiStart, phiEnd);
    const mat = this.makeMaterial(color);
    return { geom, mat };
  }

  public makeLights(light_json): Object3D {
    const lightGroup = new THREE.Object3D();
    lightGroup.name = 'lights';
    light_json.forEach(light => {
      let lightObj;
      switch (light.type) {
        case Light.DirectionalLight:
          lightObj = new THREE.DirectionalLight(...light.args);
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
      lightGroup.add(lightObj);
    });
    return lightGroup;
  }

  public makeLightsHelper(lights: THREE.Light[]): Object3D {
    const lightHelperGroup = new THREE.Object3D();
    return lights.reduce((acc, light) => {
      switch (light.constructor) {
        case DirectionalLight:
          acc.add(new THREE.DirectionalLightHelper(light as DirectionalLight, 1));
          break;
        case AmbientLight:
          break;
        case HemisphereLight:
          acc.add(new THREE.HemisphereLightHelper(light as HemisphereLight, 1));
          break;
        default:
          console.error('Unknown light type.');
          break;
      }
      return acc;
    }, lightHelperGroup);
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
