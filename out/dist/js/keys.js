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
    ö: false,
    ä: false, // fung terminate key
};
export default KeyState;
// TODO restyle moves to WASD keys. And F and T keys for fung.
window.addEventListener("keydown", (event) => {
    if (event.key in KeyState) {
        // TODO add a check for if no another keys are already pressed, to prevent diagonal movement
        KeyState[event.key] = true;
        mainHero.checkKeys();
    }
});
window.addEventListener("keyup", (event) => {
    if (event.key in KeyState) {
        KeyState[event.key] = false;
        mainHero.checkKeys();
    }
});
