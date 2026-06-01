import * as THREE from 'three';
import { showInfo } from '../ui/InformationPanel.js';

const raycaster =
new THREE.Raycaster();

const mouse =
new THREE.Vector2();

export function setupSelection(
camera,
scene,
objects
){

window.addEventListener(
"click",
event=>{

mouse.x =
(event.clientX/
window.innerWidth)*2-1;

mouse.y =
-(event.clientY/
window.innerHeight)*2+1;

raycaster.setFromCamera(
mouse,
camera
);

const hits =
raycaster.intersectObjects(
scene.children,
true
);

if(hits.length){

let obj =
hits[0].object;

while(
obj.parent &&
!obj.userData.name
){

obj =
obj.parent;

}

if(obj.userData.name){

showInfo(
obj.userData
);

}

}

});

}