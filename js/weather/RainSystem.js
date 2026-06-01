import * as THREE from 'three';

let rainEnabled=false;

export function toggleRain(){

rainEnabled =
!rainEnabled;

}

export function createRain(scene){

const drops=[];

for(let i=0;i<500;i++){

const drop =
new THREE.Mesh(

new THREE.SphereGeometry(
0.03,
6,
6
),

new THREE.MeshBasicMaterial({

color:0x66ccff

})

);

drop.visible=false;

drop.position.set(

(Math.random()-0.5)*80,

Math.random()*40,

(Math.random()-0.5)*80

);

scene.add(drop);

drops.push(drop);

}

return drops;

}

export function updateRain(drops){

drops.forEach(drop=>{

drop.visible=
rainEnabled;

if(!rainEnabled)
return;

drop.position.y-=0.35;

if(drop.position.y<0){

drop.position.y=30;

}

});

}