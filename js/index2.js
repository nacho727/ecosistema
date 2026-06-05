const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x23d18b, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate(){
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

let avatarSeleccionado = localStorage.getItem("avatar") || "avatar_anime1.png";

function hablar(texto){
  if(!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = "es-ES";
  mensaje.rate = 1;
  mensaje.pitch = 1;
  speechSynthesis.speak(mensaje);
}

function seleccionarAvatar(avatar, elemento){
  avatarSeleccionado = avatar;
  document.querySelectorAll(".animeAvatars img").forEach(img => img.classList.remove("selected"));
  elemento.classList.add("selected");
  localStorage.setItem("avatar", avatar);
  hablar("Pokémon seleccionado");
}

function irAprenderCN(){
  const nombre = localStorage.getItem("nombre") || "Amigo";
  if(!avatarSeleccionado){
    hablar("Elige primero un Pokémon");
    return;
  }
  localStorage.setItem("avatar", avatarSeleccionado);
  localStorage.setItem("nombre", nombre);
  hablar(`Bienvenido ${nombre}, entrando a la experiencia 3D`);
  setTimeout(() => { window.location.href = "index_2.html"; }, 600);
}

window.addEventListener("DOMContentLoaded", () => {
  const nombre = localStorage.getItem("nombre") || "Amigo";
  const saludoTitulo = document.getElementById("saludoTitulo");
  const saludoTexto = document.getElementById("saludoTexto");
  if(saludoTitulo){ saludoTitulo.textContent = `¡Bienvenido ${nombre} a 4° Básico!`; }
  if(saludoTexto){ saludoTexto.textContent = "Elige un avatar estilo Pokémon y entra a la aventura de cadenas alimentarias."; }
  document.querySelectorAll(".animeAvatars img").forEach(img => {
    if(img.getAttribute("src").includes(avatarSeleccionado.replace(".png", "")) || img.getAttribute("src").includes(avatarSeleccionado)) {
      img.classList.add("selected");
    }
  });
  hablar(`Bienvenido ${nombre} a 4° Básico. Elige tu Pokémon y entra a la aventura.`);
});
