var vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'void main()',
'{',
'gl_position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'void main()',
'{',
'gl_position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');


var InitDemo = function () {
	console.log('my name is jeff');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if(!gl){
		console.log('webGL not supported, falling back on experimental');
		gl = canvas.getContext('experimental-webgl');

	}
	if (!gl){
		alert('your browser does not support webgl');

	}
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0,0, window.innerWidth,window.innerhHeight);
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
};