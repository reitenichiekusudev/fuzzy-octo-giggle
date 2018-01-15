"use strict";
var program;
var canvas;
var gl;
var vBuffer
var points = [];

var NumPoints = 100000;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    gl = WebGLDebugUtils.makeDebugContext(gl);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //Initialize the points for 3D Sierpenski
    setupVertices();

    //  Load shaders and initialize attribute buffers
    setupBufferShader();

    render();
};


function setupVertices()
{
  // First, initialize the vertices of our 3D gasket

  var vertices = [
      vec3( -0.5, -0.5, -0.5 ),
      vec3(  0.5, -0.5, -0.5 ),
      vec3(  0.0,  0.5,  0.0 ),
      vec3(  0.0, -0.5, 0.5 ),
  ];


  points = [ vec3( 0.0, 0.0, 0.0 ) ];

  for ( var i = 0; points.length < NumPoints; ++i ) {
      var j = Math.floor(Math.random() * 4);

      points.push(mix(points[i], vertices[j], 0.5) );
  }

}

function setupBufferShader()
{
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}
