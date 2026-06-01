import * as THREE from 'three';

export function createEnergyFlow(
scene,
nodes
){

const particles=[];

for(let i=0;i<nodes.length;i++){

const p =
new THREE.Mesh(

new THREE.SphereGeometry(
0.15,
8,
8
),

new THREE.MeshBasicMaterial({

color:0xffdd00

})

);

scene.add(p);

particles.push({

mesh:p,

from:nodes[i],

to:nodes[
(i+1)%nodes.length
],

progress:
Math.random()

});

}

return particles;

}

export function updateEnergyFlow(
particles
){

particles.forEach(p=>{

p.progress+=0.005;

if(p.progress>1)
p.progress=0;

p.mesh.position.lerpVectors(

p.from.position,
p.to.position,
p.progress

);

});

}