WebGL is an adaptation of the [OpenGL ES 2.0 Spec](https://www.khronos.org/opengles/) to JavaScript, and started off as a collaboration of the Khronos Group and Mozilla. OpenGL is a library designed from a collaboration of multiple companies as a cross platform rendering API.

At its core, WebGL is a state machine that lets you tell it how and where it will draw triangles/points/lines, so it's your job as a engine developer to organize when and how the state of the application will change.

To help introduce WebGL I've written out a simple application which you can find on my [codepen](http://codepen.io/alaingalvan/pen/OMEqKa). This is a simplified rendering system similar to APIs like Three.js, but I've taken some shortcuts in its design like using the singleton pattern.

In the end, your app will look like the following:

```js
import {FullscreenRenderer, Scene, Triangle} from './lib';

class Engine {
  renderer = new FullscreenRenderer();
  scene = new Scene();
  constructor() {
    document.getElementById('webgl').appendChild(this.renderer.canvas);

    var gameObject = new Triangle();
    this.scene.add(gameObject);
    this.animate();
  }
  animate = () => {
    this.renderer.render(this.scene);
    requestAnimationFrame(this.animate);
  }
}

var engine = new Engine();

```

## `gl` - The WebGL Context

In WebGL the context is the gateway to the OpenGL Driver and lets you access all the enums and functions described in the WebGL spec. WebGL like OpenGL is a state machine, meaning you give it values to set it state, then draw from that state with functions such as `gl.drawArrays`, `gl.drawElements`.

A context has a number of default values already established for you, like a *default frame buffer* (otherwise it wouldn't display anything!), some default values for how draw calls *overlap each other* (should they overwrite, or blend?). You're able to extend these defaults at any step in the draw process.

So if you have experience with imperative APIs like HTML5 Canvas or Game Maker Studio's draw system, you'll feel right at home with *Raw WebGL*.

```js
// Lets make a global var called gl, this will serve as a
// singleton to our app's WebGL context.
var gl;

type WebGLContextAttributes = {
  failIfMajorPerformanceCaveat?: boolean,
  alpha?: boolean,
  depth?: boolean,
  stencil?: boolean,
  antialias?: boolean,
  premultipliedAlpha?: boolean,
  preserveDrawingBuffer?: boolean,
}

/**
 * Handles rendering of a scene.
 * This will render groups of shader programs.
 */
class Renderer {
  constructor(public canvas = document.createElement('canvas'), attributes?: WebGLAttributes) {
    gl = this.canvas.getContext('webgl2', attributes)
    || this.canvas.getContext('webgl-experimental2', attributes)
    || this.canvas.getContext('webgl', attributes)
    || this.canvas.getContext('webgl-experimental', attributes);

    if (!gl)
      throw new Error("Your Browser doesn't support WebGL!");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
  }

  // Renders a given collection of renderable objects.
  render(scene: Scene) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    scene.objects.map(obj => {
      obj.render();
    });
  }
}
```

## Shaders

Shaders are GPU programs (kernels) that tell the graphics pipeline how to process and display a given set of renderable data. They are written in Graphics Library Shader Language, or **GLSL** for short. Shaders feature an intrinsic math library for performing common operations like matrix multiplication, dot products, gradients, trigonometry, etc. as well as data types that lend themselves to interoperations. Since they're ultimately disconnected from your program and stand on their own, they have built in keywords to help you interface between them and for them to interface with each other across the pipeline.

> Since shaders are strings that will become compiled programs, in order to do things like have a variable number of lights (forward rendering), they will need to be recompiled if important aspects of the scene change (such as there being more lights then a default constant number you describe).

#### Keywords

- `attribute` - Inputs that are a part of the graphics pipeline, passed in from a vertex buffer object.
- `varying` - Variables that will be set further down the graphics pipeline, such as sending the color attribute to the pixel shader.
- `uniform` - An input to a shader outside of the program, which should change often, such as the view matrix or a time value.

#### Return Values

- `gl_position` - return value of the position of the points.
- `gl_fragcolor` - return value of the color of the rasterized pixel.

#### Data Types

- `float` - A 32 bit floating point value.
- `vecX` - A vector of X dimensions (2, 3, 4)
- `matX` - An array of vectors of X by X dimensions,

For more details on the GLSL language, please refer to the [specification](https://www.opengl.org/registry/doc/GLSLangSpec.4.40.pdf).

```glsl
attribute vec4 aPosition;
attribute vec4 aColor;

varying vec4 vColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

void main () {
  gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * aPosition;
  vColor = aColor;
}
```

```glsl
precision mediump float;
varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
```

To use a shader, you need to first compile it:

```js
/**
 * A grouping of a vertex and fragment shader, and uniforms passed to a shader.
 * Unity perfers to decouple the Shader from a material vs our strong couple.
 */
class Material {
  public vertShader: WebGLShader;
  public fragShader: WebGLShader;
  public program: WebGLProgram;
  constructor(public vertSource: string, public fragSource: string, public uniforms?: UniformMap) {
    // Compiles the shader for this material, throws error if failure.
    this.vertShader = this.compilePart(gl.VERTEX_SHADER, this.vertSource);
    this.fragShader = this.compilePart(gl.FRAGMENT_SHADER, this.fragSource);
    this.link();
    this.initUniforms();
  }

  // Binds all uniforms of this material.
  bindUniforms() {
    for (var key in this.uniforms) {
      this.uniformMap(this.uniforms[key].location, this.uniforms[key].type, this.uniforms[key].value);
    }
  }
  private initUniforms() {
    for (var key in this.uniforms) {
      var loc = gl.getUniformLocation(this.program, key);
      this.uniforms[key].location = loc;
    }
  }
  private compilePart(shaderType: number, source: string): WebGLShader {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("An error occurred compiling the shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  private link() {
    var program = gl.createProgram();
    gl.attachShader(program, this.vertShader);
    gl.attachShader(program, this.fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }
    this.program = program;
  }

  // Maps a uniform to a WebGL Function
  private uniformMap(location, type, value) {
    var map = {
      float: (loc, val) => gl.uniform1f(loc, val),
      vec2: (loc, val) => gl.uniform2fv(location, val),
      vec3: (loc, val) => gl.uniform3fv(location, val),
      vec4: (loc, val) => gl.uniform4fv(location, val),
      mat2: (loc, val) => gl.uniformMatrix2fv(loc, false, val),
      mat3: (loc, val) => gl.uniformMatrix3fv(loc, false, val),
      mat4: (loc, val) => gl.uniformMatrix4fv(loc,false,  val)
    };
    map[type](location, value);
  }
}
```

### Vertex Buffer Objects

**Vertex Buffer Objects** (or VBOs for short), are a data structure that describes vertex data. You could lay out the data for a 3D model any way you want in binary.

```js
/**
 * A Mesh is an interleved array of data and indices.
 */
class Mesh {
  public dataBuffer: WebGLBuffer;
  public indexBuffer: WebGLBuffer;
  constructor(public data: Float32Array, public indices: Uint16Array, public attributes: AttributeMap) {
    // Create Buffers
    this.dataBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    // Bind Data/Indices to Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
  }

  initAttributes(program) {
    for (var key in this.attributes) {
      this.attributes[key].index = gl.getAttribLocation(program, key);
    }
  }
  bindAttributes() {
    for (var key in this.attributes) {
      gl.vertexAttribPointer(this.attributes[key].index, this.attributes[key].size, this.attributes[key].type, false, this.attributes[key].stride, this.attributes[key].offset);
      gl.enableVertexAttribArray(this.attributes[key].index);
    }
  }
}
```

### Draw Calls

WebGL provides a number of API calls to draw things, like triangles, lines and points.

```js
/**
 * A Mesh Renderer handles the loose coupling of Material and Mesh.
 */
class MeshRenderer {
  constructor(private material: Material, private mesh: Mesh) {
    this.mesh.initAttributes(material.program);
  }
  render() {
    gl.useProgram(this.material.program);
    this.material.bindUniforms();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.dataBuffer);
    this.mesh.bindAttributes();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
```

## Abstraction

```js
class Triangle {

  private mesh: Mesh;
  private material: Material;
  private meshRenderer: MeshRenderer;

  constructor() {
    var data = new Float32Array([
      0.0, 0.5, 0.0, 1.0, 0.0, 0.0,
      -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
      0.5, -0.5, 0.0, 0.0, 0.0, 1.0
    ]);

    var indices = new Uint16Array([0, 1, 2]);

    var attributes: AttributeMap = {
      aPosition: { size: 3, type: gl.FLOAT, stride: 6 * FLOAT_SIZE, offset: 0 },
      aColor: { size: 3, type: gl.FLOAT, stride: 6 * FLOAT_SIZE, offset: FLOAT_SIZE * 3 }
    };

    this.mesh = new Mesh(data, indices, attributes);

    var eye = vec3.fromValues(0, 0, 3);
    var lookAt = vec3.fromValues(0, 0, 0);
    var up = vec3.fromValues(0, 1, 0);
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eye, lookAt, up);

    var projMatrix = mat4.create();
    mat4.perspective(projMatrix, 30 * Math.PI / 180, 1.6, 1, 10);

    var uniforms = {
      uViewMatrix: { type: "mat4", value: viewMatrix },
      uProjMatrix: { type: "mat4", value: projMatrix },
      uModelMatrix: { type: "mat4", value: mat4.create() }
    };
    this.material = new Material(
`
  attribute vec4 aPosition;
  attribute vec4 aColor;
  varying vec4 vColor;

  uniform mat4 uModelMatrix;
  uniform mat4 uViewMatrix;
  uniform mat4 uProjMatrix;

void main () {
    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * aPosition;
    vColor = aColor;
}`,
`
precision mediump float;
varying vec4 vColor;
void main() {
  gl_FragColor = vColor;
}`,
      uniforms);
    this.meshRenderer = new MeshRenderer(this.material, this.mesh);
  }
  render() {
    mat4.rotateY(this.material.uniforms.uModelMatrix.value, this.material.uniforms.uModelMatrix.value, .01);
    this.meshRenderer.render();
  }
}
```
