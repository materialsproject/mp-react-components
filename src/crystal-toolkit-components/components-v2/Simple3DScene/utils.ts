import { ColladaExporter } from 'three/examples/jsm/exporters/ColladaExporter';
import { ExportType } from './constants';
import Simple3DSceneComponent from './Simple3DSceneComponent.react';
import Simple3DScene from './Simple3DScene';

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
  link.href = (<HTMLCanvasElement>sceneComponent.renderer.domElement).toDataURL('image/png');
  // click link to download
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
