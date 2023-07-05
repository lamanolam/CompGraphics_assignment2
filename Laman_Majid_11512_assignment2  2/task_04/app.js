let gl, program;
let vertexCount = 36;
let modelViewMatrix;
let projectionMatrix;
let proj_mode = 'perspective';

let vBuffer;
let vBuffer2;
let vPosition;

let eye_distance = 7.3;
let eye = [0, 0, -eye_distance];
let at = [0, 0, 0];
let up = [0, 1, 0];

let theta = 0.0;

onload = () => {
    let canvas = document.getElementById("webgl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert('No webgl for you');
        return;
    }

    program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 0.5);

    let vertices = [-1, -1, 1, -1, 1, 1,
        1, 1, 1,
        1, -1, 1, -1, -1, -1, -1, 1, -1,
        1, 1, -1,
        1, -1, -1,
    ];

    let vertices2 = [
        3, -1, -1,
        3, 1, -1,
        5, 1, -1,
        5, -1, -1,
        3, -1, -3,
        3, 1, -3,
        5, 1, -3,
        5, -1, -3,
    ];

    let indices = [
        0, 3, 1,
        1, 3, 2,
        4, 7, 5,
        5, 7, 6,
        3, 7, 2,
        2, 7, 6,
        4, 0, 5,
        5, 0, 1,
        1, 2, 5,
        5, 2, 6,
        0, 3, 4,
        4, 3, 7,
    ];

    let colors = [
        0, 0, 0,
        0, 0, 1,
        0, 1, 0,
        0, 1, 1,
        1, 0, 0,
        1, 0, 1,
        1, 1, 0,
        1, 1, 1,
    ];

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    let iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    let cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');
    projectionMatrix = gl.getUniformLocation(program, 'projectionMatrix');

    program_loop();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (proj_mode == 'ortho') {
        proj_matrix = ortho(-eye_distance, eye_distance, -eye_distance, eye_distance, 0.001, 100.0)
    } else if (proj_mode == 'perspective') {
        proj_matrix = perspective(60.0, 1.0, 0.001, 100.0)
    }
    mvm = lookAt(eye, at, up);

    gl.uniformMatrix4fv(modelViewMatrix, false,
        flatten(mvm));

    gl.uniformMatrix4fv(projectionMatrix, false,
        flatten(proj_matrix));

    //draw first cube
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    //draw second cube
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);
}



// event processing:

let T_code = 84;
let L_code = 76;
let F_code = 70;
let D_code = 68;
let A_code = 65;
let I_code = 73;
let W_code = 87;
let S_code = 83;
let O_code = 79;
let P_code = 80;

let camera_sensitivity = 0.08;

let camera_mode = "front";

var keyState = {};

function onKeyDown(event) {
    var keyCode = event.keyCode || event.which;

    keyState[keyCode] = true;
}

function onKeyUp(event) {
    var keyCode = event.keyCode || event.which;

    keyState[keyCode] = false;
}

function change_rotation() {
    up[0] = Math.cos(theta + Math.PI / 2)
    up[1] = Math.sin(theta + Math.PI / 2)
}

function change_camera_properties() {
    if (camera_mode == "front") {
        eye = [0, 0, -eye_distance];
        at = [0.0, 0.0, 0.0];
    } else if (camera_mode == "top") {
        eye = [0.0, eye_distance, 0.01];
        at = [0.0, 0.0, 0.0];
    } else if (camera_mode == "left") {
        eye = [eye_distance, 0.0, 0.01];
        at = [0.0, 0.0, 0.0];
    } else if (camera_mode == "right") {
        eye = [0.0, 0.0, -eye_distance];
        at = [0.0, 0.0, 0.0];
    } else if (camera_mode == "iso") {
        eye = [eye_distance, eye_distance, eye_distance];
        at = [0.0, 0.0, 0.0];
    }
}

function program_loop() {
    if (keyState[T_code]) {
        camera_mode = "top";
        change_camera_properties();
    }
    if (keyState[L_code]) {
        camera_mode = "left";
        change_camera_properties();
    }
    if (keyState[F_code]) {
        camera_mode = "right";
        change_camera_properties();
    }
    if (keyState[D_code]) {
        theta += camera_sensitivity;
        change_rotation();
    }
    if (keyState[A_code]) {
        theta -= camera_sensitivity;
        change_rotation();
    }
    if (keyState[W_code]) {
        eye_distance -= camera_sensitivity / 2;
        change_camera_properties();
    }
    if (keyState[S_code]) {
        eye_distance += camera_sensitivity / 2;
        change_camera_properties();
    }
    if (keyState[I_code]) {
        camera_mode = "iso";
        change_camera_properties();
    }
    if (keyState[O_code]) {
        camera_mode = "iso";
        proj_mode = 'ortho';
        change_camera_properties();
    }
    if (keyState[P_code]) {
        camera_mode = "front";
        proj_mode = 'perspective';
        change_camera_properties();
    }

    render();

    requestAnimationFrame(program_loop);
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);