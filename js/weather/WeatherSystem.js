let weather = "soleado";

export function changeWeather(){

const types = [

"soleado",
"nublado",
"lluvia"

];

weather =
types[
Math.floor(
Math.random()*
types.length
)
];

console.log(
"Clima:",
weather
);

}

export function getWeather(){

return weather;

}