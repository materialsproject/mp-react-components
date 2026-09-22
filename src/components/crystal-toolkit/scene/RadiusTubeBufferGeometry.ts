// TubeBufferGeometry

import { BufferGeometry, Float32BufferAttribute, Vector2, Vector3 } from 'three';

type WritableBufferGeometry = {
  setIndex(index: unknown): void;
  setAttribute(name: string, attribute: unknown): void;
};

function populateRadiusTubeBufferGeometry(
  geometry: RadiusTubeBufferGeometry,
  path,
  tubularSegments,
  radius,
  radialSegments,
  closed,
  taper
) {
  (geometry as any).parameters = {
    path: path,
    tubularSegments: tubularSegments,
    radius: radius,
    radialSegments: radialSegments,
    closed: closed
  };

  tubularSegments = tubularSegments || 64;
  radius = radius || 1;
  radialSegments = radialSegments || 8;
  closed = closed || false;

  var frames = path.computeFrenetFrames(tubularSegments, closed);

  // expose internals

  geometry.tangents = frames.tangents;
  geometry.normals = frames.normals;
  geometry.binormals = frames.binormals;

  // helper variables

  var vertex = new Vector3();
  var normal = new Vector3();
  var uv = new Vector2();
  var P = new Vector3();

  var i, j;

  // buffer

  var vertices: any = [];
  var normals: any = [];
  var uvs: any = [];
  var indices: any = [];

  // create buffer data

  generateBufferData();

  // build geometry

  const writableGeometry = geometry as unknown as WritableBufferGeometry;
  writableGeometry.setIndex(indices);
  writableGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  writableGeometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  writableGeometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

  // functions

  function generateBufferData() {
    for (i = 0; i < tubularSegments; i++) {
      generateSegment(i);
    }

    // if the geometry is not closed, generate the last row of vertices and normals
    // at the regular position on the given path
    //
    // if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

    generateSegment(closed === false ? tubularSegments : 0);

    // uvs are generated in a separate function.
    // this makes it easy compute correct values for closed geometries

    generateUVs();

    // finally create faces

    generateIndices();
  }

  function generateSegment(i) {
    // we use getPointAt to sample evenly distributed points from the given path

    P = path.getPointAt(i / tubularSegments, P);

    // retrieve corresponding normal and binormal

    var N = frames.normals[i];
    var B = frames.binormals[i];

    // generate normals and vertices for the current segment

    for (j = 0; j <= radialSegments; j++) {
      var v = (j / radialSegments) * Math.PI * 2;

      var sin = Math.sin(v);
      var cos = -Math.cos(v);

      // normal

      normal.x = cos * N.x + sin * B.x;
      normal.y = cos * N.y + sin * B.y;
      normal.z = cos * N.z + sin * B.z;
      normal.normalize();

      normals.push(normal.x, normal.y, normal.z);

      // vertex

      vertex.x = P.x + taper(radius, i) * normal.x;
      vertex.y = P.y + taper(radius, i) * normal.y;
      vertex.z = P.z + taper(radius, i) * normal.z;

      vertices.push(vertex.x, vertex.y, vertex.z);
    }
  }

  function generateIndices() {
    for (j = 1; j <= tubularSegments; j++) {
      for (i = 1; i <= radialSegments; i++) {
        var a = (radialSegments + 1) * (j - 1) + (i - 1);
        var b = (radialSegments + 1) * j + (i - 1);
        var c = (radialSegments + 1) * j + i;
        var d = (radialSegments + 1) * (j - 1) + i;

        // faces

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
  }

  function generateUVs() {
    for (i = 0; i <= tubularSegments; i++) {
      for (j = 0; j <= radialSegments; j++) {
        uv.x = i / tubularSegments;
        uv.y = j / radialSegments;

        uvs.push(uv.x, uv.y);
      }
    }
  }
}

export class RadiusTubeBufferGeometry extends BufferGeometry {
  public readonly type = 'RadiusTubeBufferGeometry';
  public tangents!: Vector3[];
  public normals!: Vector3[];
  public binormals!: Vector3[];

  constructor(path, tubularSegments, radius, radialSegments, closed, taper) {
    super();
    populateRadiusTubeBufferGeometry(
      this,
      path,
      tubularSegments,
      radius,
      radialSegments,
      closed,
      taper
    );
  }

  toJSON() {
    var data: any = super.toJSON();
    data.path = (this as any).parameters.path.toJSON();
    return data;
  }
}
