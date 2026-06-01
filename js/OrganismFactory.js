import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadOrganism(data){
    return new Promise((resolve)=>{
        loader.load(
            `./models/${data.model}.glb`, 
            (gltf)=>{
                const model = gltf.scene.clone();
                model.name = data.name;
                model.userData = { ...data };
                model.scale.setScalar(data.scale);
                model.traverse((node)=>{
                    if(node.isMesh){
                        node.castShadow = true;
                        node.receiveShadow = true;
                        if(node.material){
                            node.material.roughness = node.material.roughness ?? 0.8;
                            node.material.metalness = node.material.metalness ?? 0.1;
                        }
                    }
                });
                resolve(model);
            },
            undefined,
            ()=>{
                resolve(createFallbackMesh(data));
            }
        );
    });
}

function createFallbackMesh(data){
    const geometry = new THREE.CapsuleGeometry(0.7, 1.0, 5, 8);
    const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.75,
        metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = data.name;
    mesh.userData = { ...data };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.setScalar(data.scale);

    return mesh;
}
