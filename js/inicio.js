let cursoSeleccionado = "";

function hablar(texto){
    if(!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1;
    speechSynthesis.speak(mensaje);
}

function seleccionarCurso(curso, elemento){
    cursoSeleccionado = curso;
    document.querySelectorAll('.cursoBtn').forEach(btn => btn.classList.remove('selected'));
    elemento.classList.add('selected');
    if(curso === 'primero'){
        hablar('Primero básico seleccionado');
    } else {
        hablar('Cuarto básico seleccionado');
    }
}

function ingresarInicio(){
    const nombreInput = document.getElementById('nombre');
    const nombre = (nombreInput ? nombreInput.value.trim() : '') || localStorage.getItem('nombre') || '';

    if(nombre === '' && cursoSeleccionado === ''){
        hablar('Ingresa nombre y selecciona curso');
        return;
    }
    if(nombre === ''){
        hablar('Ingresa nombre de usuario');
        return;
    }
    if(cursoSeleccionado === ''){
        hablar('Debes escoger un curso');
        return;
    }

    localStorage.setItem('nombre', nombre);
    localStorage.setItem('curso', cursoSeleccionado);
    hablar('Bienvenido ' + nombre);

    const destino = cursoSeleccionado === 'primero' ? 'primero.html' : 'index2.html';
    setTimeout(() => {
        window.location.href = destino;
    }, 1500);
}

window.addEventListener('DOMContentLoaded', () => {
    const nombre = localStorage.getItem('nombre') || '';
    if(nombre){
        const nombreInput = document.getElementById('nombre');
        if(nombreInput){
            nombreInput.value = nombre;
        }
    }
});
