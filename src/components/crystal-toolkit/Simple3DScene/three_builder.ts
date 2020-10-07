import * as THREE from 'three';
import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  Object3D,
  SphereBufferGeometry
} from 'three';
import {
  JSON3DObject,
  Light,
  Material,
  RADIUS_SEGMENTS,
  Renderer,
  ThreePosition,
  TUBE_SEGMENTS
} from './constants';
import { ConvexBufferGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { RadiusTubeBufferGeometry } from './RadiusTubeBufferGeometry';

export const DEFAULT_DASHED_LINE_COLOR = '#000000';
export const DEFAULT_LINE_COLOR = '#2c3c54';
export const DEFAULT_MATERIAL_COLOR = '#52afb0';
import { mergeInnerArrays } from './utils';

// i think it would be better to have a mixin or a decorator, so we do not need
// to create a sub class for each kind of curve. we would store the original curve and
// just forward the calls to it
class QuadraticSteppedBezierCurver extends THREE.QuadraticBezierCurve3 {
  private delta = 0;
  private parts = 2; // let's suppose we use a spline, we'll need to derive the parts from
  // the length of the vector array

  constructor(v0, v1, v2) {
    super(v0, v1, v2);
  }
  setPart(part: number) {
    if (part >= this.parts) {
      console.error('Part index is too high :', part, '.Curve has:', this.parts, ' parts');
    }
    this.delta = (1 / this.parts) * part;
  }
  getPoint(t: number, optionalTarget?: THREE.Vector3): THREE.Vector3 {
    return super.getPoint(this.delta + t / this.parts);
  }
}

/**
 *
 *  This class builds Three.js object.
 *
 *  TODO: implements lights/camera
 *
 */
export class ThreeBuilder {
  constructor(private settings) {}

  private validateRadiusArrays({ radiusTop, radiusBottom, positionPairs }) {
    if (!Array.isArray(radiusBottom)) {
      console.error('radiusBottom is not an array', radiusBottom);
      return;
    }

    if (radiusTop.length !== radiusBottom.length) {
      console.error('radiusTop/Bottom arrays have different length');
    }

    if (radiusTop.length !== positionPairs.length || radiusBottom.length !== positionPairs.length) {
      console.warn(
        'radiusTop/Bottom length does not match positions array, will fallback to radius for missing values'
      );
    }
  }

  public makeBezierTube(object_json, obj: THREE.Object3D) {
    object_json.controlPoints.forEach(
      (controlPoints: [ThreePosition, ThreePosition, ThreePosition]) => {
        const cps = controlPoints.map(cp => new THREE.Vector3(...cp)) as [
          THREE.Vector3,
          THREE.Vector3,
          THREE.Vector3
        ];
        const curve = new QuadraticSteppedBezierCurver(...cps);
        const numberOfParts = controlPoints.length - 1;
        for (let i = 0; i < numberOfParts; i++) {
          curve.setPart(i);
          const radiusStart = object_json.radius[i];
          const radiusEnd = object_json.radius[i + 1];
          const geometry = new RadiusTubeBufferGeometry(
            curve,
            TUBE_SEGMENTS,
            radiusStart,
            RADIUS_SEGMENTS,
            false,
            (a, b) => a + (radiusEnd - radiusStart) * (b / TUBE_SEGMENTS)
          );
          obj.add(
            new THREE.Mesh(geometry, this.makeMaterial(object_json.color[i], object_json.animate))
          );
        }
      }
    );
    return obj;
  }

  public makeCylinders(object_json, obj: THREE.Object3D) {
    const { radius = 1, radiusTop, radiusBottom, color } = object_json;
    const perCylinderGeometry = Array.isArray(radiusTop);
    perCylinderGeometry && this.validateRadiusArrays(object_json);
    const perCylinderMaterial = Array.isArray(color);
    const geom = this.getCylinderGeometry(radius, radiusTop, radiusBottom);
    const mat = this.makeMaterial(color, object_json.animate);
    const vec_y = new THREE.Vector3(0, 1, 0); // initial axis of cylinder
    const quaternion = new THREE.Quaternion();
    object_json.positionPairs.forEach((positionPair, idx) => {
      // the following is technically correct but could be optimized?
      const currentGeometry = perCylinderGeometry
        ? this.getCylinderGeometry(radius, radiusTop[idx], radiusBottom[idx])
        : geom;
      const currentMaterial =
        perCylinderMaterial && mat instanceof THREE.MeshStandardMaterial ? mat.clone() : mat;
      perCylinderMaterial && (mat.color = new THREE.Color(color[idx]));

      const mesh = new THREE.Mesh(currentGeometry, currentMaterial);
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
    const verts = new THREE.Float32BufferAttribute(mergeInnerArrays(object_json.positions), 3);
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
    const mat = this.makeMaterial(object_json.color, object_json.animate);
    object_json.positions.forEach((position: ThreePosition) => {
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...position);
      obj.add(mesh);
    });

    return obj;
  }

  public makeSurfaces(object_json, obj: THREE.Object3D) {
    const verts = new THREE.Float32BufferAttribute(mergeInnerArrays(object_json.positions), 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', verts);

    const opacity = object_json.opacity || this.settings.defaultSurfaceOpacity;
    const mat = this.makeMaterial(object_json.color, object_json.animate, opacity);

    if (object_json.normals) {
      const normals = new THREE.Float32BufferAttribute(mergeInnerArrays(object_json.normals), 3);

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
    const mat = this.makeMaterial(object_json.color, object_json.animate, opacity);
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

  //Note(chab) we use morphtargets for geometries like cube, convex, beziers
  // objects that are built by scaling and rotating a simple geometry should
  // be animated by interpolating those specific properties
  public makeMaterial(color = DEFAULT_MATERIAL_COLOR, animated = false, opacity = 1.0) {
    const parameters = Object.assign(this.settings.material.parameters, {
      color: color,
      opacity: opacity,
      morphTargets: animated
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
      case JSON3DObject.BEZIER: {
        return this.makeBezierTube(object_json, obj);
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
    const mat = this.makeMaterial(color, false);
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

  // object updates

  public updateSphereCenter(
    obj: THREE.Object3D,
    baseJsonObject,
    newPosition: ThreePosition,
    index
  ) {
    const mesh = obj.children[index] as THREE.Mesh;
    mesh.position.set(...newPosition);
  }

  public updateSphereColor(obj: THREE.Object3D, baseJsonObject, newColor) {
    // get uuid from json object
    obj.children.forEach(o => {
      const material = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.color = new THREE.Color(newColor);
    });
  }

  public updateConvexColor(obj, objjson, color) {
    obj.children.forEach(o => {
      o.material.color = new THREE.Color(color);
    });
  }

  public updateConvexEdges(obj, objjson, positions) {
    const points = positions.map(p => new THREE.Vector3(...p));
    const geom = new ConvexBufferGeometry(points);
    const edges = new THREE.EdgesGeometry(geom);
    obj.children[0].geometry.dispose();
    obj.children[1].geometry.dispose();
    obj.children[0].geometry = geom;
    obj.children[1].geometry = edges;
  }

  public updateSphereRadius(obj: THREE.Object3D, baseJsonObject, newRadius) {
    const geometry = (obj.children[0] as THREE.Mesh).geometry as SphereBufferGeometry;
    const phiStart = geometry.parameters.phiStart;
    const phiEnd = geometry.parameters.phiLength;
    const newGeometry = this.getSphereGeometry(newRadius, phiStart, phiEnd);
    obj.children.forEach(o => {
      (o as THREE.Mesh).geometry.dispose();
      (o as THREE.Mesh).geometry = newGeometry;
    });
  }

  // TODO(chab) merge the two below methods
  // arrow width
  public updateHeadWidth(obj: THREE.Object3D, baseJsonObject, headWidth) {
    const geom_head = this.getHeadGeometry(headWidth, baseJsonObject.headWidth);
    baseJsonObject.positionPairs.forEach((a, idx) => {
      const headIndex = idx * 2 + 1;
      const mesh_head = obj.children[headIndex];
      (mesh_head as THREE.Mesh).geometry.dispose();
      (mesh_head as THREE.Mesh).geometry = geom_head;
    });
  }

  // arrow length
  public updateHeadLength(obj: THREE.Object3D, baseJsonObject, headLength) {
    const geom_head = this.getHeadGeometry(baseJsonObject.headWidth, headLength);
    baseJsonObject.positionPairs.forEach((a, idx) => {
      const headIndex = idx * 2 + 1;
      const mesh_head = obj.children[headIndex];
      (mesh_head as THREE.Mesh).geometry.dispose();
      (mesh_head as THREE.Mesh).geometry = geom_head;
    });
  }

  public updateArrowColor(obj: THREE.Object3D, baseJsonObject, color) {
    obj.children.forEach(o => {
      ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new THREE.Color(color);
    });
  }

  public updateArrowRadius(obj: THREE.Object3D, baseJsonObject, radius) {
    const geom_cyl = this.getCylinderGeometry(radius);
    baseJsonObject.positionPairs.forEach((a, idx) => {
      const headIndex = idx * 2;
      const mesh_head = obj.children[headIndex];
      (mesh_head as THREE.Mesh).geometry.dispose();
      (mesh_head as THREE.Mesh).geometry = geom_cyl;
    });
  }

  //TODO(chab) check if positions are different, update the whole mesh
  // OR let pass the index so we know what to update
  public updateArrowpositionPair(baseJsonObject, newScale) {
    //but reuse material if possible
    baseJsonObject.positionPairs.forEach(a => {});
  }

  public updateLineSegments(obj: THREE.Object3D, object_json, positions) {
    const verts = new THREE.Float32BufferAttribute(positions, 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', verts);
    const mesh: THREE.LineSegments = obj.children[0] as THREE.LineSegments;
    mesh.geometry = geom;
  }

  public updateLineStyle(
    obj: THREE.Object3D,
    object_json,
    color,
    lineWidth,
    scale,
    dashSize,
    gapSize
  ) {
    const mesh: THREE.LineSegments = obj.children[0] as THREE.LineSegments;
    let mat;

    //FIXME(update material instead)
    if (
      object_json.dashSize ||
      object_json.scale ||
      object_json.gapSize ||
      dashSize ||
      scale ||
      gapSize
    ) {
      mat = new THREE.LineDashedMaterial({
        color: color || object_json.color || DEFAULT_DASHED_LINE_COLOR,
        linewidth: lineWidth || object_json.line_width || 1,
        scale: scale || object_json.scale || 1,
        dashSize: dashSize || object_json.dashSize || 3,
        gapSize: gapSize || object_json.gapSize || 1
      });
    } else {
      mat = new THREE.LineBasicMaterial({
        color: color || object_json.color || DEFAULT_LINE_COLOR,
        linewidth: lineWidth || object_json.line_width || 1
      });
    }
    mesh.material = mat;
    if (
      object_json.dashSize ||
      object_json.scale ||
      object_json.gapSize ||
      dashSize ||
      scale ||
      gapSize
    ) {
      mesh.computeLineDistances();
    }
  }

  // generic
  public updateScale(baseJsonObject, newScale) {}

  // cylinder, see arrows
  public updateCylinderPositionPair(obj: THREE.Object3D, baseJsonObject, newPositionPair, index) {
    const mesh = obj.children[index] as THREE.Mesh;
    const { scale, position, quaternion } = this.getCylinderInfo(newPositionPair);
    mesh.position.set(...(position as ThreePosition));
    mesh.scale.y = scale;
    mesh.setRotationFromQuaternion(quaternion);
  }

  public getCylinderInfo(positionPair) {
    const vec_a = new THREE.Vector3(...positionPair[0]);
    const vec_b = new THREE.Vector3(...positionPair[1]);
    const vec_rel = vec_b.sub(vec_a);
    const length = vec_rel.length();
    const vec_midpoint = vec_a.add(vec_rel.clone().multiplyScalar(0.5));
    const quaternion = new THREE.Quaternion();
    const vec_y = new THREE.Vector3(0, 1, 0); // initial axis of cylinder
    quaternion.setFromUnitVectors(vec_y, vec_rel.normalize());
    return {
      scale: length,
      position: [vec_midpoint.x, vec_midpoint.y, vec_midpoint.z],
      quaternion
    };
  }

  //TODO(chab) can be refactored with the sphere
  public updateCylinderRadius(obj: THREE.Object3D, baseJsonObject, newRadius) {
    //CylinderBufferGeometry
    const newGeometry = this.getCylinderGeometry(newRadius);
    obj.children.forEach(o => {
      (o as THREE.Mesh).geometry.dispose();
      (o as THREE.Mesh).geometry = newGeometry;
    });
  }

  public updateCylinderColor(obj: THREE.Object3D, baseJsonObject, newColor) {
    obj.children.forEach(o => {
      const material = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.color = new THREE.Color(newColor);
    });
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
