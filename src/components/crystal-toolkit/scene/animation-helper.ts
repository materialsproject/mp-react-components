import * as THREE from 'three';
import { BufferAttribute, BufferGeometry } from 'three';
import { JSON3DObject } from './constants';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { SceneJsonObject } from './simple-scene';
import { ThreeBuilder } from './three_builder';

export class AnimationHelper {
  private mixers: THREE.AnimationMixer[] = [];
  private clock = new THREE.Clock();
  private lineGeometriesToUpdate: THREE.LineSegments[] = [];

  constructor(private objectBuilder: ThreeBuilder) {}

  public reset() {
    this.mixers.forEach((m) => m.stopAllAction());
    this.mixers = [];
    this.lineGeometriesToUpdate = [];
  }

  public buildAnimationSupport(json: SceneJsonObject, three: THREE.Object3D) {
    const animations = json.animate!;
    const kf = json.keyframes!;
    const kfl = kf.length;
    const animationType = json.animateType!;

    // this supports animations based on the position
    // pseudo code:
    // ```
    // - THREE.js require a flatten array. For example, for position keyframes,
    //   an array like [1, 0, 0, 0, 0, 1] represents movement from (1, 0, 0) to (0, 0, 1).
    //   This array is used as input for VectorKeyframeTrack.
    //   Similarly, flattened arrays are used for QuaternionKeyframeTrack, NumberKeyframeTrack, etc.
    //   Reference: https://threejs.org/docs/#api/en/animation/KeyframeTrack
    // - A nested array structure that improves readability and maintains compatibility with
    //   the original data format. This structure is later parsed into a flattened array, as required by THREE.js.
    // - Construct a THREE.KeyframeTrack object. For example:
    //   const positionKF = new THREE.VectorKeyframeTrack('.position', [...kf], values);
    //   where `values` is the flattened array generated in the previous step.
    // - Use the private function `pushAnimations` to bind the animation to a THREE.AnimationClip
    //   and THREE.AnimationMixer instance.
    //   Example:
    //   this.pushAnimations('Action', kfl, [positionKF], three);
    // ```
    if (json.type === JSON3DObject.SPHERES || json.type === JSON3DObject.CUBES) {
      const animation = json.animate!;
      const p = json.positions![0];

      const values: number[] = [];
      if (animationType == 'displacement') {
        for (let i = 0; i < kfl; i++) {
          // VectorKeyframeTrack requires absolute positions relative to the current position
          // i.e. displacemnt itself
          values.push(animation[i][0], animation[i][1], animation[i][2]);
        }
      } else if (animationType == 'position') {
        for (let i = 0; i < kfl; i++) {
          // Given an absolute position, we subtract the animation values to compute relative displacement
          values.push(animation[i][0] - p[0], animation[i][1] - p[1], animation[i][2] - p[2]);
        }
      } else {
        console.warn(`Unknown animationType: ${animationType}`);
      }
      const positionKF = new THREE.VectorKeyframeTrack('.position', [...kf], values);

      let kflVal;
      if (animationType == 'displacement') {
        kflVal = -1;
      } else {
        kflVal = kfl;
      }
      this.pushAnimations('Action', kflVal, [positionKF], three);
    } else if (json.type === JSON3DObject.CYLINDERS) {
      animations.forEach((animation, aIdx) => {
        // create cylinders from u to v
        const positionPair = json.positionPairs![aIdx];
        const u_position = positionPair[0];
        const v_position = positionPair[1];

        let valuesp: any[] = [];
        let valuesq: any[] = [];
        let valuess: any[] = [];

        for (let i = 0; i < kfl; i++) {
          let target;
          // The function `this.objectBuilder.getCylinderInfo` requires the actual positions
          // of the atoms involved in the bond.
          if (animationType == 'displacement') {
            target = positionPair.map((item, index) =>
              item.map((num, idx) => num + animation[i][index][idx])
            );
          } else if (animationType == 'position') {
            target = [0, 1].map((r) => [0, 1, 2].map((c) => animation[i][r][c]));
          } else {
            console.warn(`Unknown animationType: ${animationType}`);
          }

          const {
            position: positionEnd,
            scale: scaleEnd,
            quaternion: quaternionEnd
          } = this.objectBuilder.getCylinderInfo(target);

          // make keyframeTrack's value
          valuesp = [...valuesp, ...positionEnd];
          // valuesq = [...valuesq, ...quaternion];
          valuesq = [
            ...valuesq,
            ...[quaternionEnd.x, quaternionEnd.y, quaternionEnd.z, quaternionEnd.w]
          ];
          valuess = [...valuess, ...[1, scaleEnd, 1]];
        }

        // make keyframeTrack
        const positionKF = new THREE.VectorKeyframeTrack('.position', kf, valuesp);
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', kf, valuesq);
        const scalenKF = new THREE.VectorKeyframeTrack('.scale', kf, valuess);

        // attach keyframe to object
        let kflVal;
        if (animationType == 'displacement') {
          kflVal = -1;
        } else {
          kflVal = kfl;
        }
        this.pushAnimations(
          `Cylinder-${aIdx}`,
          kflVal,
          [positionKF, quaternionKF, scalenKF],
          three.children[aIdx]
        );
      });
    } else if (json.type === JSON3DObject.LINES) {
      // for line geometries, we are doing a small hack. We cannot use morphTargets to animate a line
      // geometry, so the trick is to use a field that will hold the interpolated value. We can
      // use those values to update the vertices of the geometry in the animate method
      const pt: any[] = [];
      json.positions!.forEach((p, idx) => {
        const pta: number[] = [];
        for (let i = 0; i < kfl; i++) {
          pta.push(
            p[0] + animations[idx][i][0],
            p[1] + animations[idx][i][1],
            p[2] + animations[idx][i][2]
          );
        }
        pt.push(pta);
      });
      const lines = three.children[0] as THREE.LineSegments;
      const a: any = (
        (lines.geometry as THREE.BufferGeometry).attributes.position as BufferAttribute
      ).array;
      (lines as any).value = [...a];
      const keyFrame2 = new THREE.NumberKeyframeTrack('.value', kf, [...a, ...pt]);
      this.lineGeometriesToUpdate.push(lines as THREE.LineSegments);
      this.pushAnimations('Lines', kfl, [keyFrame2], lines);
    } else if (json.type === JSON3DObject.CONVEX) {
      // we need to animate two meshes, the polygon and the lines
      // we use the morphTarget approach, but for the lines, we need to do the same trick
      // as above
      const mesh = three.children[0] as THREE.Mesh;
      const lines = three.children[1] as THREE.LineSegments;
      const geo = mesh.geometry as BufferGeometry;
      geo.morphAttributes.position = [];
      // calculate morph target
      const pt = json.positions!.map((p, idx) => {
        return new THREE.Vector3(
          ...[
            p[0] + animations[idx][0][0],
            p[1] + animations[idx][0][1],
            p[2] + animations[idx][0][2]
          ]
        );
      });
      const geom = new ConvexGeometry(pt);
      geo.morphAttributes.position[0] = (geom as ConvexGeometry).attributes.position;
      mesh.morphTargetInfluences = [0];
      const keyFrame = new THREE.NumberKeyframeTrack('.morphTargetInfluences', kf, [0.0, 1.0]);
      this.pushAnimations('Convex', kfl, [keyFrame], mesh);
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: '#000000', linewidth: 1 })
      );
      /*(lines.geometry as THREE.BufferGeometry).setAttribute(
        'position',
        edges.getAttribute('position')
      );*/
      const a: any = (
        (lines.geometry as THREE.BufferGeometry).attributes.position as BufferAttribute
      ).array;
      const p: any = (line.geometry as any).attributes.position.array;
      (lines as any).value = [...a];
      const keyFrame2 = new THREE.NumberKeyframeTrack('.value', kf, [...a, ...p]);
      this.lineGeometriesToUpdate.push(lines as THREE.LineSegments);
      this.pushAnimations('Convexlines', kfl, [keyFrame2], lines);
    } else if (json.type === JSON3DObject.BEZIER) {
      console.warn('Animation not supported', json.type);
    } else {
      console.warn('Animation not supported', json.type);
    }
  }

  private addAnimationForPosition(animation, three, kf: number[], kfl: number, animationType) {
    const values = this.calculateTargetPosition(three, animation, kfl, animationType);
    const positionKF = new THREE.VectorKeyframeTrack('.position', [...kf], values);
    this.pushAnimations('Action', kfl, [positionKF], three);
  }

  private calculateTargetPosition({ position }: THREE.Object3D, animation, kfl, animationType) {
    // Iterate through all keyframes and construct a flattened array of their corresponding positions.
    const p = [position.x, position.y, position.z];
    const result: number[] = [];
    if (animationType == 'displacement') {
      for (let i = 0; i < kfl; i++) {
        result.push(p[0] + animation[i][0], p[1] + animation[i][1], p[2] + animation[i][2]);
      }
    } else if (animationType == 'position') {
      for (let i = 0; i < kfl; i++) {
        result.push(animation[i][0], animation[i][1], animation[i][2]);
      }
    } else {
      console.warn(`Unknown animationType: ${animationType}`);
    }
    return result;
  }

  private updateMixers(timeOrDelta, absolute = false) {
    this.mixers &&
      this.mixers.forEach((m) => (absolute ? m.setTime(timeOrDelta) : m.update(timeOrDelta)));
  }
  private updateLineGeometries() {
    this.lineGeometriesToUpdate.forEach((l) => {
      const geom = l.geometry as THREE.BufferGeometry;
      const values = (l as any).value;
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(values), 3));
      (geom.attributes.position as BufferAttribute).needsUpdate = true;
    });
  }

  public updateTime(time: number) {
    this.updateMixers(time, true);
    this.updateLineGeometries();
  }

  public animate() {
    this.updateMixers(this.clock.getDelta());
    this.updateLineGeometries();
  }

  private pushAnimations(
    name: string,
    duration: number,
    tracks: THREE.KeyframeTrack[],
    rootObject: THREE.Object3D
  ) {
    // change duration to -1 for seamlessly animation
    const clip = new THREE.AnimationClip(name, duration, tracks);
    const mixer = new THREE.AnimationMixer(rootObject);
    this.mixers.push(mixer);
    const ca = mixer.clipAction(clip);
    ca.play();
  }

  private useMorphTargetForAnimation(type: JSON3DObject): boolean {
    return (
      type === JSON3DObject.CUBES || type === JSON3DObject.CONVEX || type === JSON3DObject.LINES
    );
  }
}
