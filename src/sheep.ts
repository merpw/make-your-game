import Cell, { CELL_SIZE, NeighbourCells } from "./cell.js"
import Creature from "./base.js"

const SHEEP_SIZE = CELL_SIZE
const SHEEP_SPEED = 0.1
const DEMON_SPEED = 0.12

const GENETICS = 0.15 // +-15% speed genetics

const BACK_PROBABILITY = 0.1
// 10% chance to go back

type Direction = ("right" | "bottom" | "left" | "top") & keyof NeighbourCells

const oppositeDirections: Record<Direction, Direction> = {
  right: "left",
  bottom: "top",
  left: "right",
  top: "bottom",
} as const

export default class Sheep extends Creature<"sheep"> {
  public get demonized() {
    return this._demonized
  }

  public set demonized(value: boolean) {
    this.speed = (value ? DEMON_SPEED : SHEEP_SPEED) * this.genetics
    this._demonized = value
  }

  private _demonized!: boolean
  private direction!: Direction // there's ! because it's set in constructor using setRandomDirection()
  public fromCell: Cell

  private readonly genetics: number

  public get targetCell() {
    return this._targetCell
  }

  public set targetCell(value: Cell | null) {
    this.fromCell = this.targetCell || this.fromCell
    this._targetCell = value
  }

  private _targetCell!: Cell | null

  public speed = SHEEP_SPEED

  render(frameTimeDiff: number) {
    if (this.fromCell.type === "cloud" || this.targetCell?.type === "cloud") {
      this.demonized = false
    }
    if (!this.targetCell) return

    switch (this.direction) {
      case "right":
        this.x += this.speed * frameTimeDiff
        if (this.x >= this.targetCell.x) {
          this.x = this.targetCell.x
          this.targetCell = null
        }
        this.animationManager?.play(
          this.demonized ? "goRightDemonized" : "goRight"
        )
        break
      case "bottom":
        this.y += this.speed * frameTimeDiff
        if (this.y >= this.targetCell.y) {
          this.y = this.targetCell.y
          this.targetCell = null
        }
        this.animationManager?.play(
          this.demonized ? "goDownDemonized" : "goDown"
        )
        break
      case "left":
        this.x -= this.speed * frameTimeDiff
        if (this.x <= this.targetCell.x) {
          this.x = this.targetCell.x
          this.targetCell = null
        }
        this.animationManager?.play(
          this.demonized ? "goLeftDemonized" : "goLeft"
        )
        break
      case "top":
        this.y -= this.speed * frameTimeDiff
        if (this.y <= this.targetCell.y) {
          this.y = this.targetCell.y
          this.targetCell = null
        }
        this.animationManager?.play(this.demonized ? "goUpDemonized" : "goUp")
    }
  }

  /**
   * Sets random {@link direction} and {@link targetCell} from one of the available directions
   * @param neighbours - object with {@link NeighbourCells| neighbour cells}
   */
  setRandomDirection(neighbours: NeighbourCells) {
    const backDirection = oppositeDirections[this.direction]
    const backCell = neighbours[backDirection]

    if (
      backCell?.type === "empty" &&
      Math.random() - (1 - BACK_PROBABILITY) >= 0
    ) {
      this.direction = oppositeDirections[this.direction]
      this.targetCell = neighbours[this.direction]
      return
    }

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
      .map(([way, cell]) => [way, cell] as [Direction, Cell])

    availableDirections.sort(() => Math.random() - 0.5)

    if (availableDirections.length === 0) {
      this.targetCell = null
      this.direction = backDirection
      // TODO: maybe add some animation for locked sheep
      return
    }

    if (!this.demonized) {
      // sheep prefer bushes, they are tasty
      availableDirections.sort(([, cell]) => (cell.type === "bush" ? -1 : 1))
    }

    const [direction, targetCell] = availableDirections.find(
      ([way]) => way !== oppositeDirections[this.direction]
    ) || [backDirection, backCell]

    this.direction = direction
    this.targetCell = targetCell
  }

  constructor(cell: Cell, neighbours: NeighbourCells, demonized = true) {
    super(SHEEP_SIZE, cell.x, cell.y, "sheep")
    this.genetics = 1 - GENETICS + Math.random() / (1 / (GENETICS * 2))
    // TODO: simplify this.
    // isnt it just 1 - GENETICS + Math.random() * GENETICS * 2 ?
    // and 1 - GENETICS + GENETICS * 2 * Math.random() ?
    // and 1 - (1 - 2 * Math.random()) * GENETICS ?
    // and 1 + (2 * Math.random() - 1) * GENETICS ?
    // Division potentially can be not safe. but for this language it's ok.
    // The worst potential case is when GENETICS is infinity and Math.random() is 0, it can produce NaN.
    // > 1-1/0+0/0
    // NaN
    // Readability is important too.

    this.demonized = demonized

    this.fromCell = cell
    this.setRandomDirection(neighbours)
  }
}
