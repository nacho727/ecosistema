import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
const cache = {};

function cloneLoadedModel(gltf){
    const cloned = cloneSkeleton(gltf.scene);
    cloned.userData.animationClips = gltf.animations || [];
    return cloned;
}

export async function loadModel(type){
    if(cache[type]){
        return cloneLoadedModel(cache[type]);
    }

    const url = `./models/${type}.glb`;

    try {
        const resp = await fetch(url, { method: 'GET', cache: 'no-cache' });
        if(!resp.ok){
            return null;
        }
    } catch (e){
        return null;
    }

    return new Promise((resolve)=>{
        loader.load(url, (gltf)=>{
            cache[type] = gltf;
            resolve(cloneLoadedModel(gltf));
        }, undefined, (error)=>{
            console.warn(`ModelLoader: fallo al cargar ${url}`, error);
            resolve(null);
        });
    });
}
