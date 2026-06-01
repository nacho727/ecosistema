export function updateSky(
scene,
sun,
time
){

sun.position.x =
Math.cos(time*0.05)*40;

sun.position.y =
15+
Math.sin(time*0.05)*20;

const daylight =
Math.max(
0,
sun.position.y/35
);

scene.background.setHSL(

0.6,

0.5,

0.08 + daylight*0.55

);

}