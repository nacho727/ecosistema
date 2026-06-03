export function speakWithHighlight(text, container, options = {}){
    if(!container) return;

    const tag = options.tag || "span";
    const className = options.className || "readWord";
    const activeClass = options.activeClass || "activeWord";
    const words = text.trim().split(/\s+/).filter(Boolean);

    container.innerHTML = words.map((word, index) =>
        `<${tag} class="${className}" data-word-index="${index}">${escapeHtml(word)}</${tag}>`
    ).join(" ");

    if(!window.speechSynthesis || words.length === 0) return;

    const spans = Array.from(container.querySelectorAll(`.${className}`));
    const positions = [];
    let offset = 0;

    words.forEach((word) => {
        positions.push({ start: offset, end: offset + word.length });
        offset += word.length + 1;
    });

    const utterance = new SpeechSynthesisUtterance(words.join(" "));
    utterance.lang = options.lang || "es-ES";
    utterance.rate = options.rate || 0.95;
    utterance.pitch = options.pitch || 1;

    let activeIndex = -1;

    utterance.onboundary = (event) => {
        if(event.name !== "word" || event.charIndex === undefined || event.charIndex === null) return;

        const index = positions.findIndex(pos =>
            event.charIndex >= pos.start &&
            event.charIndex < pos.end
        );

        if(index === -1 || !spans[index]) return;

        if(activeIndex !== -1 && spans[activeIndex]){
            spans[activeIndex].classList.remove(activeClass);
        }

        activeIndex = index;
        spans[index].classList.add(activeClass);
        spans[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    };

    utterance.onend = () => {
        if(activeIndex !== -1 && spans[activeIndex]){
            spans[activeIndex].classList.remove(activeClass);
        }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

export function speakPlain(text){
    if(!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function escapeHtml(value){
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
