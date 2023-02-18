import Fung from "./fung.js"
import { svg } from "./game.js"
import { Cell, CELL_SIZE, NeighbourCells } from "./cell.js"

const HERO_SPEED = 0.2
const HERO_WIDTH = CELL_SIZE * 0.75
const HERO_HEIGHT = CELL_SIZE

const DIAGONAL_SPEED = HERO_SPEED * (Math.sqrt(2) / 2)

export default class Hero {
  public element: SVGRectElement

  /** Hero's x coordinate in svg coordinates. */
  public get x(): number {
    return this._x
  }

  public set x(value: number) {
    this.element.x.baseVal.value = value
    this._x = value
  }

  private _x!: number

  /** Hero's y coordinate in svg coordinates. */
  public get y() {
    return this._y
  }

  public set y(value: number) {
    this.element.y.baseVal.value = value
    this._y = value
  }

  private _y!: number

  /** Hero's {@link Way}. */
  public set way({ up, down, left, right }: Way) {
    this.speedX = 0
    this.speedY = 0
    if (up) this.speedY -= HERO_SPEED
    if (down) this.speedY += HERO_SPEED
    if (left) this.speedX -= HERO_SPEED
    if (right) this.speedX += HERO_SPEED

    if (this.speedX !== 0 && this.speedY !== 0) {
      this.speedX *= DIAGONAL_SPEED / HERO_SPEED
      this.speedY *= DIAGONAL_SPEED / HERO_SPEED
    }
  }

  private speedX = 0
  private speedY = 0

  fungi: Fung[] = []

  cloudsXYCoords(cells: Cell[][], x: number, y: number) {
    // TODO: refactor this
    const fungCellX = Math.floor((x + CELL_SIZE / 2) / CELL_SIZE)
    const fungCellY = Math.floor((y + CELL_SIZE / 2) / CELL_SIZE)

    const cloudsCells = {
      right: cells[fungCellY][fungCellX + 1],
      left: cells[fungCellY][fungCellX - 1],
      bottom: cells[fungCellY + 1][fungCellX],
      top: cells[fungCellY - 1][fungCellX],
    }

    // collect new clouds coordinates, for 5 clouds include: center, top, bottom, left, right clouds
    const cloudsCoords = []
    // center
    cloudsCoords.push({ x: x, y: y })
    // top
    if (cloudsCells.top.type === "empty") {
      cloudsCoords.push({ x: x, y: y - CELL_SIZE / 2 }) // entermediate cloud, to smooth the borders
      cloudsCoords.push({ x: x, y: y - CELL_SIZE })
    }
    // bottom
    if (cloudsCells.bottom.type === "empty") {
      cloudsCoords.push({ x: x, y: y + CELL_SIZE / 2 }) // entermediate cloud, to smooth the borders
      cloudsCoords.push({ x: x, y: y + CELL_SIZE })
    }
    // left
    if (cloudsCells.left.type === "empty") {
      cloudsCoords.push({ x: x - CELL_SIZE / 2, y: y }) // entermediate cloud, to smooth the borders
      cloudsCoords.push({ x: x - CELL_SIZE, y: y })
    }
    // right
    if (cloudsCells.right.type === "empty") {
      cloudsCoords.push({ x: x + CELL_SIZE / 2, y: y }) // entermediate cloud, to smooth the borders
      cloudsCoords.push({ x: x + CELL_SIZE, y: y })
    }
    return cloudsCoords
  }

  render(frameTimeDiff: number, neighbourCells: NeighbourCells) {
    if (this.speedX === 0 && this.speedY === 0) return

    const dx = this.speedX * frameTimeDiff
    const dy = this.speedY * frameTimeDiff

    let newX = this.x + dx
    let newY = this.y + dy

    const collisions = Object.entries(neighbourCells).filter(
      ([, cell]) =>
        cell &&
        cell.type !== "empty" &&
        this.isColliding({
          left: cell.x,
          right: cell.x + CELL_SIZE,
          top: cell.y,
          bottom: cell.y + CELL_SIZE,
        })
    ) as [keyof typeof neighbourCells, Cell][]

    const basicCollisions = collisions.filter(
      ([way]) =>
        way === "right" || way === "left" || way === "bottom" || way === "top"
    )

    const diagonalCollision = collisions.find(
      ([way]) =>
        way === "bottomRight" ||
        way === "bottomLeft" ||
        way === "topRight" ||
        way === "topLeft"
    )

    basicCollisions.forEach(([way, cell]) => {
      switch (way) {
        case "right":
          newX = cell.x - HERO_WIDTH
          break
        case "left":
          newX = cell.x + CELL_SIZE
          break
        case "bottom":
          newY = cell.y - HERO_HEIGHT
          break
        case "top":
          newY = cell.y + CELL_SIZE
          break
      }
    })

    if (basicCollisions.length === 0 && diagonalCollision) {
      const [way] = diagonalCollision
      switch (way) {
        case "bottomRight":
          if (dx > 0) newY -= dx
          if (dy > 0) newX -= dy
          break
        case "bottomLeft":
          if (dx < 0) newY += dx
          if (dy > 0) newX += dy
          break
        case "topRight":
          if (dx > 0) newY += dx
          if (dy < 0) newX += dy
          break
        case "topLeft":
          if (dx < 0) newY -= dx
          if (dy < 0) newX -= dy
          break
      }
    }

    this.x = newX
    this.y = newY
  }

  placeFungi = () => {
    if (this.fungi.length < 4) {
      // TODO HARDCODED constant for the max number of fungi
      const fungibox = svg.querySelector("#fungi") as SVGGElement
      // determine the position of the new fung, it should be in the center of the cell
      const nearCellCenterX =
        Math.floor((this.x + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE
      const nearCellCenterY =
        Math.floor((this.y + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE
      if (
        !this.fungi.some(
          (fung) =>
            fung.element.x.baseVal.value === nearCellCenterX &&
            fung.element.y.baseVal.value === nearCellCenterY
        )
      ) {
        // the cell is not already occupied by a fung
        const fung = new Fung(nearCellCenterX, nearCellCenterY)
        this.fungi.push(fung)
        fungibox.appendChild(fung.element)
      }
    }
  }

  terminateFungi() {
    const clouds = svg.querySelector("#clouds") as SVGGElement
    this.fungi.forEach((fung) => {
      const x = fung.element.x.baseVal.value
      const y = fung.element.y.baseVal.value
      fung.element.remove()
      // const cloudsXY = this.cloudsXYCoords(board.cells, x, y)
      // cloudsXY.forEach((c) => {
      //   const cloud = new Cloud(c.x, c.y)
      //   clouds.appendChild(cloud.element)
      //   cloud.boom()
      // })
      // TODO: change to prevent private board.cells usage
    })
    this.fungi = []
  }

  /** Spawn the hero in the given cell */
  spawn = (cell: Cell) => {
    this.x = cell.col * CELL_SIZE + (CELL_SIZE - HERO_WIDTH) / 2
    this.y = cell.row * CELL_SIZE + (CELL_SIZE - HERO_HEIGHT) / 2
  }

  /**
   * Create a new {@link Hero} in the given cell
   *
   * @param cell - the cell where the hero will be created
   */
  constructor(cell: Cell) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
    this.element.width.baseVal.value = HERO_WIDTH
    this.element.height.baseVal.value = HERO_HEIGHT

    this.element.style.fill = "rebeccapurple"
    this.element.id = "mainHero"

    this.spawn(cell)
  }

  isColliding(rect: Rect) {
    const heroRect = {
      left: this.x,
      right: this.x + HERO_WIDTH,
      top: this.y,
      bottom: this.y + HERO_HEIGHT,
    }
    return (
      rect.left < heroRect.right &&
      rect.right > heroRect.left &&
      rect.top < heroRect.bottom &&
      rect.bottom > heroRect.top
    )
  }
}
export type Way = {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

type Rect = {
  left: number
  right: number
  top: number
  bottom: number
}
