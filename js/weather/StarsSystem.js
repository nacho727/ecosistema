import * as THREE from 'three';

export function createStars(scene){

const geometry =
new THREE.BufferGeometry();

const vertices=[];

for(let i=0;i<1500;i++){

vertices.push(

(Math.random()-0.5)*300,

50+Math.random()*150,

(Math.random()-0.5)*300

);

}

geometry.setAttribute(

'position',

new THREE.Float32BufferAttribute(
vertices,
3
)

);

const material =
new THREE.PointsMaterial({

size:1,
color:0xffffff

});

const stars =
new THREE.Points(
geometry,
material
);

scene.add(stars);

return stars;

}

export function updateStars(
stars,
sunHeight
){

stars.material.opacity =
Math.max(
0,
1-sunHeight
);

stars.material.transparent =
true;

}