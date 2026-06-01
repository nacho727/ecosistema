import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createCamera(){
    const camera = new THREE.PerspectiveCamera(
        54,
        window.innerWidth / window.innerHeight,
        0.1,
        200
    );

    camera.position.set(0, 12, 24);
    return camera;
}

export function createControls(camera, renderer){
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 10;
    controls.maxDistance = 45;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;

    return controls;
}
