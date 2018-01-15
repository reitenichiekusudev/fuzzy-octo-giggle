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
var xnegative = vec3(-1.0, 0.0, 0.0);
var xpositive = vec3(1.0, 0.0, 0.0);
var ynegative = vec3(0.0, -1, 0.0);
var ypositive = vec3(0.0, 1.0, 0.0);
var znegative = vec3(0.0, 0.0, -1.0);
var zpositive = vec3(0.0, 0.0, 1.0);

var vertices;
var vColor;

window.onload = function init()
{
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
    gl.enable(gl.DEPTH_TEST);


    setupBufferShader();
    render();
};

function setupBufferShader() {
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    vertices = [xnegative, xpositive, ynegative, ypositive, znegative, zpositive, o, u, o, v, o, s];

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    vColor = gl.getAttribLocation(program, "vColor");
    
}



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

    //u vector
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 1.0, 1.0);
    gl.drawArrays(gl.LINES, 6, 2);

    //v vector
    gl.vertexAttrib4f(vColor, 0.0, 1.0, 0.0, 1.0);
    gl.drawArrays(gl.LINES, 8, 2);

    // s = u + v
    gl.vertexAttrib4f(vColor, 1.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.LINES, 10, 2);
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

    s = add(u, v);
    //  The sum of any two vectors is a vector
    context2D.fillText("o=[" + o + "]", 30, 50); 
    context2D.fillText("u=[" + u + "]", 30, 100); 
    context2D.fillText("v=[" + v + "]", 30, 150); 
    context2D.fillText("s= u + v ", 30, 200); 
    context2D.fillText("s=[" + s + "]", 30, 250); 
}