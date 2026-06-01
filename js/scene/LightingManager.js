import * as THREE from 'three';

export function createLights(scene){

const ambient =
new THREE.AmbientLight(
0xffffff,
1
);

scene.add(ambient);

const sun =
new THREE.DirectionalLight(
0xffffff,
2
);

sun.position.set(
20,
25,
10
);

sun.castShadow=true;

scene.add(sun);

return sun;

}