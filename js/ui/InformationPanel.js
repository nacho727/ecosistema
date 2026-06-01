import { addXP }
from "../game/XPSystem.js";

export function showInfo(data){

const panel =
document.getElementById(
"infoPanel"
);

const utteranceText =
`${data.name}. ${data.type}. ${data.description}`;

const nameWords =
data.name
.trim()
.split(/\s+/);
const typeWords =
data.type
.trim()
.split(/\s+/);
const descriptionWords =
data.description
.trim()
.split(/\s+/);

panel.innerHTML = `

<h2 id="infoTitle">
${nameWords.map((word, index) =>
`<span class="infoWord" data-index="${index}">${word}</span>`
).join(" ")}
</h2>

<p id="infoType">
${typeWords.map((word, index) =>
`<span class="infoWord" data-index="${nameWords.length + index}">${word}</span>`
).join(" ")}
</p>

<div id="infoText">
${descriptionWords.map((word, index) =>
`<span class="infoWord" data-index="${nameWords.length + typeWords.length + index}">${word}</span>`
).join(" ")}
</div>

`;

highlightSpeechWords(utteranceText);

addXP(10);

}

function highlightSpeechWords(text){

const spans =
Array.from(
document.querySelectorAll(
".infoWord"
)
);

const positions = [];
let offset = 0;

const allWords = text.split(/\s+/);
allWords.forEach(word=>{
positions.push({
start:offset,
end:offset+word.length
});
offset += word.length + 1;
});

const utterance =
new SpeechSynthesisUtterance(text);
utterance.lang = "es-ES";
utterance.rate = 1;
utterance.pitch = 1;

let activeIndex = -1;

utterance.onboundary = event=>{
if(event.name !== 'word' || event.charIndex === undefined || event.charIndex === null) return;

const idx = positions.findIndex(pos=>
 event.charIndex >= pos.start &&
 event.charIndex < pos.end
);

if(idx === -1 || idx >= spans.length) return;

if(idx !== activeIndex){
if(activeIndex !== -1){
spans[activeIndex].classList.remove("activeWord");
}
activeIndex = idx;
spans[activeIndex].classList.add("activeWord");
spans[activeIndex].scrollIntoView({
behavior: "smooth",
block: "nearest",
inline: "center"
});
}
};

utterance.onend = ()=>{
if(activeIndex !== -1){
spans[activeIndex].classList.remove("activeWord");
}
};

window.speechSynthesis.cancel();
window.speechSynthesis.speak(utterance);
}
