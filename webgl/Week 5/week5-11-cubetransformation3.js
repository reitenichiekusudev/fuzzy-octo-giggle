"use strict";

var gl;

var canvas;

var shaderProgram;

var floorVertexPositionBuffer;

var floorVertexIndexBuffer;

var cubeVertexPositionBuffer;

var cubeVertexColorBuffer;

var cubeVertexIndexBuffer;



var modelViewMatrix;

var projectionMatrix;

var modelViewMatrixStack;



var axis = 0;

var xAxis = 0;

var yAxis =1;

var zAxis = 2;

var theta = [ 0, 0, 0 ];

var thetaLoc;



var cubeVertexPosition = [

-0.5, -0.5,  0.5,

-0.5,  0.5,  0.5,

0.5,  0.5,  0.5,

0.5, -0.5,  0.5,

-0.5, -0.5, -0.5,

-0.5,  0.5, -0.5,

0.5,  0.5, -0.5,

0.5, -0.5, -0.5

];



var cubeVertexColors = [

    0.0, 0.0, 0.0, 1.0 ,  // black

   1.0, 0.0, 0.0, 1.0 ,  // red

   1.0, 1.0, 0.0, 1.0 ,  // yellow

   0.0, 1.0, 0.0, 1.0 ,  // green

  0.0, 0.0, 1.0, 1.0 ,  // blue

     1.0, 0.0, 1.0, 1.0 ,  // magenta

    1.0, 1.0, 1.0, 1.0 ,  // white

    0.0, 1.0, 1.0, 1.0    // cyan

];



// indices of the 12 triangles that compise the cube



var cubeVertexIndices = [

    1, 0, 3,

    3, 2, 1,

    2, 3, 7,

    7, 6, 2,

    3, 0, 4,

    4, 7, 3,

    6, 5, 1,

    1, 2, 6,

    4, 5, 6,

    6, 7, 4,

    5, 4, 0,

    0, 1, 5

];



window.onload = function init()

{

  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLDebugUtils.makeDebugContext(createGLContext(canvas));

  setupShaders();

  setupBuffers();

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);



  //event listeners for buttons



  document.getElementById( "xButton" ).onclick = function () {

      axis = xAxis;

  };

  document.getElementById( "yButton" ).onclick = function () {

      axis = yAxis;

  };

  document.getElementById( "zButton" ).onclick = function () {

      axis = zAxis;

  };



  draw();

}



function createGLContext(canvas) {

  var names = ["webgl", "experimental-webgl"];

  var context = null;

  for (var i=0; i < names.length; i++) {

    try {

      context = canvas.getContext(names[i]);

    } catch(e) {}

    if (context) {

      break;

    }

  }

  if (context) {

    context.viewportWidth = canvas.width;

    context.viewportHeight = canvas.height;

  } else {

    alert("Failed to create WebGL context!");

  }

  return context;

}





function setupShaders() {

  //

  //  Load shaders and initialize attribute buffers

  //

  shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );

  gl.useProgram( shaderProgram );



  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");

  shaderProgram.uniformMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");

  shaderProgram.uniformProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");

  gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );



  modelViewMatrix = mat4.create();

  projectionMatrix = mat4.create();

  modelViewMatrixStack = [];

}





function setupCubeBuffers() {





  cubeVertexIndexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(cubeVertexIndices), gl.STATIC_DRAW);

  cubeVertexIndexBuffer.itemSize = 1;

  cubeVertexIndexBuffer.numberOfItems = 36;





  cubeVertexColorBuffer = gl.createBuffer();

  gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexColorBuffer );

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexColors), gl.STATIC_DRAW);

  cubeVertexColorBuffer.itemSize = 4;

  cubeVertexColorBuffer.numberOfItems = 8;

  gl.vertexAttribPointer( shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0 );

  gl.enableVertexAttribArray( shaderProgram.vertexColorAttribute );





  cubeVertexPositionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPosition),

                gl.STATIC_DRAW);

cubeVertexPositionBuffer.itemSize = 3;

cubeVertexPositionBuffer.numberOfItems = 8;

gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,

                         cubeVertexPositionBuffer.itemSize,

                         gl.FLOAT, false, 0, 0);



  gl.enableVertexAttribArray( cubeVertexPosition );



  thetaLoc = gl.getUniformLocation(shaderProgram, "theta");

}





function setupBuffers() {

  setupCubeBuffers();

}



function uploadModelViewMatrixToShader() {

  //upload your transformation matrices to the GPU before they can be used to do any transformations in the vertex shader

  //the second argument specifies whether you want to transpose the columns that are uploaded

  gl.uniformMatrix4fv(shaderProgram.uniformMVMatrix, false, modelViewMatrix);

}



function uploadProjectionMatrixToShader() {

  gl.uniformMatrix4fv(shaderProgram.uniformProjMatrix,false, projectionMatrix);

}





function drawCube() {

  // Draw the independent triangle

  // For the triangle we want to use per-vertex color so

  // we enable the vertexColorAttribute again



  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numberOfItems,

                  gl.UNSIGNED_BYTE, 0);

}





function draw() {

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //ma4.perpective(fovy,aspect ratio, near, far, projectionMatrix);

  //field of view of 70 degrees, a near plane 0.1 units in front of the viewer and a far plane of 100 units from the viewer

  mat4.perspective(70, gl.viewportWidth / gl.viewportHeight,

                   0.1, 100.0, projectionMatrix);

  mat4.identity(modelViewMatrix); //load the identity matrix to modelViewMatrix



  //the view transform: the viewer is located at the position (8,5,10)

  //the view direction is towards the origin (0,0,0)

  //the up direction is positive y-axis (0,1,0)

  //what happens if you change -8 to 8?

  mat4.lookAt([-8, 5, -10],[0, 0, 0], [0, 1,0], modelViewMatrix);





  // Draw box

  mat4.translate(modelViewMatrix, [0.0, 2.7 ,0.0], modelViewMatrix);

  mat4.scale(modelViewMatrix, [2.5, 2.5, 2.5], modelViewMatrix);



  uploadModelViewMatrixToShader();

  uploadProjectionMatrixToShader();

  theta[axis] += 2.0;

  gl.uniform3fv(thetaLoc, theta);

  drawCube();



  requestAnimFrame( draw );

}
