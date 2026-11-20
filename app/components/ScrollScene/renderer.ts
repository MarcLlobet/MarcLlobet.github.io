import { BEAMS, boxVertices, pixelsToClip, type Mat4 } from "./triangle";

export type Rgb = [number, number, number];

/** Face colours, in face order: +x, −x, +y (top), −y, +z, −z. */
export type FaceColours = [Rgb, Rgb, Rgb, Rgb, Rgb, Rgb];

const VERTEX = `
attribute vec3 aPosition;
attribute float aFace;
uniform mat4 uClip;
uniform mat4 uScene;
uniform mat4 uBeam;
uniform vec3 uColours[6];
varying vec3 vColour;
void main() {
  vColour = uColours[int(aFace + 0.5)];
  gl_Position = uClip * uScene * uBeam * vec4(aPosition, 1.0);
}
`;

const FRAGMENT = `
precision mediump float;
varying vec3 vColour;
void main() {
  gl_FragColor = vec4(vColour, 1.0);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

/**
 * A tiny WebGL renderer for the three beams: flat colour per face, depth
 * buffer, orthographic projection. Returns null where WebGL is unavailable.
 */
export const createRenderer = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
  });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const aPosition = gl.getAttribLocation(program, "aPosition");
  const aFace = gl.getAttribLocation(program, "aFace");
  const uClip = gl.getUniformLocation(program, "uClip");
  const uScene = gl.getUniformLocation(program, "uScene");
  const uBeam = gl.getUniformLocation(program, "uBeam");
  const uColours = gl.getUniformLocation(program, "uColours");

  const buffers = BEAMS.map((beam) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, boxVertices(beam.size), gl.STATIC_DRAW);
    return buffer;
  });

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 0);

  let width = 0;
  let height = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  const draw = (scene: Mat4, beams: Mat4[], colours: FaceColours) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uClip, false, pixelsToClip(width, height));
    gl.uniformMatrix4fv(uScene, false, scene);
    gl.uniform3fv(uColours, colours.flat());
    buffers.forEach((buffer, i) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(aFace);
      gl.vertexAttribPointer(aFace, 1, gl.FLOAT, false, 16, 12);
      gl.uniformMatrix4fv(uBeam, false, beams[i]);
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    });
  };

  return { resize, draw };
};
