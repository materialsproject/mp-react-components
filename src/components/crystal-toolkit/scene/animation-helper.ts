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

    // this supports animations based on the position
    if (json.type === JSON3DObject.SPHERES || json.type === JSON3DObject.CUBES) {
      if (Array.isArray(animations[0])) {
        animations.forEach((a: any, idx) =>
          this.addAnimationForPosition(a, three.children[idx], kf, kfl)
        );
      } else {
        this.addAnimationForPosition(animations, three, kf, kfl);
      }
    } else if (json.type === JSON3DObject.CYLINDERS) {
      animations.forEach((animation, aIdx) => {
        const idx = animation[2];
        const positionPair = json.positionPairs![idx];
        const start = positionPair[0];
        const end = positionPair[1];
        const targetPP = [
          [start[0] + animation[0][0], start[1] + animation[0][1], start[2] + animation[0][2]],
          [end[0] + animation[1][0], end[1] + animation[1][1], end[2] + animation[1][2]]
        ];
        const {
          scale: scaleStart,
          position: positionStart,
          quaternion: rotation
        } = three.children[idx];
        const st = [positionStart.x, positionStart.y, positionStart.z];
        const qt = [rotation.x, rotation.y, rotation.z, rotation.w];
        const {
          position,
          scale,
          quaternion: quaternionEnd
        } = this.objectBuilder.getCylinderInfo(targetPP);
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
        this.pushAnimations(
          `Cylinder-${idx}`,
          kfl,
          [positionKF, scaleKF, quaternion],
          three.children[idx]
        );
      });
    } else if (json.type === JSON3DObject.LINES) {
      // for line geometries, we are doing a small hack. We cannot use morphTargets to animate a line
      // geometry, so the trick is to use a field that will hold the interpolated value. We can
      // use those values to update the vertices of the geometry in the animate method
      const pt: number[] = [];
      json.positions!.forEach((p, idx) => {
        pt.push(p[0] + animations[idx][0], p[1] + animations[idx][1], p[2] + animations[idx][2]);
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

  private addAnimationForPosition(animation, three, kf: number[], kfl: number) {
    const values = this.calculateTargetPosition(three, animation);
    const positionKF = new THREE.VectorKeyframeTrack('.position', [...kf], values);
    this.pushAnimations('Action', kfl, [positionKF], three);
  }

  private calculateTargetPosition({ position }: THREE.Object3D, animation) {
    const p = [position.x, position.y, position.z];
    return [...p, ...[p[0] + animation[0], p[1] + animation[1], p[2] + animation[2]]];
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
