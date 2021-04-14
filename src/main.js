'use strict';

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');


function render(){
    const vsGLSL = `

    attribute vec4 position;
    attribute vec2 screenSize;
    attribute vec4 color;

    varying vec4 v_color;

    void main() {
        gl_Position =  vec4((position.x/screenSize.x*2.0)-1.0,(-position.y/screenSize.y*2.0)+1.0,0,1.0);
        gl_PointSize = 20.0;
        v_color = color;
    }
    `;

    const fsGLSL = `
    precision highp float;

    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsGLSL);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertexShader))
    };

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsGLSL);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragmentShader))
    };

    const prg = gl.createProgram();
    gl.attachShader(prg, vertexShader);
    gl.attachShader(prg, fragmentShader);
    gl.linkProgram(prg);
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prg))
    };


    //my code ---------------------------


    const screenSizeLoc = gl.getAttribLocation(prg, 'screenSize');

    // in clip space


    const screenSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, screenSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, screenSizeData, gl.STATIC_DRAW);


    gl.enableVertexAttribArray(screenSizeLoc);
    gl.vertexAttribPointer(
        screenSizeLoc,  
        2,            // 2 values per vertex shader iteration
        gl.FLOAT,     // data is 32bit floats
        false,        // don't normalize
        0,            // stride (0 = auto)
        0,            // offset into buffer
    );


    // ----------------------------------

    const positionLoc = gl.getAttribLocation(prg, 'position');



    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);


    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(
        positionLoc,  
        2,            // 2 values per vertex shader iteration
        gl.FLOAT,     // data is 32bit floats
        false,        // don't normalize
        0,            // stride (0 = auto)
        0,            // offset into buffer
    );


    const colorLoc = gl.getAttribLocation(prg, 'color');



    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(
        colorLoc,  
        4,                // 4 values per vertex shader iteration
        gl.UNSIGNED_BYTE, // data is 8bit unsigned bytes
        true,             // do normalize
        0,                // stride (0 = auto)
        0,                // offset into buffer
    );


    gl.useProgram(prg);

    // draw 1 point
    gl.drawArrays(gl.POINTS, 0, vertexPositions.length/2);

}

let vertexPositions = new Float32Array([]);

let vertexColors = new Uint8Array([]);

let screenSizeData = new Float32Array([]);

function main(){
    
    var points = [];

    for (let i = 0; i < 1000; i++) {
        points.push({
            x:Math.floor(Math.random()*canvas.width),
            y:Math.floor(Math.random()*canvas.height),
    
            r:Math.floor(Math.random()*255),
            g:Math.floor(Math.random()*255),
            b:Math.floor(Math.random()*255),
            a:255
        });
    }

    
    
    var newVertextPosArray = new Float32Array(points.length*2);
    var newVertextColorArray = new Uint8Array(points.length*4);
    var newVertextScreenSizeArray = new Float32Array(points.length*2);

    for (let i = 0; i < points.length; i++) {
        newVertextPosArray[(i*2)] = (points[i].x);
        newVertextPosArray[(i*2)+1] = (points[i].y);

        newVertextColorArray[(i*4)] = (points[i].r);
        newVertextColorArray[(i*4)+1] = (points[i].g);
        newVertextColorArray[(i*4)+2] = (points[i].b);
        newVertextColorArray[(i*4)+3] = (points[i].a);

        newVertextScreenSizeArray[(i*2)] = canvas.width;
        newVertextScreenSizeArray[(i*2)+1] = canvas.height;

    }

    vertexPositions = newVertextPosArray;
    vertexColors = newVertextColorArray;
    screenSizeData = newVertextScreenSizeArray;

    /*
    vertexPositions = new Float32Array([
        100.0,  100.0,
        200,  200,
        0,  0,
    ]);

    vertexColors = new Uint8Array([
        255, 0, 0, 255,
        0, 255, 0, 255,
        0, 0, 255, 255,
    ]);

    screenSizeData = new Float32Array([
        canvas.width,   canvas.height,
        canvas.width,   canvas.height,
        canvas.width,   canvas.height

    ]);
    */

        render();
}

main();