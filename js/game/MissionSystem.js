const missions = [

"Descubre la Planta",
"Descubre el Grillo",
"Descubre el Ratón",
"Descubre la Serpiente",
"Descubre el Águila",
"Descubre el Hongo"

];

let currentMission = 0;

export function updateMission(){

    if(currentMission < missions.length){

        document.getElementById(
        "mission"
        ).innerText =

        missions[currentMission];

    }

}

export function completeMission(){

    currentMission++;

    updateMission();

}