"use strict";
var program;
var canvas;
var gl;
var vBuffer
var points;
var o = vec3();
var u = vec3(0.1, 0.2, 0.3);
var v = vec3(0.4, 0.5, 0.6);
var s = vec3();
var xnegative = vec3(-1, 0, 0);
var xpositive = vec3(1, 0, 0);
var ynegative = vec3(0, -1, 0);
var ypositive = vec3(0, 1, 0);
var znegative = vec3(0, 0, -1);
var zpositive = vec3(0, 0, 1);

var vertices;
var vColor;

window.onload = function init() {
    drawTextCanvas();
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    gl = WebGLDebugUtils.makeDebugContext(gl);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    setupBufferShader();
    render();
};

function setupBufferShader() {
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    vertices = [xnegative, xpositive, ynegative, ypositive, znegative, zpositive];

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    vColor = gl.getAttribLocation(program, "vColor");

}



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the line
    gl.disableVertexAttribArray(vColor);

    //x axis
    gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0);
    gl.drawArrays(gl.LINES, 0, 2);
    //y axis
    gl.vertexAttrib4f(vColor, 1.0, 0.0, 1.0, 1.0);
    gl.drawArrays(gl.LINES, 2, 2);
    //z axis
    gl.vertexAttrib4f(vColor, 0.0, 1.0, 1.0, 1.0);
    gl.drawArrays(gl.LINES, 4, 2);

}


function drawTextCanvas() {
    // look up the text canvas.
    var textCanvas = document.getElementById("text");

    // make a 2D context for it
    var context2D = textCanvas.getContext("2d");
    // Clear the 2D canvas
    context2D.clearRect(0, 0, context2D.canvas.width, context2D.canvas.height);
    context2D.font = "20px serif";
    context2D.fillStyle = "rgba(255, 0, 0, 1)";

    var I = mat4(1, 0, 0, 0,   // first column
        0, 1, 0, 0,   // second column
        0, 0, 1, 0,   // third column
        0, 0, 0, 1); // fourth column

    var M = mat4(1, 0, 0, 0,   // first column
        0, 1, 0, 0,   // second column
        0, 0, 1, 0,   // third column
        2, 3, 4, 1); // fourth column


    //we can copy into an existing matrix using
    var A = mat4(M);
    var B = mat4(A);

    //we can also find the determinent, inverse, and transpose of a Matrix

    var determinant = det(A); //det=1
    var AINVERSE = inverse4(A);
    // b = [1,0,0,0
    //      0,1,0,0,
    //      0,0,1,0,
    //      -2,-3,-4,1]

    var AT = transpose(A);
    // b = [1,0,0,2
    //      0,1,0,3,
    //      0,0,1,4,
    //      0,0,1,1]
    var C = mult(A, AINVERSE);

    //we can reference or change individual elements
    //A[1][2] = 0;
    var d = vec4(A[2]);

    var IM = mult(I, M);
    var MI = mult(M, I);

    context2D.fillText("I=[" + I + "]", 30, 20);
    context2D.fillText("determinant=" + determinant, 30, 50);
    context2D.fillText("M=[" + M + "]", 30, 100);
    context2D.fillText("IM=[" + IM + "]", 30, 150);
    context2D.fillText("MI=[" + MI + "]", 30, 200);
    context2D.fillText("A=[" + A + "]", 30, 250);
    context2D.fillText("AINVERSE=[" + AINVERSE + "]", 30, 300);
    context2D.fillText("AT=[" + AT + "]", 30, 350);
    context2D.fillText("C= A*AINVERSE = I", 30, 400);
    context2D.fillText("C=[" + C + "]", 30, 450);
}




