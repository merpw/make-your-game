import { currentBoard, restartLevel, startGameFirstTime } from "./game.js";
import { activeUIManager } from "./uiManager.js";
/** Configuration of the control keys. */
const CONTROLS = {
    move: {
        Up: ["w", "ArrowUp", "touchUp"],
        Down: ["s", "ArrowDown", "touchDown"],
        Left: ["a", "ArrowLeft", "touchLeft"],
        Right: ["d", "ArrowRight", "touchRight"],
    },
    PlaceFungi: "f",
    TerminateFungi: "t",
    Restart: "r",
    Pause: ["p", "Escape"],
};
/**
 * The state of the keys that control the game.
 * @example
 * MoveInputState.get("w")
 * // false
 * */
export const MoveInputState = new Map(Object.values(CONTROLS.move).flatMap((keys) => keys.map((key) => [key, false])));
/** Reset the {@link MoveInputState} and {@link currentBoard.hero.way}*/
export const resetInputState = () => {
    MoveInputState.forEach((_, key) => MoveInputState.set(key, false));
    currentBoard && (currentBoard.hero.way = getWay());
};
/** Get the current way of the Hero according to the {@link MoveInputState| state of the control keys} */
const getWay = () => ({
    up: CONTROLS.move.Up.some((key) => MoveInputState.get(key)),
    down: CONTROLS.move.Down.some((key) => MoveInputState.get(key)),
    left: CONTROLS.move.Left.some((key) => MoveInputState.get(key)),
    right: CONTROLS.move.Right.some((key) => MoveInputState.get(key)),
});
window.addEventListener("keydown", (event) => {
    var _a, _b, _c;
    if (!currentBoard) {
        if (event.key === "Enter") {
            startGameFirstTime();
        }
        return;
    }
    if (event.repeat)
        return;
    const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key;
    if (currentBoard.isPaused) {
        if (key === CONTROLS.Restart) {
            restartLevel();
            return;
        }
        if (CONTROLS.Pause.includes(key)) {
            currentBoard.isPaused = false;
            return;
        }
        if (key === "Enter") {
            (_a = activeUIManager()) === null || _a === void 0 ? void 0 : _a.clickActiveButton();
            return;
        }
        if (CONTROLS.move.Up.includes(key) || CONTROLS.move.Left.includes(key)) {
            (_b = activeUIManager()) === null || _b === void 0 ? void 0 : _b.selectPreviousButton();
            return;
        }
        if (CONTROLS.move.Down.includes(key) || CONTROLS.move.Right.includes(key)) {
            (_c = activeUIManager()) === null || _c === void 0 ? void 0 : _c.selectNextButton();
            return;
        }
        return;
    }
    if (CONTROLS.Pause.includes(key)) {
        currentBoard.isPaused = true;
        resetInputState();
        return;
    }
    if (MoveInputState.has(key)) {
        MoveInputState.set(key, true);
        currentBoard.hero.way = getWay();
        return;
    }
    if (key === CONTROLS.PlaceFungi) {
        currentBoard.hero.placeFungi();
        return;
    }
    if (key === CONTROLS.TerminateFungi) {
        currentBoard.hero.terminateFungi();
        return;
    }
});
window.addEventListener("keyup", (event) => {
    if (!currentBoard || currentBoard.isPaused)
        return;
    const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key;
    if (MoveInputState.has(key)) {
        MoveInputState.set(key, false);
        currentBoard.hero.way = getWay();
        return;
    }
});
window.addEventListener("blur", () => {
    if (!currentBoard)
        return;
    currentBoard.isPaused = true;
    resetInputState();
});
const startGameButton = document.getElementById("startButton");
if (startGameButton) {
    startGameButton.addEventListener("click", startGameFirstTime);
}
const touchControls = document.getElementById("touch-controls");
const buttons = document.querySelectorAll("#touch-controls button");
if (touchControls && touchControls.style.display !== "none") {
    touchControls.addEventListener("selectstart", (e) => e.preventDefault());
    buttons.forEach((button) => {
        if (MoveInputState.has(button.id)) {
            button.addEventListener("pointerdown", (e) => button.releasePointerCapture(e.pointerId)
            // workaround for https://github.com/w3c/pointerevents/issues/178#issuecomment-1029108322
            );
            button.addEventListener("pointerenter", () => {
                if (!currentBoard || currentBoard.isPaused)
                    return;
                MoveInputState.set(button.id, true);
                currentBoard.hero.way = getWay();
            });
            button.addEventListener("pointerleave", () => {
                if (!currentBoard || currentBoard.isPaused)
                    return;
                MoveInputState.set(button.id, false);
                currentBoard.hero.way = getWay();
            });
            return;
        }
        if (button.id === "touchPlaceFungi") {
            button.addEventListener("pointerdown", () => {
                if (!currentBoard || currentBoard.isPaused)
                    return;
                currentBoard.hero.placeFungi();
            });
            return;
        }
        if (button.id === "touchTerminateFungi") {
            button.addEventListener("pointerdown", () => {
                if (!currentBoard || currentBoard.isPaused)
                    return;
                currentBoard === null || currentBoard === void 0 ? void 0 : currentBoard.hero.terminateFungi();
            });
        }
    });
}
//# sourceMappingURL=keys.js.map