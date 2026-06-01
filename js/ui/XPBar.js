let level = 1;

export function updateXPBar(xp){

const maxXP = 100;

const percent =
(xp % maxXP);

document.getElementById(
"xpBar"
).style.width =

`${percent}%`;

const newLevel =
Math.floor(xp/maxXP)+1;

if(newLevel !== level){

level = newLevel;

document.getElementById(
"level"
).innerText =

`Nivel ${level}`;

}

}