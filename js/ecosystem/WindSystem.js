export function applyWind(
organisms,
time
){

organisms.forEach(org=>{

if(
org.userData.name ===
"Planta"
){

org.rotation.z =

Math.sin(
time*2
)*0.1;

}

});

}