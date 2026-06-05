import { updateXPBar }
from "../ui/XPBar.js";

let xp = 0;

export function addXP(amount){

xp += amount;
const globalScore =
Number(localStorage.getItem("ecoScore") || 0) + amount;
localStorage.setItem("ecoScore", String(globalScore));

document.getElementById(
"xp"
).innerText =

`XP: ${xp}`;

document.querySelectorAll("[data-score]").forEach(node=>{
node.textContent = globalScore;
});

updateXPBar(xp);

return xp;

}

export function getXP(){

return xp;

}
