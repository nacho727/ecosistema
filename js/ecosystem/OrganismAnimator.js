export function animateOrganisms(
organisms,
time
){

organisms.forEach(org=>{

org.position.y =

1 +

Math.sin(

time*2 +
org.userData.offset

)*0.2;

});

}