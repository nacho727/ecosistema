export function speak(text){

const speech =
new SpeechSynthesisUtterance(
text
);

speech.lang =
"es-ES";

speech.rate =
1;

speechSynthesis.speak(
speech
);

}