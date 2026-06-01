import * as THREE from 'three';

export function createAmbientParticles(scene){

const particles = [];

for(let i=0;i<100;i++){

const p =
new THREE.Mesh(

new THREE.SphereGeometry(
0.05,
6,
6
),

new THREE.MeshBasicMaterial({

color:0xffffaa

})

);

p.position.set(

(Math.random()-0.5)*60,

Math.random()*20,

(Math.random()-0.5)*60

);

scene.add(p);

particles.push(p);

}

return particles;

}

export function updateAmbientParticles(
particles
){

particles.forEach(p=>{

p.position.y += 0.01;

if(p.position.y > 20){

p.position.y = 0;

}

});

}