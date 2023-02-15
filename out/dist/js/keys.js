import { mainHero } from "./game.js";
const KeyState = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false,
    d: false,
    a: false,
    w: false,
    s: false,
    o: false,
    p: false, // fung terminate key
};
export default KeyState;
// TODO restyle moves to WASD keys. And F and T keys for fung.
window.addEventListener("keydown", (event) => {
    const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key;
    if (key in KeyState) {
        KeyState[key] = true;
        mainHero.checkKeys();
    }
});
window.addEventListener("keyup", (event) => {
    const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key;
    if (key in KeyState) {
        KeyState[key] = false;
        mainHero.checkKeys();
    }
});
