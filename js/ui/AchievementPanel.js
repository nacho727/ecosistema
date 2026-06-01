export function addAchievement(name){

const panel =
document.getElementById(
"achievementPanel"
);

const div =
document.createElement("div");

div.innerText =
"🏆 " + name;

panel.appendChild(div);

}