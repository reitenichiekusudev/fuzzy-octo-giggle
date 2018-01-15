function setupCubeBuffers() {

  cubeVertexPositionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  var cubeVertexPosition = [

	  // Front face

	  0.4, 0.4, 0.4, //v0
	  -0.4, 0.4, 0.4, //v1
	  -0.4, -0.4, 0.4, //v2
	  0.4, -0.4, 0.4, //v3


	  // Back face

	  0.4, 0.4, -0.4, //v4
	  - 0.4, 0.4, -0.4, //v5
	  -0.4, -0.4, -0.4, //v6
	  0.4, -0.4, -0.4, //v7


	  // Left face
	  -0.4, 0.4, 0.4, //v8
	  -0.4, 0.4, -0.4, //v9
	  -0.4, -0.4, -0.4, //v10
	  -0.4, -0.4, 0.4, //v11


	  // Right face
	  0.4, 0.4, 0.4, //12
	  0.4, -0.4, 0.4, //13
	  0.4, -0.4, -0.4, //14
	  0.4, 0.4, -0.4, //15


	  // Top face

	  0.4, 0.4, 0.4, //v16
	  0.4, 0.4, -0.4, //v17
	  -0.4, 0.4, -0.4, //v18
	  -0.4, 0.4, 0.4, //v19


	  // Bottom face
	  0.4, -0.4, 0.4, //v20
	  0.4, -0.4, -0.4, //v21
	  -0.4, -0.4, -0.4, //v22
	  -0.4, -0.4, 0.4, //v23

  ];



  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPosition),

                gl.STATIC_DRAW);

  cubeVertexPositionBuffer.itemSize = 3;

  cubeVertexPositionBuffer.numberOfItems = 24;



  cubeVertexIndexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

  var cubeVertexIndices = [

            0, 1, 2,      0, 2, 3,    // Front face

            4, 6, 5,      4, 7, 6,    // Back face

            8, 9, 10,     8, 10, 11,  // Left face

            12, 13, 14,   12, 14, 15, // Right face

            16, 17, 18,   16, 18, 19, // Top face

            20, 22, 21,   20, 23, 22  // Bottom face

        ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices),

                gl.STATIC_DRAW);

  cubeVertexIndexBuffer.itemSize = 1;

  cubeVertexIndexBuffer.numberOfItems = 36;

}