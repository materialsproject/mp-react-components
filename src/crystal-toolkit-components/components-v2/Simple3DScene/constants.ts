export enum Renderer {
  SVG = 'svg',
  WEBGL = 'webgl'
}

export enum ExportType {
  png = 'png',
  dae = 'dae'
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

export enum Control {
  TRACKBALL = 'trackball',
  ORBIT = 'orbit'
}

export const defaults = {
  antialias: true,
  transparentBackground: true,
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
  controls: Control.TRACKBALL,
  enableZoom: true,
  secondaryObjectView: true,
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

export const DEBUG_STYLE = {
  width: '500px',
  height: '500px',
  top: 0,
  left: '500px',
  position: 'absolute' as 'absolute'
};
export const MOUNT_NODE_STYLE = { position: 'absolute' as 'absolute' };
export const MOUNT_NODE_CLASS = 'three-container';
export const MOUNT_DEBUG_NODE_CLASS = 'three-debug-container';

export const DEFAULT_SCENE_SIZE = 500;

export enum FieldType {
  VEC3 = 'vec3',
  VEC3_PAIRS = 'vec3Pair',
  COLOR = 'color',
  NUMBER = 'number',
  LIST = 'list'
}

export interface Field {
  name: string;
  type: FieldType;
  id: string;
  listSize?: number; // -1 for non-bounded lists
  listModel?: FieldType;
}

const fieldColor = { id: 'color', name: 'Color', type: FieldType.COLOR };
const fieldRadius = { id: 'radius', name: 'Radius', type: FieldType.NUMBER };
const fieldWidth = { id: 'headWidth', name: 'Head Width', type: FieldType.NUMBER };
const fieldLength = { id: 'headLength', name: 'Head Length', type: FieldType.NUMBER };
const fieldScale = { id: 'scale', name: 'Scale', type: FieldType.VEC3 };
const positionPairs = {
  id: 'positionPairs',
  name: 'Position pairs',
  type: FieldType.LIST,
  listModel: FieldType.VEC3_PAIRS
};
const position = {
  id: 'positions',
  name: 'Position',
  type: FieldType.LIST,
  listModel: FieldType.VEC3
};

const fields = [
  fieldLength,
  fieldRadius,
  fieldWidth,
  fieldScale,
  positionPairs,
  position,
  fieldColor
];

// map field id to to field definition
export const fieldIndex = fields.reduce(
  (acc: { [id: string]: Field }, f) => ({ ...acc, [f.id]: f }),
  {}
);

//positionPairs:

//  color: 'red',/
//  radius: 0.07,
//  headLength: 0.24,
//  headWidth: 0.14,
//  type: 'arrows',
//  clickable: false

export const OBJECT_TO_FIELDS: { [K in JSON3DObject]: Field[] | null } = {
  [JSON3DObject.LABEL]: null,
  [JSON3DObject.CYLINDERS]: [fieldColor, fieldRadius, positionPairs],
  [JSON3DObject.ARROWS]: [fieldRadius, fieldColor, fieldWidth, fieldLength, positionPairs],
  [JSON3DObject.SURFACES]: null,
  [JSON3DObject.CONVEX]: [fieldColor, position],
  [JSON3DObject.SPHERES]: [fieldColor, fieldRadius, position],
  [JSON3DObject.LINES]: [],
  [JSON3DObject.ELLIPSOIDS]: [fieldColor, fieldRadius, position],
  [JSON3DObject.CUBES]: []
};

export type ThreePosition = [number, number, number];
