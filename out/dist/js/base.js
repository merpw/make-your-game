import Timer from "./timer.js";
import AnimationManager from "./animationManager.js";
/** A class for non-static objects that can be animated using {@link AnimationManager}*/
export class Animated {
    get width() {
        return this.element.width.baseVal.value;
    }
    get height() {
        return this.element.height.baseVal.value;
    }
    /** x (horizontal) coordinate in svg coordinates. */
    get x() {
        return this._x;
    }
    /** y (vertical) coordinate in svg coordinates. */
    get y() {
        return this._y;
    }
    addTimer(callback, timeout) {
        var _a;
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
        this.timer = new Timer(callback, timeout);
    }
    stopTimer() {
        var _a;
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
        this.timer = null;
    }
    pause() {
        var _a, _b;
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.pause();
        (_b = this.animationManager) === null || _b === void 0 ? void 0 : _b.pause(true);
    }
    resume() {
        var _a, _b;
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.resume();
        (_b = this.animationManager) === null || _b === void 0 ? void 0 : _b.resume();
    }
    setAsset(assetName) {
        var _a, _b, _c, _d, _e, _f;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.remove();
        if (assetName === "none") {
            this.animationManager = undefined;
            return;
        }
        this.animationManager = new AnimationManager(assetName, this.size, 12);
        this.element = this.animationManager.element;
        this.element.x.baseVal.value = this._x;
        this.element.y.baseVal.value = this._y;
        switch (assetName) {
            case "hero":
                return (_b = document.getElementById("players")) === null || _b === void 0 ? void 0 : _b.appendChild(this.element);
            case "sheep":
                return (_c = document.getElementById("sheep")) === null || _c === void 0 ? void 0 : _c.appendChild(this.element);
            case "fungus":
                return (_d = document.getElementById("fungi")) === null || _d === void 0 ? void 0 : _d.appendChild(this.element);
            case "cloud":
                return (_e = document.getElementById("clouds")) === null || _e === void 0 ? void 0 : _e.appendChild(this.element);
            default:
                return (_f = document.getElementById("landscape")) === null || _f === void 0 ? void 0 : _f.appendChild(this.element);
        }
    }
    /** Returns a rectangle that represents the creature's position */
    getRect() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };
    }
    constructor(size, x, y, assetName) {
        this.timer = null;
        this._x = x;
        this._y = y;
        this.size = size;
        this.setAsset(assetName);
    }
}
/** A class for all moving creatures */
export default class Creature extends Animated {
    get x() {
        return super.x;
    }
    set x(value) {
        this._x = value;
        this.element.x.baseVal.value = value;
    }
    get y() {
        return super.y;
    }
    set y(value) {
        this._y = value;
        this.element.y.baseVal.value = value;
    }
    /** Returns true if the creature is colliding with the given rectangle */
    isColliding(rect) {
        const thisRect = this.getRect();
        return (thisRect.right > rect.left &&
            thisRect.left < rect.right &&
            thisRect.bottom > rect.top &&
            thisRect.top < rect.bottom);
    }
}
//# sourceMappingURL=base.js.map