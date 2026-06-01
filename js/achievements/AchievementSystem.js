const unlocked =
new Set();

export function unlockAchievement(name){

if(
unlocked.has(name)
) return;

unlocked.add(name);

alert(
"🏆 Logro desbloqueado:\n\n" +
name
);

}