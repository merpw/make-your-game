import { Animated } from "./base.js"
import AnimationManager from "./animationManager.js"
export const CELL_SIZE = 5
export const PORTAL_EXIT_TIME = 1000
const SPORE_CLOUD_TIME = 300
const PLAYER_CLOUD_TIME = 300
const CELL_CODES = {
  0: "empty",
  1: "wall",
  2: "bush",
}
export default class Cell extends Animated {
  get type() {
    return this._type
  }
  set type(value) {
    var _a, _b, _c, _d, _e, _f, _g
    this._type = value
    this.stopTimer()
    if (value === "empty") {
      if (!this.secret) {
        this.setAsset("none")
        return
      }
      if (this.secret === "portal") {
        this.setAsset("portal")
        ;(_a = this.animationManager) === null || _a === void 0
          ? void 0
          : _a.play("off")
        return
      }
      if (this.secret === "potion") {
        this.setAsset("potion")
        ;(_b = this.animationManager) === null || _b === void 0
          ? void 0
          : _b.play("stand")
        return
      }
      return
    }
    if (value === "wall" || value === "bush") {
      // static
      this.setAsset(value)
      return
    }
    if (value === "spawn") {
      this.setAsset("cloud")
      ;(_c = this.animationManager) === null || _c === void 0
        ? void 0
        : _c.play("blue")
      this.addTimer(() => {
        this.type = "empty"
      }, PLAYER_CLOUD_TIME)
      return
    }
    if (value === "cloud" || value === "portalActivated") {
      let bg
      if (this.secret) {
        // create a copy of a secret to show under the cloud
        bg = this.element.cloneNode(true)
        ;(_d = document.getElementById("landscape")) === null || _d === void 0
          ? void 0
          : _d.appendChild(bg)
      }
      this.setAsset("cloud")
      ;(_e = this.animationManager) === null || _e === void 0
        ? void 0
        : _e.play(value === "cloud" ? "pink" : "blue")
      this.addTimer(
        () => {
          this.type = value === "cloud" ? "empty" : "portal"
          bg === null || bg === void 0 ? void 0 : bg.remove()
        },
        value === "cloud" ? SPORE_CLOUD_TIME : PORTAL_EXIT_TIME
      )
      return
    }
    if (value === "fungus") {
      this.setAsset("fungus")
      ;(_f = this.animationManager) === null || _f === void 0
        ? void 0
        : _f.play("stand")
      return
    }
    if (value === "portal") {
      this.setAsset("portal")
      ;(_g = this.animationManager) === null || _g === void 0
        ? void 0
        : _g.play("on")
      return
    }
  }
  constructor(typeCode, col, row) {
    var _a
    super(CELL_SIZE, col * CELL_SIZE, row * CELL_SIZE, "none")
    const { element: grass } = new AnimationManager("grass", CELL_SIZE, 0)
    grass.x.baseVal.value = col * CELL_SIZE
    grass.y.baseVal.value = row * CELL_SIZE
    ;(_a = document.getElementById("landscape")) === null || _a === void 0
      ? void 0
      : _a.appendChild(grass)
    this.type = CELL_CODES[typeCode]
    this.col = col
    this.row = row
  }
}
//# sourceMappingURL=cell.js.map
