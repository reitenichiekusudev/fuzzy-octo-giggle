"use strict";

var gl;
var index = 0;
var nRows = 50;
var nColumns = 50;


var data = [];
for (var i = 0; i < nRows; ++i) {
    data.push([]);
    var x = i;

    for (var j = 0; j < nColumns; ++j) {

        var y = j;
        var r = Math.sqrt(x * x + y * y);

        data[i][j] = 0;
        // if (i > 10 && i < 15) data[i][j] = .5;
    }
}

var pointsArray = [];

var fColor;

var near = -10;
var far = 10;
var radius = 6.0;
var theta = 1.30;
var phi = 1.74;
var dr = 5.0 * Math.PI / 180.0;

const black = [0.0, 0.0, 0.0, 1.0];
const red = [1.0, 0.0, 0.0, 1.0];

const at = [0.0, 0.0, 0.0];
const up = [0.0, 1.0, 0.0];

var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // enable depth testing and polygon offset
    // so lines will be in front of filled triangles

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

    for (var i = 0; i < nRows - 1; ++i) {
        for (var j = 0; j < nColumns - 1; ++j) {
            pointsArray.push([2 * i / nRows - 1, data[i][j], 2 * j / nColumns - 1, 1.0]);
            index++
        }
    }

    for (var j = 0; j < nColumns - 1; j++) {
        for (var i = 0; i < nRows - 1; i++) {
            pointsArray.push([2 * i / nRows - 1, data[i][j], 2 * j / nColumns - 1, 1.0]);
            index++
        }
    }

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    var vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    fColor = gl.getUniformLocation(program, "fColor");

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");


    document.getElementById("Button1").onclick = function () { near *= 1.1; far *= 1.1; };
    document.getElementById("Button2").onclick = function () { near *= 0.9; far *= 0.9; };
    document.getElementById("Button3").onclick = function () { radius *= 2.0; };
    document.getElementById("Button4").onclick = function () { radius *= 0.5; };
    document.getElementById("Button5").onclick = function () { theta += dr; };
    document.getElementById("Button6").onclick = function () { theta -= dr; };
    document.getElementById("Button7").onclick = function () { phi += dr; };
    document.getElementById("Button8").onclick = function () { phi -= dr; };
    document.getElementById("Button9").onclick = function () { left *= 0.9; right *= 0.9; };
    document.getElementById("Button10").onclick = function () { left *= 1.1; right *= 1.1; };
    document.getElementById("Button11").onclick = function () { ytop *= 0.9; bottom *= 0.9; };
    document.getElementById("Button12").onclick = function () { ytop *= 1.1; bottom *= 1.1; };

    render();

}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var eye = [radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)];

    modelViewMatrix = mat4.create();
    projectionMatrix = mat4.create();

    mat4.lookAt(modelViewMatrix, eye, at, up);
    mat4.ortho(projectionMatrix, left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, new Float32Array(projectionMatrix));

    for (var i = 0; i < nRows; i++) {
        gl.uniform4fv(fColor, new Float32Array(black));
        gl.drawArrays(gl.LINE_STRIP, i * nColumns, nColumns);
    }

    for (var i = 0; i < nColumns; i++) {
        gl.uniform4fv(fColor, new Float32Array(black));
        gl.drawArrays(gl.LINE_STRIP, i * nRows + index / 2, nRows);
    }


    requestAnimFrame(render);
}
