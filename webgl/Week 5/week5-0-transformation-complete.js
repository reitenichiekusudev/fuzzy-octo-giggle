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



    document.getElementById("Translate").onclick = function (event) {

        // T(x,y,z) = [1 0 0 x 0 1 0 y 0 0 1 z 0 0 0 1] if P = [Px Py Pz], 
        //then Q= T * P = [Px + x Py+ y Pz+ z 1] Q is a new point that is translated by the vector (x, y, z)

        var p = vec3(0.4, 0.4, 0.0);
        var T = mat4();
        T[3] = p[0];
        T[7] = p[1];
        T[11] = p[2];

        v1 = mult(T, v1);
        v2 = mult(T, v2);
        v3 = mult(T, v3);

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        // 16 bytes per vertex - off set for triangle = 6
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 6, flatten(v1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 7, flatten(v2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 8, flatten(v3));
    };

    document.getElementById("Rotate").onclick = function (event) {

        var R = mat4(); // creates an identity Matrix
        //function rotate(angle, axis)
        var R = mult(R, rotate(-45.0, vec3(1, 0, 0)));

        //First Approach
        v1 = mult(R, v1);
        v2 = mult(R, v2);
        v3 = mult(R, v3);

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        // 16 bytes per vertex - off set for triangle = 6
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 6, flatten(v1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 7, flatten(v2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 8, flatten(v3));

    };

    document.getElementById("Scaling").onclick = function (event) {

        var S = mat4(); // creates an identity Matrix

        //this shows that the triangle scaled by two in the x direction
        var x = 2;
        var y = 1;
        var z = 1;

        S[0] = x;
        S[5] = y;
        S[10] = z;
        S[15] = 1.0;

        //First Approach
        v1 = mult(S, v1);
        v2 = mult(S, v2);
        v3 = mult(S, v3);

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        // 16 bytes per vertex - off set for triangle = 6
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 6, flatten(v1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 7, flatten(v2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 8, flatten(v3));

    };


    document.getElementById("Shearing").onclick = function (event) {

        var H = mat4(); // creates an identity Matrix

        //the shearting matrix change the cooridnate when the y-coordinate is changed.
        var Sxy = 0.5;
        var Sxz = 0.5;
        var Syz = 0.5;
        var Syx = 0.5;
        var Syz = 0.5;
        var Szx = 0.5;
        var Szy = 0.5;

        H[1] = Sxy;
        //try different kind of shearing. There are totally 6 different types of shearing
        //H[2] = Sxz;
        //H[4] = Syx;
        //H[6] = Syz;
        //H[8] = Szx;
        //H[9] = Szy;
        H[15] = 1.0;

        //First Approach
        v1 = mult(H, v1);
        v2 = mult(H, v2);
        v3 = mult(H, v3);

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        // 16 bytes per vertex - off set for triangle = 6
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 6, flatten(v1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 7, flatten(v2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * 8, flatten(v3));

    };

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

    window.requestAnimationFrame(render);

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
    context2D.fillText("", 30, 50);
}


