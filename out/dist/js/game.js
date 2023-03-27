import { Board } from "./board.js";
import { level1 } from "./levels.js";
import "./keys.js";
const FPS = 60;
const NORMAL_FRAME_TIME = 1000 / FPS;
/** removes all elements in layers and {@link currentBoard} */
const clean = () => {
    document
        .querySelectorAll("#game g.layer > *")
        .forEach((node) => node.remove());
    const game = document.getElementById("game");
    const classes = Array.from(game.classList);
    game.classList.remove(...classes);
    currentBoard = null;
};
/** Sets {@link currentLevel} and {@link currentBoard} */
const setLevel = (newLevel) => {
    clean();
    currentLevel = newLevel;
    currentBoard = new Board(currentLevel);
};
export const restartLevel = () => setLevel(currentLevel);
let currentLevel;
export let currentBoard;
setLevel(level1);
let lastTime = 0;
let lastFrameTime = 1000 / FPS;
const step = (timestamp) => {
    const frameTime = timestamp - lastTime;
    lastTime = timestamp;
    if (frameTime < 2 * lastFrameTime) {
        // limit the frame time to 2x the last frame time
        // to avoid huge jumps in the game state
        currentBoard === null || currentBoard === void 0 ? void 0 : currentBoard.render(frameTime / NORMAL_FRAME_TIME, timestamp);
    }
    lastFrameTime = frameTime;
    window.requestAnimationFrame(step);
};
window.requestAnimationFrame(step);
//# sourceMappingURL=game.js.map