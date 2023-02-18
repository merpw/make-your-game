import { Cell, CELL_SIZE, NeighbourCells } from "./cell.js"

const SHEEP_SIZE = CELL_SIZE
const SHEEP_SPEED = 0.1

const BACK_PROBABILITY = 0.1
// 10% chance to go back

type Direction = ("right" | "bottom" | "left" | "top") & keyof NeighbourCells

const oppositeDirections: Record<Direction, Direction> = {
  right: "left",
  bottom: "top",
  left: "right",
  top: "bottom",
}
export default class Sheep {
  public element: SVGRectElement

  /** x coordinate in svg coordinates. */
  x: number
  /** y coordinate in svg coordinates. */
  y: number
  demonized: boolean
  direction!: Direction // there's ! because it's set in constructor using setRandomDirection()
  targetCell!: Cell | null // there's ! because it's set in constructor using setRandomDirection()

  render(frameTimeDiff: number) {
    if (!this.targetCell) return

    switch (this.direction) {
      case "right":
        this.x += SHEEP_SPEED * frameTimeDiff
        if (this.x >= this.targetCell.x) {
          this.x = this.targetCell.x
          this.targetCell = null
        }
        break
      case "bottom":
        this.y += SHEEP_SPEED * frameTimeDiff
        if (this.y >= this.targetCell.y) {
          this.y = this.targetCell.y
          this.targetCell = null
        }
        break
      case "left":
        this.x -= SHEEP_SPEED * frameTimeDiff
        if (this.x <= this.targetCell.x) {
          this.x = this.targetCell.x
          this.targetCell = null
        }
        break
      case "top":
        this.y -= SHEEP_SPEED * frameTimeDiff
        if (this.y <= this.targetCell.y) {
          this.y = this.targetCell.y
          this.targetCell = null
        }
    }

    this.element.x.baseVal.value = this.x
    this.element.y.baseVal.value = this.y
  }

  /**
   * Sets random {@link direction} and {@link targetCell} from one of the available directions
   * @param neighbours - object with {@link NeighbourCells| neighbour cells}
   */
  setRandomDirection(neighbours: NeighbourCells) {
    if (this.direction && Math.random() - (1 - BACK_PROBABILITY) >= 0) {
      this.direction = oppositeDirections[this.direction]
      this.targetCell = neighbours[this.direction]
      return
    }

    const availableDirections = Object.entries(neighbours)
      .filter(
        ([way, cell]) =>
          cell &&
          cell.type !== "wall" &&
          (this.demonized ? cell.type !== "bush" : true) &&
          (way === "right" ||
            way === "bottom" ||
            way === "left" ||
            way === "top")
      )
      .map(([way, cell]) => [way, cell] as [Direction, Cell])

    availableDirections.sort(() => Math.random() - 0.5)

    const [direction, targetCell] =
      availableDirections.find(
        ([way]) => way !== oppositeDirections[this.direction]
      ) || availableDirections[0]

    this.direction = direction
    this.targetCell = targetCell
  }

  constructor(cell: Cell, neighbours: NeighbourCells, demonized = true) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
    this.element.height.baseVal.value = SHEEP_SIZE
    this.element.width.baseVal.value = SHEEP_SIZE

    this.demonized = demonized
    if (this.demonized) {
      this.element.style.fill = "red"
    } else {
      this.element.style.fill = "orange"
    }

    this.x = cell.x
    this.y = cell.y

    this.element.id = "sheep"
    this.element.x.baseVal.value = this.x
    this.element.y.baseVal.value = this.y

    this.setRandomDirection(neighbours)
  }
}
