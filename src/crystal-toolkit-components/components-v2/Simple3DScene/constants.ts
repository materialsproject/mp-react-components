export enum Renderer {
  SVG = 'svg',
  WEBGL = 'webgl'
}

export enum ExportType {
  png = 'png',
  dae = 'pae'
}

export enum Material {
  standard = 'MeshStandardMaterial'
}

export enum Light {
  DirectionalLight = 'DirectionalLight',
  AmbientLight = 'AmbientLight',
  HemisphereLight = 'HemisphereLight'
}

export const DEFAULT_LIGHT_COLOR = '#444444';

export const defaults = {
  antialias: true,
  transparentBackground: false,
  renderer: Renderer.WEBGL,
  renderDivBackground: false,
  background: '#ffffff',
  sphereSegments: 32,
  cylinderSegments: 16,
  staticScene: true,
  sphereScale: 1.0,
  cylinderScale: 1.0,
  extractAxis: false,
  defaultSurfaceOpacity: 0.5,
  lights: [
    {
      type: Light.HemisphereLight,
      args: ['#eeeeee', '#999999', 1.0]
    },
    {
      type: Light.DirectionalLight,
      args: ['#ffffff', 0.15],
      position: [0, 0, -10]
    },
    {
      type: Light.DirectionalLight,
      args: ['#ffffff', 0.15],
      position: [-10, 10, 10]
    }
  ],
  material: {
    type: Material.standard,
    parameters: {
      roughness: 0.07,
      metalness: 0.0
    }
  },
  enableZoom: true,
  defaultZoom: 0.8
};

export enum JSON3DObject {
  ELLIPSOIDS = 'ellipsoids',
  CYLINDERS = 'cylinders',
  SPHERES = 'spheres',
  ARROWS = 'arrows',
  CUBES = 'cubes',
  LINES = 'lines',
  SURFACES = 'surface',
  CONVEX = 'convex',
  LABEL = 'labels'
}
