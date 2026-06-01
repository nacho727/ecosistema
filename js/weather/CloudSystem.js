import * as THREE from 'three';

export function createClouds(scene){

const clouds = [];

for(let i=0;i<15;i++){

const cloud =
new THREE.Mesh(

new THREE.SphereGeometry(
2,
16,
16
),

new THREE.MeshStandardMaterial({

color:0xffffff

})

);

cloud.position.set(

(Math.random()-0.5)*80,

15+Math.random()*10,

(Math.random()-0.5)*80

);

scene.add(cloud);

clouds.push(cloud);

}

return clouds;

}

export function updateClouds(clouds){

clouds.forEach(cloud=>{

cloud.position.x += 0.02;

if(cloud.position.x > 50){

cloud.position.x = -50;

}

});

}