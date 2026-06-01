export function saveGame(data){

localStorage.setItem(
"ecofoodchain",
JSON.stringify(data)
);

}

export function loadGame(){

return JSON.parse(

localStorage.getItem(
"ecofoodchain"
)

);

}