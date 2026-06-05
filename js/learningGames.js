import { speakPlain, speakWithHighlight } from "./utils/SpeechHighlighter.js";

const SCORE_KEY = "ecoScore";
const COMPLETED_KEY = "ecoCompletedGame";

window.addEventListener("DOMContentLoaded", () => {
    setupProfile();
    renderScore();
    setupLearningPage();
    setupGame();
    setupFinalPage();
});

function setupProfile(){
    const name = localStorage.getItem("nombre") || "Estudiante";
    const avatar = localStorage.getItem("avatar") || "avatar_anime1.png";

    document.querySelectorAll("[data-student-name]").forEach(node => {
        node.textContent = name;
    });

    document.querySelectorAll("[data-student-avatar]").forEach(img => {
        img.src = `img/${avatar}`;
        img.alt = `Avatar de ${name}`;
    });
}

function renderScore(){
    const score = Number(localStorage.getItem(SCORE_KEY) || 0);
    document.querySelectorAll("[data-score]").forEach(node => {
        node.textContent = score;
    });
}

function addScore(amount, gameId){
    if(gameId && localStorage.getItem(`ecoGameDone${gameId}`) === "true"){
        return;
    }

    const current = Number(localStorage.getItem(SCORE_KEY) || 0);
    localStorage.setItem(SCORE_KEY, String(current + amount));
    if(gameId){
        localStorage.setItem(`ecoGameDone${gameId}`, "true");
        const completed = Math.max(Number(localStorage.getItem(COMPLETED_KEY) || 0), Number(gameId));
        localStorage.setItem(COMPLETED_KEY, String(completed));
    }
    renderScore();
}

function setupLearningPage(){
    const textNode = document.querySelector("[data-read-text]");
    if(!textNode) return;

    const text = textNode.dataset.readText || textNode.textContent;
    speakWithHighlight(text, textNode, { className: "readWord", activeClass: "activeWord" });

    document.querySelectorAll("[data-say]").forEach(button => {
        button.addEventListener("click", () => {
            speakPlain(button.dataset.say);
        });
    });
}

function setupGame(){
    const config = window.ECO_GAME_CONFIG;
    if(!config) return;

    enforceSequentialProgress(config);

    const title = document.querySelector("[data-game-title]");
    const instruction = document.querySelector("[data-game-instruction]");
    const tray = document.querySelector("[data-drag-tray]");
    const zones = document.querySelector("[data-drop-tray]");
    const checkBtn = document.querySelector("[data-check]");
    const resetBtn = document.querySelector("[data-reset]");
    const nextBtn = document.querySelector("[data-next]");
    const feedback = document.querySelector("[data-feedback]");

    if(title) title.textContent = config.title;
    if(instruction){
        speakWithHighlight(config.instruction, instruction, {
            className: "readWord",
            activeClass: "activeWord"
        });
    }

    if(tray){
        tray.innerHTML = config.items.map(item => itemTemplate(item)).join("");
    }

    if(zones){
        zones.innerHTML = config.zones.map(zone => zoneTemplate(zone)).join("");
    }

    document.querySelectorAll(".draggable").forEach(item => {
        item.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/plain", item.dataset.id);
        });
        item.addEventListener("click", () => {
            speakPlain(item.dataset.say || item.textContent.trim());
            document.querySelectorAll(".draggable").forEach(node => node.classList.remove("selectedDrag"));
            item.classList.add("selectedDrag");
        });
    });

    document.querySelectorAll(".dropZone").forEach(zone => {
        zone.addEventListener("dragover", event => {
            event.preventDefault();
            zone.classList.add("dragOver");
        });
        zone.addEventListener("dragleave", () => zone.classList.remove("dragOver"));
        zone.addEventListener("drop", event => {
            event.preventDefault();
            zone.classList.remove("dragOver");
            const id = event.dataTransfer.getData("text/plain");
            const dragged = document.querySelector(`.draggable[data-id="${id}"]`);
            if(!dragged) return;

            zone.querySelector(".placeholder")?.remove();
            zone.appendChild(dragged);
            speakPlain(dragged.dataset.say || dragged.textContent.trim());
        });
        zone.addEventListener("click", () => {
            const selected = document.querySelector(".draggable.selectedDrag");
            if(!selected) return;
            zone.querySelector(".placeholder")?.remove();
            zone.appendChild(selected);
            selected.classList.remove("selectedDrag");
            speakPlain(selected.dataset.say || selected.textContent.trim());
        });
    });

    if(checkBtn){
        checkBtn.addEventListener("click", () => validateGame(config, feedback, nextBtn));
    }

    if(resetBtn){
        resetBtn.addEventListener("click", () => window.location.reload());
    }

    if(nextBtn){
        nextBtn.href = config.next;
    }
}

function enforceSequentialProgress(config){
    const completed = Number(localStorage.getItem(COMPLETED_KEY) || 0);
    const current = Number(config.id || 1);

    if(current <= 1 || completed >= current - 1) return;

    const target = current === 2 ? "juego1.html" : `juego${current - 1}.html`;
    speakPlain("Primero completa el juego anterior.");
    window.setTimeout(() => {
        window.location.href = target;
    }, 900);
}

function validateGame(config, feedback, nextBtn){
    let allCorrect = true;

    document.querySelectorAll(".dropZone").forEach(zone => {
        const expected = zone.dataset.accept.split(",");
        const placed = Array.from(zone.querySelectorAll(".draggable")).map(item => item.dataset.id);
        const correct =
            placed.length === expected.length &&
            expected.every(id => placed.includes(id));

        zone.classList.toggle("correct", correct);
        zone.classList.toggle("incorrect", !correct);

        if(!correct){
            allCorrect = false;
        }
    });

    if(allCorrect){
        addScore(config.points || 20, config.id);
        showFeedback(feedback, "Muy bien. Respuesta correcta.", true);
        launchConfetti();

        if(config.next === "final.html"){
            window.setTimeout(() => {
                window.location.href = config.next;
            }, 900);
            return;
        }

        if(nextBtn){
            nextBtn.classList.add("visible");
        }
    } else {
        showFeedback(feedback, "Inténtalo nuevamente. Revisa dónde soltaste cada elemento.", false);
    }
}

function showFeedback(node, text, ok){
    if(!node) return;
    speakWithHighlight(text, node, {
        className: "readWord",
        activeClass: "activeWord"
    });
    node.classList.toggle("good", ok);
    node.classList.toggle("bad", !ok);
}

function itemTemplate(item){
    return `
        <div class="draggable" draggable="true" data-id="${item.id}" data-say="${item.say || item.label}">
            ${item.image ? `<img src="${item.image}" alt="">` : ""}
            ${item.symbol ? `<strong class="tokenIcon">${item.symbol}</strong>` : ""}
            <span>${item.label}</span>
        </div>
    `;
}

function zoneTemplate(zone){
    return `
        <div class="dropZone" data-accept="${zone.accept.join(",")}">
            ${zone.image ? `<img src="${zone.image}" alt="">` : ""}
            ${zone.symbol ? `<strong class="tokenIcon">${zone.symbol}</strong>` : ""}
            <span class="placeholder">${zone.label}</span>
        </div>
    `;
}

function setupFinalPage(){
    const final = document.querySelector("[data-final-page]");
    if(!final) return;

    renderScore();
    speakPlain("Felicitaciones, completaste todos los juegos.");
    launchConfetti();
    window.setTimeout(launchConfetti, 900);
}

export function launchConfetti(){
    const colors = ["#ffdf52", "#39c878", "#4ad7ff", "#ff7ce6", "#ffffff"];
    for(let i = 0; i < 90; i++){
        const piece = document.createElement("span");
        piece.className = "confettiPiece";
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 0.45}s`;
        piece.style.transform = `rotate(${Math.random() * 180}deg)`;
        document.body.appendChild(piece);
        window.setTimeout(() => piece.remove(), 2300);
    }
}
