"use strict";

var canvas;
var gl;
var vertices = [];

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

        vertices = [
        vec3( -0.3,  0.6,  0.0), //v0
        vec3( -0.4,  0.8,  0.0), //v1
        vec3( -0.6,  0.8,  0.0), //v2
        vec3( -0.7,  0.6,  0.0), //v3
        vec3( -0.6,  0.4,  0.0), //v4
        vec3( -0.4,  0.4,  0.0), //v5
        vec3( -0.3,  0.6,  0.0), //v6
   ];
}


function setupBufferShader()
{
    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


	var vColor = gl.getAttribLocation( program, "vColor" );
  // Draw the hexagon
  // We disable the vertex attrib array since we want to use a
  // constant color for all vertices in the hexagon
  gl.disableVertexAttribArray(vColor);
  gl.vertexAttrib4f(vColor, 0.0, 0.0, 1.0, 1.0);
}
function render()
{
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.LINE_STRIP, 0, 7);
}
