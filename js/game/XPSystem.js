import { updateXPBar }
from "../ui/XPBar.js";

let xp = 0;

export function addXP(amount){

xp += amount;

document.getElementById(
"xp"
).innerText =

`XP: ${xp}`;

updateXPBar(xp);

return xp;

}

export function getXP(){

return xp;

}