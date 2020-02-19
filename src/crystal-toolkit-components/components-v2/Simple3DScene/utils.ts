import { ColladaExporter } from 'three/examples/jsm/exporters/ColladaExporter';
import { ExportType } from './constants';

export function downloadScreenshot(filename: string) {
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

export function downloadCollada(filename: string) {
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

export function download(filename: string, filetype: ExportType) {
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
