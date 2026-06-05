import * as THREE from 'three';
import { createScene } from './scene/SceneManager.js';
import { createCamera, createControls } from './scene/CameraManager.js';
import { createLights } from './scene/LightingManager.js';
import { createEnvironment } from './scene/EnvironmentManager.js';
import { createSun, updateSun } from './weather/SunSystem.js';
import { createMoon, updateMoon } from './weather/MoonSystem.js';
import { createStars, updateStars } from './weather/StarsSystem.js';
import { createRain, updateRain, toggleRain } from './weather/RainSystem.js';
import { createClouds, updateClouds } from './weather/CloudSystem.js';
import { createAmbientParticles, updateAmbientParticles } from './particles/AmbientParticles.js';
import { createFoodChain } from './ecosystem/FoodChainManager.js';
import { createLabels, updateLabels, setHoverLabel } from './ui/LabelManager.js?v=2';
import { setupSelection } from './interaction/SelectionManager.js';
import { updateSky } from './scene/SkySystem.js';
import { unlockAchievement } from './achievements/AchievementSystem.js';
import { animateOrganisms } from './ecosystem/OrganismAnimator.js';
import { createEnergyFlow, updateEnergyFlow } from './ecosystem/EnergyFlowSystem.js';
import { createEcosystemInteractions } from './ecosystem/EcosystemInteractions.js';
import { saveGame } from './game/SaveManager.js';

const scene = createScene();
const camera = createCamera();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = createControls(camera, renderer);
const sun = createLights(scene);
const sunMesh = createSun(scene);
const moonMesh = createMoon(scene);
const stars = createStars(scene);
const rain = createRain(scene);

createEnvironment(scene);
const clouds = createClouds(scene);
const ambientParticles = createAmbientParticles(scene);

let organismMeshes = [];
let labels = [];
let energyParticles = [];
let ecosystemInteractions = null;

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredObject = null;
let highlightedObject = null;

window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (organismMeshes.length === 0) return;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(organismMeshes, true);

    if (hits.length > 0) {
        let object = hits[0].object;
        while (object.parent && !object.userData.id) {
            object = object.parent;
        }

        if (object.userData && object.userData.id) {
            if (hoveredObject !== object) {
                hoveredObject = object;
                setHoverLabel(labels, hoveredObject);
                setObjectHighlight(hoveredObject);
                document.body.classList.add('organism-hovering');
            }
            return;
        }
    }

    hoveredObject = null;
    setHoverLabel(labels, null);
    setObjectHighlight(null);
    document.body.classList.remove('organism-hovering');
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

async function init() {
    setupStudentProfile();
    organismMeshes = await createFoodChain(scene);
    labels = createLabels(organismMeshes);
    energyParticles = createEnergyFlow(scene, organismMeshes);
    ecosystemInteractions = createEcosystemInteractions(scene, organismMeshes);
    setupSelection(camera, scene, organismMeshes);
    unlockAchievement('Bienvenido al Ecosistema');
    animate();

    setInterval(() => {
        saveGame({ timestamp: Date.now() });
    }, 10000);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    updateSun(sunMesh, time);
    updateMoon(moonMesh, time);
    const sunHeight = Math.max(0, sunMesh.position.y / 35);

    updateSky(scene, sun, time);
    updateRain(rain);
    updateEnergyFlow(energyParticles);
    updateStars(stars, sunHeight);
    updateClouds(clouds);
    updateAmbientParticles(ambientParticles);
    animateOrganisms(organismMeshes, time, delta);
    if(ecosystemInteractions){
        ecosystemInteractions.update();
    }
    updateLabels(labels, camera);
    controls.update();

    renderer.render(scene, camera);
}

init();

window.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
        toggleRain();
    }
});

function setupStudentProfile(){
    const name = localStorage.getItem('nombre') || 'Estudiante';
    const avatar = localStorage.getItem('avatar') || 'avatar_anime1.png';
    const score = localStorage.getItem('ecoScore') || '0';
    const nameNode = document.getElementById('studentName');
    const avatarNode = document.getElementById('studentAvatar');

    if(nameNode){
        nameNode.textContent = name;
    }

    if(avatarNode){
        avatarNode.src = `./img/${avatar}`;
        avatarNode.alt = `Avatar de ${name}`;
    }

    document.querySelectorAll('[data-score]').forEach(node => {
        node.textContent = score;
    });
}

function setObjectHighlight(object){
    if(highlightedObject === object) return;

    clearObjectHighlight(highlightedObject);
    highlightedObject = object;

    if(!object) return;

    object.traverse(child => {
        if(!child.isMesh || !child.material) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(material => {
            if(!material) return;
            if(material.emissive){
                material.userData = material.userData || {};
                material.userData.originalEmissive = material.emissive.getHex();
                material.userData.originalEmissiveIntensity = material.emissiveIntensity || 0;
                material.emissive.setHex(0xffdd55);
                material.emissiveIntensity = 0.45;
            }
        });
    });
}

function clearObjectHighlight(object){
    if(!object) return;

    object.traverse(child => {
        if(!child.isMesh || !child.material) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(material => {
            if(!material || !material.emissive || !material.userData) return;
            if(material.userData.originalEmissive !== undefined){
                material.emissive.setHex(material.userData.originalEmissive);
                material.emissiveIntensity = material.userData.originalEmissiveIntensity || 0;
                delete material.userData.originalEmissive;
                delete material.userData.originalEmissiveIntensity;
            }
        });
    });
}
