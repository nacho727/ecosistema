import * as THREE from 'three';

export function createScene(){

const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x87ceeb);

scene.fog =
new THREE.Fog(0x87ceeb,40,150);

return scene;

}