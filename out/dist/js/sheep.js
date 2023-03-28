import { CELL_SIZE } from "./cell.js"
import Creature from "./base.js"
const SHEEP_SIZE = CELL_SIZE
const SHEEP_SPEED = 0.1
const DEMON_SPEED = 0.12
const GENETICS = 0.15 // speed is +-15% random from base speeds
const BACK_PROBABILITY = 0.1 // probability to choose back direction is 10% of probability to choose any other directions
const oppositeDirections = {
  right: "left",
  bottom: "top",
  left: "right",
  top: "bottom",
}
export default class Sheep extends Creature {
  get demonized() {
    return this._demonized
  }
  set demonized(value) {
    this.speed = (value ? DEMON_SPEED : SHEEP_SPEED) * this.genetics
    this._demonized = value
    this.setAnimation(this.direction)
    Sheep.onDemonization(this)
  }
  setAnimation(direction) {
    var _a
    const Direction =
      direction === "bottom"
        ? "Down"
        : direction === "top"
        ? "Up"
        : direction === "left"
        ? "Left"
        : "Right"
    ;(_a = this.animationManager) === null || _a === void 0
      ? void 0
      : _a.play(this.demonized ? `go${Direction}Demonized` : `go${Direction}`)
  }
  get direction() {
    return this._direction
  }
  set direction(value) {
    this.setAnimation(value)
    this._direction = value
    this.x = this.fromCell.x
    this.y = this.fromCell.y
    switch (value) {
      case "left":
      case "right":
        this.y += CELL_SIZE - this.height
        break
      case "bottom":
      case "top":
        this.x += (CELL_SIZE - this.width) / 2
    }
  }
  get targetCell() {
    return this._targetCell
  }
  set targetCell(value) {
    this.fromCell = this.targetCell || this.fromCell
    this._targetCell = value
  }
  render(frameTimeDiff) {
    if (!this.targetCell) return
    switch (this.direction) {
      case "right": {
        this.x += this.speed * frameTimeDiff
        if (this.x >= this.targetCell.x) {
          this.x = this.targetCell.x
          this.targetCell = null
        }
        break
      }
      case "bottom": {
        this.y += this.speed * frameTimeDiff
        if (this.y >= this.targetCell.y) {
          this.y = this.targetCell.y
          this.targetCell = null
        }
        break
      }
      case "left": {
        this.x -= this.speed * frameTimeDiff
        if (this.x <= this.targetCell.x) {
          this.x = this.targetCell.x
          this.targetCell = null
        }
        break
      }
      case "top": {
        this.y -= this.speed * frameTimeDiff
        if (this.y <= this.targetCell.y) {
          this.y = this.targetCell.y
          this.targetCell = null
        }
        break
      }
    }
  }
  /**
   * Sets random {@link direction} and {@link targetCell} from one of the available directions
   * @param neighbours - object with {@link NeighbourCells| neighbour cells}
   */
  setRandomDirection(neighbours) {
    const availableDirections = Object.entries(neighbours)
      .filter(
        ([way, cell]) =>
          cell &&
          (cell.type === "empty" ||
            (!this.demonized && cell.type === "bush")) &&
          (way === "right" ||
            way === "bottom" ||
            way === "left" ||
            way === "top")
      )
      .map(([way, cell]) => [way, cell])
    const backDirection = oppositeDirections[this.direction]
    if (availableDirections.length === 0) {
      this.targetCell = null
      this.direction = backDirection
      // TODO: maybe add some animation for locked sheep
      return
    }
    availableDirections.sort(() => Math.random() - 0.5)
    if (!this.demonized) {
      // sheep prefer bushes, they are tasty
      availableDirections.sort(([, cell]) => (cell.type === "bush" ? -1 : 1))
    }
    let [direction, targetCell] = availableDirections[0]
    if (
      direction === backDirection &&
      availableDirections.length > 1 &&
      Math.random() - BACK_PROBABILITY >= 0
    ) {
      // if chosen randomly direction is back, think one more time
      // with probability 1-BACK_PROBABILITY choose another direction
      ;[direction, targetCell] = availableDirections[1]
    }
    this.direction = direction
    this.targetCell = targetCell
  }
  constructor(cell, neighbours, demonized = true) {
    super(SHEEP_SIZE, cell.x, cell.y, "sheep")
    this.genetics = 1 - GENETICS + Math.random() * GENETICS * 2
    // random value between 1 - GENETICS and 1 + GENETICS
    this.fromCell = cell
    this._demonized = demonized
    this.setRandomDirection(neighbours)
    this.demonized = demonized
  }
}
/** function to call when {@link demonized} state  */
Sheep.onDemonization = () => void 0
//# sourceMappingURL=sheep.js.map
