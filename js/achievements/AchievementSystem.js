const unlocked = new Set();

export function unlockAchievement(name){
    if(unlocked.has(name)) return;

    unlocked.add(name);

    const panel = document.getElementById("achievementPanel");
    if(panel){
        panel.textContent = `Logro desbloqueado: ${name}`;
    }

    let toast = document.getElementById("achievementToast");
    if(!toast){
        toast = document.createElement("div");
        toast.id = "achievementToast";
        document.body.appendChild(toast);
    }

    toast.textContent = `Logro desbloqueado: ${name}`;
    toast.classList.add("visible");
    window.clearTimeout(unlockAchievement.timeout);
    unlockAchievement.timeout = window.setTimeout(() => {
        toast.classList.remove("visible");
    }, 3600);
}
