
var gl;
var canvas;
var shaderProgram;
var floorVertexPositionBuffer;
var floorVertexIndexBuffer;
var cubeVertexPositionBuffer;
var cubeVertexIndexBuffer;

var modelViewMatrix;
var projectionMatrix;
var modelViewMatrixStack;

window.onload = function init() {
    gl = WebGLUtils.setupWebGL(canvas);
    gl = WebGLDebugUtils.makeDebugContext(gl);
    if (!gl) { alert("WebGL isn't available"); }
    setupShaders();
    setupBuffers();
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
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

    modelViewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    modelViewMatrixStack = [];
}

function pushModelViewMatrix() {
    var copyToPush = mat4.create(modelViewMatrix);
    modelViewMatrixStack.push(copyToPush);
}

function popModelViewMatrix() {
    if (modelViewMatrixStack.length == 0) {
        throw "Error popModelViewMatrix() - Stack was empty ";
    }
    modelViewMatrix = modelViewMatrixStack.pop();
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

function uploadModelViewMatrixToShader() {
    gl.uniformMatrix4fv(shaderProgram.uniformMVMatrix, false, modelViewMatrix);
}

function uploadProjectionMatrixToShader() {
    gl.uniformMatrix4fv(shaderProgram.uniformProjMatrix,
        false, projectionMatrix);
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
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight,
        0.1, 100.0, projectionMatrix);
    mat4.identity(modelViewMatrix);

    //the view transform: the viewer is located at the position (8,5,10)
    //the view direction is towards the origin (0,0,0)
    //the up direction is positive y-axis (0,1,0)
    //what happens if you change 10 to -10?
    mat4.lookAt([8, 5, 10], [0, 0, 0], [0, 1, 0], modelViewMatrix);

    uploadModelViewMatrixToShader();
    uploadProjectionMatrixToShader();

    // Draw floor in red color
    drawFloor(1.0, 0.0, 0.0, 1.0);


}
