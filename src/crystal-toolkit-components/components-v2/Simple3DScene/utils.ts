import { ColladaExporter } from 'three/examples/jsm/exporters/ColladaExporter';
import { ExportType } from './constants';
import Simple3DScene from './Simple3DScene';
import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import toDataUrl from 'svgtodatauri';

export function downloadScreenshot(filename: string, sceneComponent) {
  //TODO(chab) extract as a general utility method
  // throw if svg render is used

  // using method from Three.js editor
  // create a link and hide it from end-user
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  sceneComponent.renderScene();
  // and set link href to renderer contents
  if (sceneComponent.renderer instanceof WebGLRenderer) {
    link.href = (<HTMLCanvasElement>sceneComponent.renderer.domElement).toDataURL('image/png');
    triggerDownload(link, filename);
  } else {
    toDataUrl(sceneComponent.renderer.domElement, 'image/png', {
      callback: function(data) {
        link.href = data;
        triggerDownload(link, filename);
      }
    });
  }
}

function triggerDownload(link: HTMLAnchorElement, filename: string) {
  link.download = filename || 'screenshot.png';
  link.click();
}

export function downloadCollada(filename: string, sceneComponent: Simple3DScene) {
  // Note(chab) i think it's better to use callback, so we can manage failure
  const files = new ColladaExporter().parse(
    sceneComponent.scene,
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

export function download(filename: string, filetype: ExportType, sceneComponent: Simple3DScene) {
  // force a render (in case buffer has been cleared)
  switch (filetype) {
    case ExportType.png:
      downloadScreenshot(filename, sceneComponent);
      break;
    case ExportType.dae:
      downloadCollada(filename, sceneComponent);
      break;
    default:
      throw new Error('Unknown filetype.');
  }
}

function disposeNode(node) {
  if (node instanceof THREE.Mesh) {
    if (node.geometry) {
      node.geometry.dispose();
    }
    if (node.material) {
      const materials = !Array.isArray(node.material) ? [node.material] : node.material;
      materials.forEach((mtrl: any) => {
        mtrl.map && mtrl.map.dispose();
        mtrl.lightMap && mtrl.lightMap.dispose();
        mtrl.bumpMap && mtrl.bumpMap.dispose();
        mtrl.normalMap && mtrl.normalMap.dispose();
        mtrl.specularMap && mtrl.specularMap.dispose();
        mtrl.envMap && mtrl.envMap.dispose();
        mtrl.alphaMap && mtrl.alphaMap.dispose();
        mtrl.aoMap && mtrl.aoMap.dispose();
        mtrl.displacementMap && mtrl.displacementMap.dispose();
        mtrl.emissiveMap && mtrl.emissiveMap.dispose();
        mtrl.gradientMap && mtrl.gradientMap.dispose();
        mtrl.metalnessMap && mtrl.metalnessMap.dispose();
        mtrl.roughnessMap && mtrl.roughnessMap.dispose();
        mtrl.dispose(); // disposes any programs associated with the material
      });
    }
  }
} // disposeNode

export function disposeSceneHierarchy(scene) {
  scene.children.forEach(childNode => {
    disposeSceneHierarchy(childNode);
    disposeNode(childNode);
  });
}

// this will give the x/y coordinate in the normalized device coordinates, whose center is (0,0) and w-h is 2
// NW -> -1 / 1
// NE -> 1 / 1
// SW -> - 1 / -1
// SE -> 1 / -1
// let' suppose i have a (500, 500) viewport, i click on the center
// CENTER = > ( 250 / 500 * 2 - 1 = 0, - (250/500) * 2 + 1 = 0)
// SE (500/500 * 2 -1 ) = 1, ( - (500/500) * 2 + 1 = -1)
// SW (0 - 1) = -1, -(500 / 500 ) * 2 + 1 = -1)
export function getThreeScreenCoordinate(size, clientX: number, clientY: number) {
  return new THREE.Vector2((clientX / size.width) * 2 - 1, -(clientY / size.height) * 2 + 1);
}

export interface Action<T, P> {
  type: T;
  payload: P;
}

export class ObjectRegistry {
  private objectRegistry = {};
  clear(): void {
    this.objectRegistry = {};
  }
  addToObjectRegisty(o: THREE.Object3D): void {
    this.objectRegistry[o.uuid] = o;
  }
  deleteObject(o: THREE.Object3D) {
    if (!this.registryHasObject(o)) {
      console.warn('Object does not exits');
    }
    delete this.objectRegistry[o.uuid];
  }
  registryHasObject(o: THREE.Object3D): boolean {
    return !!this.objectRegistry[o.uuid];
  }
  getObjectFromRegistry(uuid: string): THREE.Object3D {
    if (!this.objectRegistry[uuid]) {
      console.warn('Non existent object', uuid);
    }
    return this.objectRegistry[uuid];
  }
}
