"use strict";

var canvas;
var gl;
var program;
var stripElementBuffer;
var stripVertexBuffer;
var colors;
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

    //Set up vertices for a tetrahedron
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
         0.5,  0.2,  0.0 //v10
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
 stripVertexBuffer.numberOfItems = 3;

 stripElementBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, stripElementBuffer);
 var indices = [0, 1, 2];

 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
 stripElementBuffer.numberOfItems = 3;

}
function render()
{
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // draw triangle-strip
  // We disable the vertex attribute array for the vertexColorAttribute
  // and use a constant color again.
  gl.disableVertexAttribArray(vColor);
  gl.bindBuffer(gl.ARRAY_BUFFER, stripVertexBuffer);
  gl.vertexAttribPointer(vPosition,
                         stripVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, stripElementBuffer);

  gl.drawElements(gl.TRIANGLE_STRIP, stripElementBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);
  gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);

  // Draw help lines to easier see the triangles
  // that build up the triangle-strip
  gl.drawArrays(gl.LINE_LOOP, 0, 3);
}
