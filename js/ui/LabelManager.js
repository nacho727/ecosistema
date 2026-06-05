console.log('LabelManager.js loaded');

import { createLabel }
from './Labels.js';

export function createLabels(organisms){

const labels = [];

organisms.forEach(org=>{

const label =
createLabel(
org.userData.name
);

labels.push({

element:label,
object:org

});

});

return labels;

}

export function updateLabels(

labels,
camera

){

labels.forEach(label=>{

const position =
label.object.position.clone();

position.y += 2.5;

position.project(camera);

const x =
(position.x*0.5+0.5)
*window.innerWidth;

const y =
(-position.y*0.5+0.5)
*window.innerHeight;

label.element.style.left =
`${x}px`;

label.element.style.top =
`${y}px`;

});

}

export function setHoverLabel(labels, hoveredObject){

	if(!labels || !Array.isArray(labels)) return;

	labels.forEach(item=>{
		if(!item || !item.element) return;

		if(hoveredObject && item.object === hoveredObject){
			item.element.classList.add('hovered');
			item.element.style.transform = 'translate(-50%,-50%) scale(1.15)';
			item.element.style.zIndex = '1002';
		} else {
			item.element.classList.remove('hovered');
			item.element.style.transform = 'translate(-50%,-50%) scale(1)';
			item.element.style.zIndex = '1000';
		}
	});

}

// Nota: las funciones ya se exportan donde se declaran; no re-exportar para evitar duplicados.
