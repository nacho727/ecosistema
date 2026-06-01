import * as THREE from 'three';

export function createMoon(scene){

const moon =
new THREE.Mesh(

new THREE.SphereGeometry(
2.5,
32,
32
),

new THREE.MeshBasicMaterial({

color:0xddeeff

})

);

scene.add(moon);

return moon;

}

export function updateMoon(
moon,
time
){

moon.position.set(

-Math.cos(time*0.05)*40,

15-Math.sin(time*0.05)*20,

-30

);

}