import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const cache = {};

export async function loadModel(type){
    if(cache[type]){
        return cache[type].clone();
    }

    const url = `./models/${type}.glb`;

    // Comprobar existencia del archivo con fetch para evitar que GLTFLoader registre 404s en consola
    try {
        const resp = await fetch(url, { method: 'GET', cache: 'no-cache' });
        if(!resp.ok){
            return null; // indicar ausencia para que el caller use fallback
        }
    } catch (e){
        return null;
    }

    return new Promise((resolve, reject)=>{
        loader.load(url, (gltf)=>{
            cache[type] = gltf.scene;
            resolve(gltf.scene.clone());
        }, undefined, (error)=>{
            // En caso de error con loader, devolver null para fallback en lugar de propagar excepción
            console.warn(`ModelLoader: fallo al cargar ${url}`, error);
            resolve(null);
        });
    });
}
