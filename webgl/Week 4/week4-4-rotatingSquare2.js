"use strict";

var canvas;
var gl;
var theta = 0.0;
var thetaLoc;

var delay = 100;
var direction = true;

var vertices;

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
  vertices = [
      vec2( 0,  1 ),
      vec2(-1,  0 ),
      vec2( 1,  0 ),
      vec2( 0, -1 )
  ];

}


function setupBufferShader()
{
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );

    // Initialize event handlers
    document.getElementById("Direction").onclick = function () {
        direction = !direction;
    };

    document.getElementById("Controls" ).onclick = function(event) {
        switch( event.target.index ) {
          case 0:
            direction = !direction;
            break;
         case 1:
            delay /= 2.0;
            break;
         case 2:
            delay *= 2.0;
            break;
       }
    };

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key) {
          case '1':
            direction = !direction;
            break;

          case '2':
            delay /= 2.0;
            break;

          case '3':
            delay *= 2.0;
            break;
        }
    };
    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += (direction ? 0.1 : -0.1);
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    setTimeout(
        function (){requestAnimFrame(render);}
      , delay);
}