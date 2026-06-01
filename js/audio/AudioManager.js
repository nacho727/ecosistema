export function startAmbientSound(){

const audio =
new Audio(
'assets/audio/forest.mp3'
);

audio.loop=true;

audio.volume=0.4;

audio.play();

}