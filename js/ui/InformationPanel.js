import { addXP } from "../game/XPSystem.js";
import { getActionLabel } from "../ecosystem/EcosystemInteractions.js";
import { speakWithHighlight } from "../utils/SpeechHighlighter.js";

export function showInfo(data){
    const panel = document.getElementById("infoPanel");
    if(!panel) return;

    panel.innerHTML = `
        <div class="infoHeader">
            <span class="infoBadge">${data.type}</span>
            <h2 id="infoTitle">${data.name}</h2>
        </div>
        <p id="infoType"><strong>Tipo en la cadena:</strong> ${data.type}</p>
        <div id="infoText" aria-live="polite"></div>
        <button id="organismActionBtn" type="button">${getActionLabel(data.action)}</button>
    `;

    const actionBtn = document.getElementById("organismActionBtn");
    if(actionBtn){
        actionBtn.addEventListener("click", () => {
            window.dispatchEvent(new CustomEvent("organism-action", {
                detail: { action: data.action, organism: data.id }
            }));
        });
    }

    const description = `${data.name}. Tipo en la cadena: ${data.type}. ${data.description}`;
    speakWithHighlight(description, document.getElementById("infoText"), {
        className: "infoWord",
        activeClass: "activeWord"
    });

    addXP(10);
}
