import * as THREE from 'three';

export function createEnvironment(scene){

const floor =
new THREE.Mesh(

new THREE.CircleGeometry(
40,
64
),

new THREE.MeshStandardMaterial({

color:0x3f7d3f

})

);

floor.rotation.x=
-Math.PI/2;

floor.receiveShadow=true;

scene.add(floor);



for(let i=0;i<50;i++){

const tree =
new THREE.Group();

const trunk =
new THREE.Mesh(

new THREE.CylinderGeometry(
0.2,
0.3,
2
),

new THREE.MeshStandardMaterial({
color:0x6b4423
})

);

const leaves =
new THREE.Mesh(

new THREE.SphereGeometry(
1+Math.random(),
16,
16
),

new THREE.MeshStandardMaterial({
color:0x228b22
})

);

leaves.position.y=1.8;

tree.add(trunk);
tree.add(leaves);

let x;
let z;

do{

x=(Math.random()-0.5)*70;
z=(Math.random()-0.5)*70;

}
while(

Math.sqrt(
x*x+z*z
) < 15

);

tree.position.set(
x,
1,
z
);

scene.add(tree);

}



for(let i=0;i<25;i++){

const flower =
new THREE.Mesh(

new THREE.SphereGeometry(
0.15,
8,
8
),

new THREE.MeshStandardMaterial({

color:
Math.random()>0.5
?0xff66aa
:0xffff00

})

);

let fx;
let fz;

do{

fx=(Math.random()-0.5)*60;
fz=(Math.random()-0.5)*60;

}
while(

Math.sqrt(
fx*fx+fz*fz
)<15

);

flower.position.set(
fx,
0.15,
fz
);

scene.add(flower);

}



for(let i=0;i<20;i++){

const rock =
new THREE.Mesh(

new THREE.DodecahedronGeometry(
0.4+Math.random()*0.4
),

new THREE.MeshStandardMaterial({

color:0x777777

})

);

let rx;
let rz;

do{

rx=(Math.random()-0.5)*60;
rz=(Math.random()-0.5)*60;

}
while(

Math.sqrt(
rx*rx+rz*rz
)<15

);

rock.position.set(
rx,
0.3,
rz
);

scene.add(rock);

}

}