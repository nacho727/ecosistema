import * as THREE from 'three';

export function createSun(scene){

const sun =
new THREE.Mesh(

new THREE.SphereGeometry(
3,
32,
32
),

new THREE.MeshBasicMaterial({

color:0xffff66

})

);

scene.add(sun);

return sun;

}

export function updateSun(
sun,
time
){

sun.position.set(

Math.cos(time*0.05)*40,

15 + Math.sin(time*0.05)*20,

-30

);

}