"use strict";

var gl;
var canvas;
var shaderProgram;
var floorVertexPositionBuffer;
var floorVertexIndexBuffer;

var modelViewMatrix;
var projectionMatrix;

//change x=0 or y=-5
var eye = vec3(8.0, 5.0, -10.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var near = 0.1;
var far = 100.0;
var fovy = 60.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    gl = WebGLDebugUtils.makeDebugContext(gl);
    if (!gl) { alert("WebGL isn't available"); }


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    setupShaders();
    setupBuffers();

    gl.enable(gl.DEPTH_TEST);

    draw();
}


function setupShaders() {
    //
    //  Load shaders and initialize attribute buffers
    //
    shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    shaderProgram.uniformMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.uniformProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");

    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    modelViewMatrix = mat4();
    projectionMatrix = mat4();

}


function setupFloorBuffers() {
    floorVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexPositionBuffer);

    var floorVertexPosition = [
        // Plane in y=0
        5.0, 0.0, 5.0,  //v0
        5.0, 0.0, -5.0,  //v1
        -5.0, 0.0, -5.0,  //v2
        -5.0, 0.0, 5.0]; //v3

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorVertexPosition),
        gl.STATIC_DRAW);

    floorVertexPositionBuffer.itemSize = 3;
    floorVertexPositionBuffer.numberOfItems = 4;

    floorVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVertexIndexBuffer);
    var floorVertexIndices = [0, 1, 2, 3];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(floorVertexIndices),
        gl.STATIC_DRAW);
    floorVertexIndexBuffer.itemSize = 1;
    floorVertexIndexBuffer.numberOfItems = 4;
}

function setupBuffers() {
    setupFloorBuffers();
}


function drawFloor(r, g, b, a) {
    // Disable vertex attrib array and use constant color for the floor.
    gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    // Set color
    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, r, g, b, a);

    // Draw the floor
    gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        floorVertexPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLE_FAN, floorVertexIndexBuffer.numberOfItems,
        gl.UNSIGNED_SHORT, 0);
}



function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    aspect = canvas.width / canvas.height;

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(shaderProgram.uniformMVMatrix, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(shaderProgram.uniformProjMatrix, false, flatten(projectionMatrix));

    // Draw floor in red color
    drawFloor(1.0, 0.0, 0.0, 1.0);

}
