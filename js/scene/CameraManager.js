
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createCamera(){

const camera =
new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(
0,
12,
25
);

return camera;

}

export function createControls(
camera,
renderer
){

const controls =
new OrbitControls(
camera,
renderer.domElement
);

controls.enableDamping = true;

controls.enableZoom = true;

controls.enablePan = true;

return controls;

}