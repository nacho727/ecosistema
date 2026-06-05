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
objects,
true
);

if(hits.length){
    let obj = hits[0].object;
    const organismData = findOrganismData(obj);
    if(organismData){
        showInfo(organismData);
    }
}
    });
}

function findOrganismData(object){
    let obj = object;
    while(obj){
        if(obj.userData && obj.userData.id){
            return {
                ...obj.userData,
                name: obj.userData.name || capitalize(obj.userData.id),
                type: obj.userData.type || "Desconocido",
                summary: obj.userData.summary || obj.userData.description || "Información del organismo.",
                description: obj.userData.description || obj.userData.summary || "Información del organismo.",
                feedsOn: obj.userData.feedsOn || "Información del organismo.",
                functionText: obj.userData.functionText || obj.userData.description || "Información del organismo.",
                ecosystemRole: obj.userData.ecosystemRole || obj.userData.description || "Información del organismo.",
                action: obj.userData.action
            };
        }
        obj = obj.parent;
    }
    return null;
}

function capitalize(text){
    if(!text) return "Organismo";
    return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}
