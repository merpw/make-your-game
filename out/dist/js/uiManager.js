var _a;
import { currentBoard, restartLevel } from "./game.js";
export class UIManager {
    set activeButton(button) {
        var _a;
        (_a = this._activeButton) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
        button === null || button === void 0 ? void 0 : button.classList.add("active");
        this._activeButton = button;
    }
    get activeButton() {
        return this._activeButton;
    }
    constructor(uiButtons = []) {
        this.buttons = [];
        this.element = document.createElement("div");
        this.element.classList.add("buttons-panel");
        uiButtons.forEach((button) => this.addButton(button));
        this.activeButton = this.buttons[0] || null;
    }
    addButton(button) {
        const newButton = document.createElement("button");
        newButton.innerText = button.name;
        newButton.onclick = button.onClick;
        newButton.onmouseenter = () => {
            this.activeButton = newButton;
        };
        this.buttons.push(newButton);
        this.element.appendChild(newButton);
    }
    selectNextButton() {
        const activeButtonIndex = this.activeButton
            ? this.buttons.indexOf(this.activeButton)
            : 0;
        const newButtonIndex = (activeButtonIndex + 1) % this.buttons.length;
        this.activeButton = this.buttons[newButtonIndex];
    }
    selectPreviousButton() {
        const activeButtonIndex = this.activeButton
            ? this.buttons.indexOf(this.activeButton)
            : 0;
        const newButtonIndex = (activeButtonIndex - 1 + this.buttons.length) % this.buttons.length;
        this.activeButton = this.buttons[newButtonIndex];
    }
    clickActiveButton() {
        var _a;
        (_a = this.activeButton) === null || _a === void 0 ? void 0 : _a.click();
    }
    reset() {
        this.activeButton = this.buttons[0] || null;
    }
    /** check if the uiManager is active (visible) */
    isActive() {
        return this.element.offsetParent !== null;
    }
}
/** pause uiManager includes restart, continue, resume buttons*/
export const pauseUIManager = new UIManager([
    {
        name: "CONTINUE",
        onClick: () => {
            if (!currentBoard)
                return;
            currentBoard.isPaused = false;
        },
    },
    {
        name: "RESTART",
        onClick: () => {
            restartLevel();
            pauseUIManager.reset();
        },
    },
]);
pauseUIManager.element.classList.add("pause");
export const gameOverManager = new UIManager([
    {
        name: "RESTART",
        onClick: () => {
            restartLevel();
            gameOverManager.reset();
        },
    },
]);
gameOverManager.element.classList.add("win", "over");
// TODO: add winManager
const UIManagers = [gameOverManager, pauseUIManager];
(_a = document
    .getElementById("popup")) === null || _a === void 0 ? void 0 : _a.append(...UIManagers.map((manager) => manager.element));
/** returns an current active (visible) uiManager */
export const activeUIManager = () => UIManagers.find((manager) => manager.isActive());
//# sourceMappingURL=uiManager.js.map