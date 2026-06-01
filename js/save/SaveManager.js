export function saveGame(data){

localStorage.setItem(

"ecoFoodSave",

JSON.stringify(data)

);

}

export function loadGame(){

const data =
localStorage.getItem(
"ecoFoodSave"
);

if(data){

return JSON.parse(data);

}

return null;

}