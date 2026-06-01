export function createLabel(text){

const div =
document.createElement("div");

div.className =
"organismLabel";

div.innerText =
text;

document.body.appendChild(div);

return div;

}