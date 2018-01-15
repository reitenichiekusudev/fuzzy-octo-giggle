"use strict";

var canvas;
var gl;
var program;
var stripElementBuffer;
var stripVertexBuffer;
var vColor;
var vPosition;
var stripVertices;


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    gl = WebGLDebugUtils.makeDebugContext(gl);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    setupVertices();

    //Initializes the buffers that we are going to use
    setupBufferShader();

    render();
};

function setupVertices()
{
  stripVertices = [
        -0.5,  0.2,  0.0, //v0
        -0.4,  0.0,  0.0, //v1
        -0.3,  0.2,  0.0, //v2
        -0.2,  0.0,  0.0, //v3
        -0.1,  0.2,  0.0, //v4
         0.0,  0.0,  0.0, //v5
         0.1,  0.2,  0.0, //v6
         0.2,  0.0,  0.0, //v7
         0.3,  0.2,  0.0, //v8
         0.4,  0.0,  0.0, //v9
         0.5,  0.2,  0.0, //v10
         // start second strip
        -0.5, -0.3,  0.0, //v11
        -0.4, -0.5,  0.0, //v12
        -0.3, -0.3,  0.0, //v13
        -0.2, -0.5,  0.0, //v14
        -0.1, -0.3,  0.0, //v15
         0.0, -0.5,  0.0, //v16
         0.1, -0.3,  0.0, //v17
         0.2, -0.5,  0.0, //v18
         0.3, -0.3,  0.0, //v19
         0.4, -0.5,  0.0, //v20
         0.5, -0.3,  0.0  //v21
  ];
}


function setupBufferShader()
{
  //  Load shaders and initialize attribute buffers
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // Create a buffer object, initialize it, and associate it with the
  //  associated attribute variable in our vertex shader
  vColor = gl.getAttribLocation( program, "vColor" );
  vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.enableVertexAttribArray(vPosition);

  stripVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, stripVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stripVertices), gl.STATIC_DRAW);
  stripVertexBuffer.itemSize = 3;
  stripVertexBuffer.numberOfItems = 22;

  stripElementBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, stripElementBuffer);
  var indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                  10, 10, 11, // 3 extra indices for the degenerate triangles
                 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  stripElementBuffer.numberOfItems = 25;

}
function render()
{
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw triangle-strip
  // We disable the vertex attribute array for the vColor
  // and use a constant color again.
  gl.disableVertexAttribArray(vColor);
  gl.bindBuffer(gl.ARRAY_BUFFER, stripVertexBuffer);
  gl.vertexAttribPointer(vPosition, stripVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, stripElementBuffer);

  gl.drawElements(gl.TRIANGLE_STRIP, stripElementBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);
  gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);

  // Draw help lines to easier see the triangles
  // that build up the triangle-strip
  gl.drawArrays(gl.LINE_STRIP, 0, 11);
  gl.drawArrays(gl.LINE_STRIP, 11, 11);

}
