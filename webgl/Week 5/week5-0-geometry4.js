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

    var R = mat4(); // creates an identity Matrix

    //CTM: current transformation matrix is part of the pipeline
    //if p is a vertex specified in the application,
    //the pipeline create Cp

    var ctm = mat4();  // C <-- I

    var thetaX = Math.acos(3.0 / Math.sqrt(14.0));
    var thetaY = Math.sqrt(13.0 / 14.0);
    var d = vec3(4.0, 5.0, 6.0);

    R = mult(R, rotateX(thetaX));
    R = mult(R, rotateY(thetaY));
    R = mult(R, rotateZ(-45.0));
    R = mult(R, rotateY(-thetaY));
    R = mult(R, rotateX(-thetaX));

    var ctm1 = translate(d);         //C <-- CT (4.0,5.0,6.0)
    var ctm2 = mult(ctm1, R);              //C <-- CR (45.0,1.0,2.0,3.0)
    var ctm3 = translate(ctm2, negate(d)); //C <-- CT (-4.0,-5.0,-6.0)

    context2D.fillText("ctm=[" + ctm + "]", 30, 20);
    context2D.fillText("thetaX=Math.acos(3.0 / Math.sqrt(14.0))", 30, 50);
    context2D.fillText("thetaX=" + thetaX, 30, 80);
    context2D.fillText("thetaY=Math.sqrt(13.0 / 14.0)", 30, 110);
    context2D.fillText("thetaY=" + thetaY, 30, 140);
    context2D.fillText("d=[" + d + "]", 30, 180);
    context2D.fillText("R=[" + R + "]", 30, 220);
    context2D.fillText("ctm1=translate(ctm, d)", 30, 250);
    context2D.fillText("ctm1=[" + ctm1 + "]", 30, 300);
    context2D.fillText("ctm2=translate(ctm1, R)", 30, 350);
    context2D.fillText("ctm2=[" + ctm2 + "]", 30, 400);
    context2D.fillText("ctm3=translate(ctm2, negate(d))", 30, 420);
    context2D.fillText("ctm3=[" + ctm3 + "]", 30, 450);

}


