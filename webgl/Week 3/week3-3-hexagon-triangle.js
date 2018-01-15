"use strict";

var canvas;
var gl;
var hexagonVertices;
var hexagonVertexBuffer;
var triangleVertices;
var triangleVertexColorBuffer;
var triangleVertexBuffer;
var colors;
var vColor;
var vPosition;


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
  triangleVertices = [
       vec3( 0.3,  0.4,  0.0), //v0
       vec3( 0.7,  0.4,  0.0), //v1
       vec3( 0.5,  0.8,  0.0), //v2
 ];

  hexagonVertices = [
        vec3( -0.3,  0.6,  0.0), //v0
        vec3( -0.4,  0.8,  0.0), //v1
        vec3( -0.6,  0.8,  0.0), //v2
        vec3( -0.7,  0.6,  0.0), //v3
        vec3( -0.6,  0.4,  0.0), //v4
        vec3( -0.4,  0.4,  0.0), //v5
        vec3( -0.3,  0.6,  0.0), //v6
   ];

   colors = [
             vec4(1.0, 0.0, 0.0, 1.0), //v0
             vec4(0.0, 1.0, 0.0, 1.0), //v1
             vec4(0.0, 0.0, 1.0, 1.0)  //v2
         ];
}


function setupBufferShader()
{
  //  Load shaders and initialize attribute buffers
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // Create a buffer object, initialize it, and associate it with the
  //  associated attribute variable in our vertex shader
  vColor = gl.getAttribLocation( program, "vColor" );
  vPosition = gl.getAttribLocation( program, "vPosition" );

   //Setup buffer for hexagon
    hexagonVertexBuffer = gl.createBuffer();
  //Setup buffer for triangle
  triangleVertexBuffer = gl.createBuffer();
  triangleVertexColorBuffer = gl.createBuffer();

  triangleVertexBuffer.itemSize = 3;
  triangleVertexBuffer.numberOfItems = 3;

  triangleVertexColorBuffer.itemSize = 4;
  triangleVertexColorBuffer.numberOfItems = 3;
}
function render()
{
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //draw hexagon

  gl.bindBuffer( gl.ARRAY_BUFFER, hexagonVertexBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(hexagonVertices), gl.STATIC_DRAW );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
  // We disable the vertex attrib array since we want to use a
  // constant color for all vertices in the hexagon
  gl.disableVertexAttribArray(vColor);
  gl.vertexAttrib4f(vColor, 0.0, 0.0, 1.0, 1.0);
  gl.drawArrays(gl.LINE_STRIP, 0, 7);

  // Draw the independent triangle

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vPosition,triangleVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  // For the triangle we want to use per-vertex color so
  // we enable the vertexColorAttribute again
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vColor,triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexBuffer.numberOfItems);
}
