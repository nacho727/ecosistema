import * as THREE from 'three';
import { loadModel } from '../loaders/ModelLoader.js';

export async function createOrganism(data){
    const model = await loadModel(data.model);
    if(!model){
        return createFallbackOrganism(data);
    }

    const animationClips = model.userData.animationClips || [];
    model.name = data.name;
    model.userData = { ...data, animationClips };
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

    if(animationClips.length > 0){
        const mixer = new THREE.AnimationMixer(model);
        const clip = animationClips.find(item => /idle|walk|fly|run/i.test(item.name)) || animationClips[0];
        mixer.clipAction(clip).play();
        model.userData.mixer = mixer;
    }

    return model;
}

function createFallbackOrganism(data){
    const group = new THREE.Group();
    group.name = data.name;

    switch(data.id){
        case 'planta':
            createFallbackPlant(group);
            break;
        case 'grillo':
            createFallbackCricket(group);
            break;
        case 'raton':
            createFallbackMouse(group);
            break;
        case 'serpiente':
            createFallbackSnake(group);
            break;
        case 'aguila':
            createFallbackEagle(group);
            break;
        case 'hongo':
            createFallbackMushroom(group);
            break;
        default:
            group.add(new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshStandardMaterial({ color: data.color || 0x999999 })
            ));
            break;
    }

    group.traverse((node) => {
        if(node.isMesh){
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    group.userData = { ...data, fallback: true };
    group.scale.setScalar(data.scale ?? 1.2);
    return group;
}

function createFallbackPlant(group){
    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 2.1, 14),
        new THREE.MeshStandardMaterial({ color: 0x2e8b57 })
    );
    stem.name = 'stem';
    stem.position.y = 0.9;

    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x32cd32, roughness: 0.75 });
    for(let i = 0; i < 6; i++){
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), leafMaterial);
        leaf.name = 'leaf';
        leaf.scale.set(1.5, 0.28, 0.7);
        leaf.position.set(i % 2 === 0 ? 0.38 : -0.38, 0.45 + i * 0.22, 0);
        leaf.rotation.z = i % 2 === 0 ? -0.55 : 0.55;
        group.add(leaf);
    }
    group.add(stem);
}

function createFallbackCricket(group){
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x7fa323 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.38, 0.55), bodyMat);
    body.name = 'body';
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 16, 12), new THREE.MeshStandardMaterial({ color: 0xa7c93a }));
    head.position.x = 0.62;
    head.name = 'head';
    group.add(body, head);

    for(let i = 0; i < 6; i++){
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8), bodyMat);
        leg.name = 'leg';
        leg.position.set(-0.35 + (i % 3) * 0.32, -0.24, i < 3 ? 0.34 : -0.34);
        leg.rotation.x = i < 3 ? 0.9 : -0.9;
        leg.rotation.z = i % 2 === 0 ? 0.55 : -0.55;
        group.add(leg);
    }
}

function createFallbackMouse(group){
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.58, 20, 16), new THREE.MeshStandardMaterial({ color: 0x858585 }));
    body.name = 'body';
    body.scale.set(1.25, 0.75, 0.82);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 14), new THREE.MeshStandardMaterial({ color: 0x999999 }));
    head.name = 'head';
    head.position.x = 0.75;

    const earMat = new THREE.MeshStandardMaterial({ color: 0xffb7bd });
    const ear1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), earMat);
    ear1.position.set(0.82, 0.28, 0.2);
    const ear2 = ear1.clone();
    ear2.position.z = -0.2;
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 8), earMat);
    tail.name = 'tail';
    tail.rotation.z = Math.PI / 2;
    tail.position.x = -0.98;
    group.add(body, head, ear1, ear2, tail);
}

function createFallbackSnake(group){
    const mat = new THREE.MeshStandardMaterial({ color: 0x1d7f42 });
    for (let i = 0; i < 9; i++) {
        const segment = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), mat);
        segment.name = 'segment';
        segment.position.set(i * 0.28, Math.sin(i * 0.85) * 0.07, Math.cos(i * 0.85) * 0.18);
        group.add(segment);
    }
}

function createFallbackEagle(group){
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 14), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
    body.name = 'body';
    body.scale.set(1, 0.75, 1.25);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.08, 0.6), wingMat);
    leftWing.name = 'leftWing';
    leftWing.position.x = -0.85;
    leftWing.rotation.z = 0.18;
    const rightWing = leftWing.clone();
    rightWing.name = 'rightWing';
    rightWing.position.x = 0.85;
    rightWing.rotation.z = -0.18;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), new THREE.MeshStandardMaterial({ color: 0xf2f2f2 }));
    head.name = 'head';
    head.position.set(0, 0.28, 0.58);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.25, 10), new THREE.MeshStandardMaterial({ color: 0xf2b632 }));
    beak.name = 'beak';
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.26, 0.82);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.55, 3), wingMat);
    tail.name = 'tail';
    tail.rotation.x = -Math.PI / 2;
    tail.position.set(0, -0.02, -0.64);
    group.add(body, leftWing, rightWing, head, beak, tail);
}

function createFallbackMushroom(group){
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1, 16), new THREE.MeshStandardMaterial({ color: 0xf7efe2 }));
    stem.name = 'stem';
    stem.position.y = 0.4;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 14), new THREE.MeshStandardMaterial({ color: 0xcc3333 }));
    cap.name = 'cap';
    cap.scale.y = 0.45;
    cap.position.y = 0.95;
    group.add(stem, cap);
}
