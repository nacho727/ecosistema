import * as THREE from 'three';
import { organisms } from './OrganismData.js';
import { loadOrganism } from './OrganismFactory.js';

export async function createFoodChain(scene){
    const chainGroup = new THREE.Group();
    chainGroup.name = 'foodChain';
    scene.add(chainGroup);

    const radius = 14;
    const angleStep = (Math.PI * 2) / organisms.length;
    const loadedObjects = [];

    for(let i = 0; i < organisms.length; i++){
        const item = organisms[i];
        const angle = i * angleStep - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const mesh = await loadOrganism(item);
        mesh.position.set(x, 0.15, z);
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { ...item };

        chainGroup.add(mesh);
        loadedObjects.push(mesh);
    }

    return loadedObjects;
}

export function updateOrganisms(objects, time){
    objects.forEach((mesh, index)=>{
        mesh.position.y = 0.5 + Math.sin(time * 1.4 + index) * 0.18;
        mesh.rotation.y += 0.0012;
    });
}
