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
import { questions } from './quiz/QuizSystem.js';
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

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredObject = null;

window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (organismMeshes.length === 0) return;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(organismMeshes, true);

    if (hits.length > 0) {
        let object = hits[0].object;
        while (object.parent && !object.userData.name) {
            object = object.parent;
        }

        if (object.userData && object.userData.name) {
            if (hoveredObject !== object) {
                hoveredObject = object;
                setHoverLabel(labels, hoveredObject);
            }
            return;
        }
    }

    hoveredObject = null;
    setHoverLabel(labels, null);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

async function init() {
    organismMeshes = await createFoodChain(scene);
    labels = createLabels(organismMeshes);
    energyParticles = createEnergyFlow(scene, organismMeshes);
    setupSelection(camera, scene, organismMeshes);
    unlockAchievement('Bienvenido al Ecosistema');
    animate();

    setInterval(() => {
        saveGame({ timestamp: Date.now() });
    }, 10000);
}

function animate() {
    requestAnimationFrame(animate);
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
    animateOrganisms(organismMeshes, time);
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

const quizBtn = document.getElementById('quizBtn');
if (quizBtn) {
    quizBtn.addEventListener('click', () => {
        const q = questions[Math.floor(Math.random() * questions.length)];
        const answer = prompt(`${q.question}\n\n0) ${q.options[0]}\n1) ${q.options[1]}\n2) ${q.options[2]}\n3) ${q.options[3]}`);

        if (parseInt(answer) === q.correct) {
            alert('✅ Correcto');
        } else {
            alert('❌ Incorrecto');
        }
    });
}
