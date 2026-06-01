import * as THREE from 'three';

export function createLabels(objects){
    return objects.map((object)=>{
        const label = document.createElement('div');
        label.className = 'organism-label';
        label.innerHTML = `
            <strong>${object.userData.name}</strong>
            <span>${object.userData.type}</span>
        `;

        document.body.appendChild(label);

        return {
            element: label,
            object: object
        };
    });
}

export function updateLabels(labels, camera){
    labels.forEach((entry)=>{
        const worldPosition = new THREE.Vector3();
        entry.object.getWorldPosition(worldPosition);
        worldPosition.y += 1.6;

        const projection = worldPosition.project(camera);
        const x = (projection.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-projection.y * 0.5 + 0.5) * window.innerHeight;

        const isBehindCamera = projection.z > 1 || projection.z < -1;
        entry.element.style.display = isBehindCamera ? 'none' : 'block';
        entry.element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });
}

export function setHoverLabel(labels, hoveredObject){
    labels.forEach((entry)=>{
        entry.element.classList.toggle('hovered', hoveredObject === entry.object);
    });
}
