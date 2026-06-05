import * as THREE from 'three';
import { addXP } from '../game/XPSystem.js';
import { unlockAchievement } from '../achievements/AchievementSystem.js';
import { speakWithHighlight } from '../utils/SpeechHighlighter.js';

const ACTIONS = {
    photosynthesis: {
        label: 'Fotosíntesis',
        description: 'La planta recibe luz, agua y CO2. Produce glucosa y libera oxígeno.'
    },
    grasshopperFeeds: {
        label: 'Grillo come planta',
        actor: 'grillo',
        target: 'planta',
        description: 'El grillo obtiene energía al alimentarse de la planta.'
    },
    mouseFeeds: {
        label: 'Ratón come grillo',
        actor: 'raton',
        target: 'grillo',
        description: 'El ratón obtiene energía al alimentarse del grillo.'
    },
    snakeFeeds: {
        label: 'Serpiente caza ratón',
        actor: 'serpiente',
        target: 'raton',
        description: 'La serpiente transfiere energía al cazar al ratón.'
    },
    eagleFeeds: {
        label: 'Águila caza serpiente',
        actor: 'aguila',
        target: 'serpiente',
        description: 'El depredador superior recibe energía desde la serpiente.'
    },
    decompose: {
        label: 'Hongo recicla nutrientes',
        description: 'El hongo descompone restos y devuelve nutrientes al suelo.'
    }
};

export function createEcosystemInteractions(scene, organisms){
    const byId = new Map(organisms.map(org => [org.userData.id, org]));
    const effects = [];
    let activeSequence = null;
    let activeMessage = '';

    const actionPanel = createActionPanel();
    Object.entries(ACTIONS).forEach(([key, action]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = action.label;
        button.addEventListener('click', () => trigger(key));
        actionPanel.appendChild(button);
    });

    window.addEventListener('organism-action', (event) => {
        if(event.detail?.action){
            trigger(event.detail.action);
        }
    });

    function trigger(actionKey){
        if(activeSequence){
            finishSequence();
        }

        const action = ACTIONS[actionKey];
        if(!action) return;

        if(actionKey === 'photosynthesis'){
            runPhotosynthesis();
        } else if(actionKey === 'decompose'){
            runDecomposition();
        } else {
            runFeeding(action);
        }

        activeMessage = action.description;
        showLearningToast(action.label, action.description);
        addXP(25);
        unlockAchievement(action.label);
    }

    function runPhotosynthesis(){
        const plant = byId.get('planta');
        if(!plant) return;

        const origin = plant.position.clone();
        for(let i = 0; i < 34; i++){
            const kind = i % 3 === 0 ? 'oxygen' : i % 3 === 1 ? 'sun' : 'water';
            const mesh = createParticle(kind);
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.4 + Math.random() * 1.6;
            const start = kind === 'sun'
                ? origin.clone().add(new THREE.Vector3(Math.cos(angle) * 4, 7 + Math.random() * 2, Math.sin(angle) * 4))
                : origin.clone().add(new THREE.Vector3(Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius));
            const end = kind === 'oxygen'
                ? origin.clone().add(new THREE.Vector3(Math.cos(angle) * 3.5, 3 + Math.random() * 2, Math.sin(angle) * 3.5))
                : origin.clone().add(new THREE.Vector3(Math.cos(angle) * 0.35, 1.3 + Math.random(), Math.sin(angle) * 0.35));
            mesh.position.copy(start);
            scene.add(mesh);
            effects.push({ mesh, start, end, progress: Math.random() * 0.35, speed: 0.008 + Math.random() * 0.01, life: 260 });
        }

        pulseOrganism(plant, 1.18, 180);
    }

    function runDecomposition(){
        const mushroom = byId.get('hongo');
        const plant = byId.get('planta');
        if(!mushroom || !plant) return;

        for(let i = 0; i < 38; i++){
            const mesh = createParticle('nutrient');
            const start = mushroom.position.clone().add(randomGroundOffset(1.4));
            const end = plant.position.clone().add(randomGroundOffset(1.2));
            mesh.position.copy(start);
            scene.add(mesh);
            effects.push({ mesh, start, end, progress: Math.random() * 0.2, speed: 0.004 + Math.random() * 0.008, life: 320 });
        }

        pulseOrganism(mushroom, 1.2, 160);
        pulseOrganism(plant, 1.12, 220);
    }

    function runFeeding(action){
        const actor = byId.get(action.actor);
        const target = byId.get(action.target);
        if(!actor || !target) return;

        const start = actor.position.clone();
        const targetPoint = target.position.clone().add(new THREE.Vector3(1.15, 0, 0));
        actor.userData.isInAction = true;
        target.userData.isInAction = true;

        activeSequence = {
            actor,
            target,
            start,
            targetPoint,
            progress: 0,
            phase: 'approach'
        };
    }

    function update(){
        updateEffects();
        updateSequence();
    }

    function updateEffects(){
        for(let i = effects.length - 1; i >= 0; i--){
            const effect = effects[i];
            effect.progress += effect.speed;
            effect.life -= 1;

            const wave = Math.sin(effect.progress * Math.PI * 2) * 0.25;
            effect.mesh.position.lerpVectors(effect.start, effect.end, Math.min(effect.progress, 1));
            effect.mesh.position.y += wave;
            effect.mesh.rotation.y += 0.03;

            if(effect.mesh.material){
                effect.mesh.material.opacity = Math.max(0, Math.min(1, effect.life / 80));
            }

            if(effect.progress >= 1 || effect.life <= 0){
                scene.remove(effect.mesh);
                effect.mesh.geometry.dispose();
                effect.mesh.material.dispose();
                effects.splice(i, 1);
            }
        }
    }

    function updateSequence(){
        if(!activeSequence) return;

        const sequence = activeSequence;
        sequence.progress += 0.012;

        if(sequence.phase === 'approach'){
            sequence.actor.position.lerpVectors(sequence.start, sequence.targetPoint, smooth(sequence.progress));
            sequence.actor.lookAt(sequence.target.position);

            if(sequence.progress >= 1){
                sequence.phase = 'eat';
                sequence.progress = 0;
                pulseOrganism(sequence.actor, 1.15, 90);
                pulseOrganism(sequence.target, 0.75, 90);
                createEnergyBurst(sequence.target.position, sequence.actor.position);
            }
        } else if(sequence.phase === 'eat'){
            sequence.actor.rotation.y += 0.08;
            sequence.target.scale.multiplyScalar(0.995);

            if(sequence.progress >= 1){
                sequence.phase = 'return';
                sequence.progress = 0;
            }
        } else {
            sequence.actor.position.lerpVectors(sequence.targetPoint, sequence.start, smooth(sequence.progress));
            if(sequence.progress >= 1){
                finishSequence();
            }
        }
    }

    function createEnergyBurst(from, to){
        for(let i = 0; i < 24; i++){
            const mesh = createParticle('energy');
            const start = from.clone().add(randomAirOffset(0.8));
            const end = to.clone().add(randomAirOffset(0.8));
            mesh.position.copy(start);
            scene.add(mesh);
            effects.push({ mesh, start, end, progress: Math.random() * 0.2, speed: 0.012 + Math.random() * 0.012, life: 140 });
        }
    }

    function finishSequence(){
        if(!activeSequence) return;

        activeSequence.actor.position.copy(activeSequence.start);
        activeSequence.actor.userData.isInAction = false;
        activeSequence.target.userData.isInAction = false;
        activeSequence.target.scale.setScalar(activeSequence.target.userData.scale ?? 1.2);
        activeSequence = null;
    }

    function dispose(){
        finishSequence();
        effects.splice(0).forEach((effect) => {
            scene.remove(effect.mesh);
            effect.mesh.geometry.dispose();
            effect.mesh.material.dispose();
        });
    }

    return {
        trigger,
        update,
        dispose,
        get activeMessage(){
            return activeMessage;
        }
    };
}

export function getActionLabel(actionKey){
    return ACTIONS[actionKey]?.label || 'Ver acción';
}

function createActionPanel(){
    let panel = document.getElementById('actionPanel');
    if(panel) return panel;

    panel = document.createElement('div');
    panel.id = 'actionPanel';
    document.body.appendChild(panel);
    return panel;
}

function createParticle(kind){
    const color = {
        sun: 0xffdf52,
        water: 0x45c7ff,
        oxygen: 0xd9fbff,
        nutrient: 0x8b5a2b,
        energy: 0xffef69
    }[kind] || 0xffffff;

    const size = kind === 'oxygen' ? 0.11 : 0.16;
    return new THREE.Mesh(
        new THREE.SphereGeometry(size, 10, 8),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
    );
}

function randomGroundOffset(radius){
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * Math.random() * radius, 0.18, Math.sin(angle) * Math.random() * radius);
}

function randomAirOffset(radius){
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * Math.random() * radius, 0.4 + Math.random() * 1.2, Math.sin(angle) * Math.random() * radius);
}

function smooth(value){
    const t = Math.min(Math.max(value, 0), 1);
    return t * t * (3 - 2 * t);
}

function pulseOrganism(org, scale, frames){
    const baseScale = org.userData.scale ?? 1.2;
    let remaining = frames;

    const pulse = () => {
        if(remaining <= 0){
            org.scale.setScalar(baseScale);
            return;
        }
        const progress = remaining / frames;
        const amount = baseScale + (scale - baseScale) * Math.sin(progress * Math.PI);
        org.scale.setScalar(amount);
        remaining -= 1;
        requestAnimationFrame(pulse);
    };

    pulse();
}

function showLearningToast(title, description){
    let toast = document.getElementById('learningToast');
    if(!toast){
        toast = document.createElement('div');
        toast.id = 'learningToast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<strong>${title}</strong><span id="learningToastText"></span>`;
    toast.classList.add('visible');
    speakWithHighlight(description, document.getElementById('learningToastText'), {
        className: 'toastWord',
        activeClass: 'activeWord'
    });
    window.clearTimeout(showLearningToast.timeout);
    showLearningToast.timeout = window.setTimeout(() => {
        toast.classList.remove('visible');
    }, 5200);
}
