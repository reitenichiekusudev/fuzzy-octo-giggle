"use strict";
var program;
var canvas;
var gl;
var vBuffer
var points;

var xnegative = vec4(-1, 0, 0, 1);
var xpositive = vec4(1, 0, 0, 1);
var ynegative = vec4(0, -1, 0, 1);
var ypositive = vec4(0, 1, 0, 1);
var znegative = vec4(0, 0, -1, 1);
var zpositive = vec4(0, 0, 1, 1);

var v1 = vec4(-0.25, -0.25, 0.0, 1.0);
var v2 = vec4(0.0, 0.25, 0.0, 1.0);
var v3 = vec4(0.25, -0.25, 0.0, 1.0);
var v4 = vec4(0.0, 0.0, 0.0, 1.0);


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

    vertices = [xnegative, xpositive, ynegative, ypositive, znegative, zpositive, v1, v2, v3, v4];

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
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

    gl.vertexAttrib4f(vColor, 1.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 6, 3);

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
    context2D.fillText = ("");

}


