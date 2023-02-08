import { mainHero } from "./game.js";
const KeyState = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
};
export default KeyState;
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
