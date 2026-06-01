import * as THREE from 'three';
import { loadModel } from '../loaders/ModelLoader.js';

export async function createOrganism(data){
    const model = await loadModel(data.model);
    if(!model){
        return createFallbackOrganism(data);
    }

    model.name = data.name;
    model.userData = { ...data };
    model.scale.setScalar(data.scale ?? 1.2);
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
                node.material.roughness = node.material.roughness ?? 0.8;
                node.material.metalness = node.material.metalness ?? 0.1;
            }
        }
    });

    return model;
}

function createFallbackOrganism(data){
    const group = new THREE.Group();

    switch(data.name){
        case 'Planta': {
            const tallo = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.15, 2),
                new THREE.MeshStandardMaterial({ color: 0x2e8b57 })
            );
            const hoja1 = new THREE.Mesh(
                new THREE.SphereGeometry(0.35, 12, 12),
                new THREE.MeshStandardMaterial({ color: 0x32cd32 })
            );
            hoja1.scale.set(1.4, 0.5, 0.8);
            hoja1.position.set(0.35, 0.6, 0);
            const hoja2 = hoja1.clone();
            hoja2.position.set(-0.35, 1, 0);
            group.add(tallo, hoja1, hoja2);
            break;
        }
        case 'Grillo': {
            const cuerpo = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.4, 0.6),
                new THREE.MeshStandardMaterial({ color: 0x88aa22 })
            );
            const cabeza = new THREE.Mesh(
                new THREE.SphereGeometry(0.25, 12, 12),
                new THREE.MeshStandardMaterial({ color: 0xaacc33 })
            );
            cabeza.position.x = 0.6;
            group.add(cuerpo, cabeza);
            break;
        }
        case 'Ratón': {
            const cuerpo = new THREE.Mesh(
                new THREE.SphereGeometry(0.6, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0x888888 })
            );
            const cabeza = new THREE.Mesh(
                new THREE.SphereGeometry(0.35, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0x999999 })
            );
            cabeza.position.x = 0.7;
            const oreja1 = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0xffbbbb })
            );
            oreja1.position.set(0.8, 0.3, 0.2);
            const oreja2 = oreja1.clone();
            oreja2.position.z = -0.2;
            const cola = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.03, 1.5),
                new THREE.MeshStandardMaterial({ color: 0xffaaaa })
            );
            cola.rotation.z = Math.PI / 2;
            cola.position.x = -0.9;
            group.add(cuerpo, cabeza, oreja1, oreja2, cola);
            break;
        }
        case 'Serpiente': {
            for (let i = 0; i < 6; i++) {
                const segmento = new THREE.Mesh(
                    new THREE.SphereGeometry(0.25, 12, 12),
                    new THREE.MeshStandardMaterial({ color: 0x228b22 })
                );
                segmento.position.x = i * 0.3;
                group.add(segmento);
            }
            break;
        }
        case 'Águila': {
            const cuerpo = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
            );
            const alaIzq = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 0.1, 0.6),
                new THREE.MeshStandardMaterial({ color: 0x654321 })
            );
            alaIzq.position.x = -0.8;
            const alaDer = alaIzq.clone();
            alaDer.position.x = 0.8;
            group.add(cuerpo, alaIzq, alaDer);
            break;
        }
        case 'Hongo': {
            const pie = new THREE.Mesh(
                new THREE.CylinderGeometry(0.15, 0.2, 1),
                new THREE.MeshStandardMaterial({ color: 0xffffff })
            );
            const sombrero = new THREE.Mesh(
                new THREE.SphereGeometry(0.6, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0xcc3333 })
            );
            sombrero.scale.y = 0.5;
            sombrero.position.y = 0.6;
            group.add(pie, sombrero);
            break;
        }
        default: {
            const fallback = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshStandardMaterial({ color: data.color || 0x999999 })
            );
            group.add(fallback);
            break;
        }
    }

    group.userData = { ...data };
    group.scale.setScalar(data.scale ?? 1.2);
    return group;
}
