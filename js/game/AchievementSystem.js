import { addAchievement }
from "../ui/AchievementPanel.js";

const unlocked = [];

export function unlockAchievement(name){

if(unlocked.includes(name))
return;

unlocked.push(name);

addAchievement(name);

}