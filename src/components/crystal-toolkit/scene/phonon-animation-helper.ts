import * as THREE from 'three';
import { BufferAttribute, BufferGeometry } from 'three';
import { JSON3DObject } from './constants';
import { SceneJsonObject } from './simple-scene';
import { ThreeBuilder } from './three_builder';

export class PhononAnimationHelper {
  private clock = new THREE.Clock();

  // refs to already-built objects (provided by objectBuilder)
  private atomNumber: number;
  private atomMeshes: THREE.Object3D[] = [];
  private bondMeshes: Map<string, THREE.Mesh> = new Map();
  private unitCellAtomIndexArray: number[] = [];

  private static bondKey(a: number, b: number) {
    return a < b ? `${a}->${b}` : `${b}->${a}`;
  }

  private static parseBondKey(key: string): [number, number] {
    const [bond1Str, bond2Str] = key.split('->');
    return [Number(bond1Str), Number(bond2Str)];
  }

  constructor(
    private objectBuilder: ThreeBuilder,
    private A: number,
    private phases: number[],
    private omega: number,
    private eigenVectors: number[]
  ) {
    this.atomNumber = phases.length;
  }

  public reset() {
    this.atomMeshes = new Array(this.atomNumber);
    this.unitCellAtomIndexArray = new Array(this.atomNumber);
    this.bondMeshes = new Map<string, THREE.Mesh>();
  }

  public buildAnimationSupport(json: SceneJsonObject, three: THREE.Object3D) {
    if (json.type === JSON3DObject.SPHERES) {
      const atomIndex = json._meta.atom_idx?.[0];
      if (atomIndex === undefined) return;
      const unitCellAtomIndex = json._meta.unit_cell_atom_idx?.[0];
      this.unitCellAtomIndexArray[atomIndex] = unitCellAtomIndex;

      const mesh = three.children[0] as THREE.Mesh;
      this.atomMeshes[atomIndex] = mesh;
    } else if (json.type === JSON3DObject.CYLINDERS) {
      const meta = json._meta;
      if (!meta) return;

      for (let i = meta.length - 1; i >= 0; i--) {
        const [atomIndex1, atomIndex2] = meta[i].atom_idx;
        const bondKey = PhononAnimationHelper.bondKey(atomIndex1, atomIndex2);

        if (!this.bondMeshes.has(bondKey)) {
          const mesh = three.children[i] as THREE.Mesh | undefined;
          if (mesh) this.bondMeshes.set(bondKey, mesh);
        } else {
          const child = three.children[i];
          if (child) three.remove(child);
        }
      }
    }
  }

  public updateTime(time: number) {}

  public animate() {
    // requestAnimationFrame(this.animate);

    const delta = this.clock.getElapsedTime();
    const A = 100; // this.A;
    const omega = this.omega;
    const phases = this.phases;

    const temAtomPosition = new Array(this.atomNumber);

    // update atoms
    this.atomMeshes.forEach((mesh, atomIndex) => {
      let base = mesh.userData.basePos as THREE.Vector3 | undefined;

      const unitCellAtomIndex = this.unitCellAtomIndexArray[atomIndex];

      if (!base) {
        base = mesh.position.clone();
        mesh.userData.basePos = base;
      }

      const phase = phases[unitCellAtomIndex];
      const eigenVector = this.eigenVectors[unitCellAtomIndex];

      const theta = omega * delta + phase;

      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      const displacement = new THREE.Vector3(
        A * (eigenVector[0][0] * cos - eigenVector[0][1] * sin),
        A * (eigenVector[1][0] * cos - eigenVector[1][1] * sin),
        A * (eigenVector[2][0] * cos - eigenVector[2][1] * sin)
      );

      const newPosition = base.clone().add(displacement);
      mesh.position.copy(newPosition);

      temAtomPosition[atomIndex] = newPosition;
    });

    // update bonds
    const vecY = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    const atom1Vec = new THREE.Vector3();
    const atom2Vec = new THREE.Vector3();
    const rel = new THREE.Vector3();
    const mid = new THREE.Vector3();

    this.bondMeshes.forEach((mesh, bondKey) => {
      const [atomIndex1, atomIndex2] = PhononAnimationHelper.parseBondKey(bondKey);

      const atom1Pos = temAtomPosition[atomIndex1];
      const atom2Pos = temAtomPosition[atomIndex2];

      atom1Vec.copy(atom1Pos);
      atom2Vec.copy(atom2Pos);

      rel.copy(atom2Vec).sub(atom1Vec);

      const len = rel.length();

      mid.copy(atom1Vec).add(atom2Vec).multiplyScalar(0.5);

      // update position
      mesh.position.copy(mid);

      // update quaternion
      quat.setFromUnitVectors(vecY, rel.normalize());
      mesh.setRotationFromQuaternion(quat);

      // update length
      mesh.scale.y = len;
    });
  }
}
