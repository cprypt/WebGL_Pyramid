"use strict";

var canvas;
var gl;

var points = [];
var colors = [];
var NumVertices = 18;

var speed = 5;
var direction = true;
var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var theta = [0, 0, 0];
var thetaLoc;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    colorPyramid();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    // Event listeners for buttons
    document.getElementById("slider").onchange = function (event) {
        speed = 10 - event.target.value;
    };

    document.getElementById("change").onclick = function () {
        direction = !direction;
    };

    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };

    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };

    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };

    // Event listeners for keyboard
    window.onkeydown = function (event) {
        var key = String.fromCharCode(event.keyCode);
        switch (key) {
            case '1':
                speed *= 2.0;
                break;

            case '2':
                speed /= 2.0;
                break;

            case '3':
                direction = !direction;
                break;

            case '4':
                axis = xAxis;
                break;

            case '5':
                axis = yAxis;
                break;

            case '6':
                axis = zAxis;
                break;
        }
    };

    render();
}

function colorPyramid() {
    rectangle(1, 2, 4, 3, 0);
    rectangle(0, 1, 2, -1, 1);
    rectangle(0, 2, 4, -1, 2);
    rectangle(0, 4, 3, -1, 4);
    rectangle(0, 3, 1, -1, 5);
}

function rectangle(x1, x2, x3, x4, color) {
    // Pyramid vertices
    var vertices = [
        vec4(0, 0.5, 0, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0)
    ];

    var vertexColors = [
        [1.0, 0.0, 0.0, 1.0],  // red
        [0.0, 1.0, 0.0, 1.0],  // green
        [0.0, 0.0, 1.0, 1.0],  // blue
        [1.0, 1.0, 1.0, 1.0]   // white
        [0.0, 1.0, 1.0, 1.0],  // cyan
        [1.0, 0.0, 1.0, 1.0],  // magenta
        [1.0, 1.0, 0.0, 1.0],  // yellow
        [0.0, 0.0, 0.0, 1.0],  // black
    ];

    // 네 번째 정점을 사용하면 사각형, 사용하지 않으면 삼각형 정점 추가
    var indices = []
    if (x4 >= 0) { indices = [x1, x2, x3, x1, x3, x4]; }
    else { indices = [x1, x2, x3]; }

    for (var i = 0; i < indices.length; i++) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[color]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += (direction ? speed : -speed);
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    requestAnimFrame(render);
}
