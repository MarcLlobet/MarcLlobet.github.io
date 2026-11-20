/**
 * Geometry of the impossible triangle.
 *
 * Three real, perpendicular beams follow x, then y, then z. The path ends at
 * (L, L, L), which an isometric camera looking down (1, 1, 1) projects onto the
 * start point: the triangle only "closes" from that exact angle, so any rotation
 * reveals the trick.
 */

export type Vec3 = [number, number, number];
type Quat = [number, number, number, number];
type Mat3 = [Vec3, Vec3, Vec3];

export const L = 100;
export const T = 24;

export const BEAMS: {
  size: Vec3;
  home: Vec3;
  from: [number, number];
  spin: Vec3;
}[] = [
  {
    size: [L + T, T, T],
    home: [L / 2, 0, 0],
    from: [-2.2, 1.1],
    spin: [0, 0, 140],
  },
  {
    size: [T, L + T, T],
    home: [L, L / 2, 0],
    from: [2.4, 0.8],
    spin: [130, 0, 0],
  },
  {
    size: [T, T, L + T],
    home: [L, L, L / 2],
    from: [0.2, -2.6],
    spin: [0, 150, 0],
  },
];

/** The visual centre: the centroid of the three corners the camera sees. */
const CENTROID: Vec3 = [(2 * L) / 3, L / 3, 0];

const s2 = Math.SQRT2;
const s3 = Math.sqrt(3);
const s6 = Math.sqrt(6);
/** Camera basis for a camera at (1, 1, 1) looking at the origin, y up. */
export const RIGHT: Vec3 = [1 / s2, 0, -1 / s2];
export const UP: Vec3 = [-1 / s6, 2 / s6, -1 / s6];
const BACK: Vec3 = [1 / s3, 1 / s3, 1 / s3];

/**
 * World → CSS (x right, y down, z towards the viewer), with no perspective.
 * The rows are a proper rotation, so CSS keeps the faces' front and back.
 */
const VIEW: Mat3 = [
  [-RIGHT[0], -RIGHT[1], -RIGHT[2]],
  [-UP[0], -UP[1], -UP[2]],
  BACK,
];

const normalize = (v: Vec3): Vec3 => {
  const length = Math.hypot(...v);
  return [v[0] / length, v[1] / length, v[2] / length];
};

export const axis = (right: number, up: number): Vec3 =>
  normalize([
    RIGHT[0] * right + UP[0] * up,
    RIGHT[1] * right + UP[1] * up,
    RIGHT[2] * right + UP[2] * up,
  ]);

export const quat = (a: Vec3, angle: number): Quat => {
  const s = Math.sin(angle / 2);
  return [a[0] * s, a[1] * s, a[2] * s, Math.cos(angle / 2)];
};

export const multiply = (a: Quat, b: Quat): Quat => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];

const toMatrix = ([x, y, z, w]: Quat): Mat3 => [
  [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
  [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
  [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
];

const times = (a: Mat3, b: Mat3): Mat3 =>
  [0, 1, 2].map((i) =>
    [0, 1, 2].map(
      (j) => a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j],
    ),
  ) as Mat3;

/**
 * CSS matrix3d that draws the triangle centred on (x, y) in viewport pixels,
 * `size` pixels wide, rotated by `rotation`.
 */
export const sceneMatrix = (
  x: number,
  y: number,
  size: number,
  rotation: Quat,
): string => {
  const scale = size / (1.2 * L);
  const a = times(VIEW, toMatrix(rotation)).map((row) =>
    row.map((value) => value * scale),
  ) as Mat3;
  const t = [0, 1, 2].map(
    (i) =>
      (i === 0 ? x : i === 1 ? y : 0) -
      (a[i][0] * CENTROID[0] + a[i][1] * CENTROID[1] + a[i][2] * CENTROID[2]),
  );
  const values = [
    a[0][0],
    a[1][0],
    a[2][0],
    0,
    a[0][1],
    a[1][1],
    a[2][1],
    0,
    a[0][2],
    a[1][2],
    a[2][2],
    0,
    t[0],
    t[1],
    t[2],
    1,
  ];
  return `matrix3d(${values.map((v) => +v.toFixed(5)).join(",")})`;
};

/** Where a beam starts its fly-in: off to the side on screen, in world units. */
export const beamStart = (home: Vec3, [right, up]: [number, number]): Vec3 => [
  home[0] + (RIGHT[0] * right + UP[0] * up) * L,
  home[1] + (RIGHT[1] * right + UP[1] * up) * L,
  home[2] + (RIGHT[2] * right + UP[2] * up) * L,
];
