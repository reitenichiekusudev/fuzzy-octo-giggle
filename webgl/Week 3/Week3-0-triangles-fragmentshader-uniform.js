"use strict";
var gl;
var points;
var uColor;
// Three Vertices

var vertices = [
        vec2(-0.5, -0.5),
        vec2(-0.5, 0.5),
        vec2(0.5, 0.5),
        vec2(0.5, -0.5),
        vec2(0.5, -0.5),
        vec2(0.5,0.5)
];

var colors = [
        vec4(1.0, 0.0, 0.0, 1),
        vec4(0, 1 , 0, 1)
];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    //
    //When you first create a WebGL context, the size of the viewport will match the size of the canvas.
    // However, if you resize the canvas, you will need to tell the WebGL context a new viewport setting.
    //In this situation, you can use gl.viewport.
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 1.0,1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");

    //The WebGLRenderingContext.vertexAttribPointer() method of the WebGL API specifies the memory layout of the buffer holding the vertex attributes.
    //void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    //index: A GLuint specifying the index of the vertex attribute that is to be modified.
    //size: A GLint specifying the number of components per vertex attribute. Must be 1, 2, 3, or 4.
    //type: A GLenum specifying the data type of each component in the array.
    //normalized
    //  A GLboolean specifying whether integer data values should be normalized when being casted to a float.
    //  If true, signed integers are normalized to [-1, 1].
    //  If true, unsigned integers are normalized to [0, 1].
    //stride: A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes. Cannot be larger than 255
    //offset: A GLintptr specifying an offset in bytes of the first component in the vertex attribute array.
    //Must be a multiple of type.


    //The WebGLRenderingContext.enableVertexAttribArray() method of the WebGL API turns the generic vertex attribute array on at a given index position.
    gl.enableVertexAttribArray(vPosition);

    uColor = gl.getUniformLocation(program, "uColor");

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform4fv(uColor, [1.0, 0.0, 1.0, 1.0]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.uniform4fv(uColor, [1.0, 0.0, 0.0, 1.0]);
    gl.drawArrays(gl.LINE_LOOP, 0, 3);
    gl.uniform4fv(uColor, [0.0, 0.0, 1.0, 1.0]);
    gl.drawArrays(gl.LINE_LOOP, 1, 3);
}
