import { addXP } from "../game/XPSystem.js";
import { getActionLabel } from "../ecosystem/EcosystemInteractions.js";
import { speakWithHighlight } from "../utils/SpeechHighlighter.js";

export function showInfo(data){
    const panel = document.getElementById("infoPanel");
    if(!panel) return;

    const organismName = data.name || capitalize(data.id || 'Organismo');
    const organismType = data.type || 'Desconocido';
    const organismDescription = data.description || data.summary || 'Información del organismo.';
    const organismSummary = data.summary || organismDescription;
    const organismFeedsOn = data.feedsOn || 'Información del organismo.';
    const organismFunction = data.functionText || organismDescription;
    const organismRole = data.ecosystemRole || organismDescription;

    const speechText = [
        organismName,
        `Tipo en la cadena: ${organismType}.`,
        organismSummary,
        organismFeedsOn,
        organismFunction,
        organismRole
    ].filter(Boolean).join(" ");

    panel.classList.add("hasOrganism");

    panel.innerHTML = `
        <div class="infoHeader">
            <span class="infoBadge">Ficha educativa</span>
            <h2 id="infoTitle">${escapeHtml(organismName)}</h2>
            <p class="infoSummary">${escapeHtml(data.summary || organismDescription)}</p>
        </div>

        <div class="infoGrid">
            <section class="infoMiniCard">
                <span>Tipo</span>
                <strong>${escapeHtml(organismType)}</strong>
            </section>
            <section class="infoMiniCard">
                <span>Qué hace</span>
                <strong>${escapeHtml(organismFunction)}</strong>
            </section>
            <section class="infoMiniCard">
                <span>${String(data.id || '').toLowerCase() === 'planta' ? 'Produce' : 'Se alimenta de'}</span>
                <strong>${escapeHtml(organismFeedsOn)}</strong>
            </section>
            <section class="infoMiniCard">
                <span>Papel en el ecosistema</span>
                <strong>${escapeHtml(organismRole)}</strong>
            </section>
        </div>

        <div class="descriptionCard">
            <span class="readingTitle">Descripción</span>
            <p>${escapeHtml(data.description || data.summary || 'Aprende más sobre este organismo.')}</p>
        </div>

        <div class="readingCard">
            <span class="readingTitle">Lectura con voz</span>
            <div id="infoText" aria-live="polite"></div>
        </div>

        <div class="actionCard">
            <div>
                <span>Acción interactiva</span>
                <strong>${escapeHtml(getActionLabel(data.action))}</strong>
                <p>Presiona el botón para activar la función del organismo en el mundo 3D.</p>
            </div>
            <button id="organismActionBtn" type="button">${escapeHtml(getActionLabel(data.action))}</button>
        </div>
    `;

    const actionBtn = document.getElementById("organismActionBtn");
    if(actionBtn){
        actionBtn.addEventListener("click", () => {
            window.dispatchEvent(new CustomEvent("organism-action", {
                detail: { action: data.action, organism: data.id }
            }));
        });
    }

    speakWithHighlight(speechText, document.getElementById("infoText"), {
        className: "infoWord",
        activeClass: "activeWord",
        lang: "es-ES",
        rate: 0.9
    });

    addXP(10);
}

function escapeHtml(value = ""){
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function capitalize(text){
    if(!text) return "Organismo";
    const value = String(text).trim();
    return value.charAt(0).toUpperCase() + value.slice(1);
}
