// variables
let avatarSeleccionado = "";

// 🔊 VOZ (mejorada y segura)
function hablar(texto){
    if(!window.speechSynthesis) return;
    speechSynthesis.cancel();
    let mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1;
    speechSynthesis.speak(mensaje);
}

// 🎉 CONFETTI MEJORADO (ahora sí se ve)
function lanzarConfetti(){
    for(let i=0; i<60; i++){
        let confeti = document.createElement("div");
        confeti.style.position = "fixed";
        confeti.style.width = "8px";
        confeti.style.height = "8px";
        confeti.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
        confeti.style.left = Math.random()*100 + "vw";
        confeti.style.top = "-10px";
        confeti.style.zIndex = "9999";
        confeti.style.borderRadius = "50%";
        document.body.appendChild(confeti);

        let velocidad = Math.random()*3 + 2;
        let animacion = confeti.animate([
            { transform: "translateY(0px)" },
            { transform: `translateY(${window.innerHeight}px)` }
        ], {
            duration: velocidad * 1000,
            easing: "linear"
        });

        animacion.onfinish = () => confeti.remove();
    }
}

// 👤 SELECCIONAR AVATAR
function seleccionarAvatar(avatar, elemento){
    avatarSeleccionado = avatar;
    let avatars = document.querySelectorAll(".avatars img");
    avatars.forEach(img => img.classList.remove("selected"));
    elemento.classList.add("selected");
    hablar("Avatar seleccionado");
    lanzarConfetti();
}

// 🚀 INGRESAR
function ingresar(destino = "bienvenida.html"){
    let nombreInput = document.getElementById("nombre");
    let nombre = "";
    if(nombreInput){
        nombre = nombreInput.value.trim();
    }
    if(!nombre){
        nombre = localStorage.getItem("nombre") || "";
    }

    if(nombre === "" && avatarSeleccionado === ""){
        hablar("Debes escribir tu nombre y seleccionar un avatar");
        return;
    }
    if(nombre === ""){
        hablar("Debes escribir tu nombre");
        return;
    }
    if(avatarSeleccionado === ""){
        hablar("Debes seleccionar un avatar");
        return;
    }

    hablar("Bien hecho " + nombre);
    lanzarConfetti();
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("avatar", avatarSeleccionado);

    setTimeout(()=>{
        window.location.href = destino;
    }, 1500);
}
