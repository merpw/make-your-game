import Cloud from "./cloud.js"
import Fung from "./fung.js"
import { svg, board } from "./game.js"
import KeyState from "./keys.js"
import { Cell, CELL_SIZE, NeighbourCells } from "./cell.js"

const HERO_SPEED = 0.2
const HERO_WIDTH = CELL_SIZE * 0.75
const HERO_HEIGHT = CELL_SIZE

const DIAGONAL_SPEED = HERO_SPEED * (Math.sqrt(2) / 2)

export default class Hero {
  element: SVGRectElement
  /**
   * Hero's x coordinate in svg coordinates.
   */
  x: number
  /**
   * Hero's y coordinate in svg coordinates.
   */
  y: number

  speedX = 0
  speedY = 0

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
    const heroRect = {
      left: this.x,
      right: this.x + HERO_WIDTH,
      top: this.y,
      bottom: this.y + HERO_HEIGHT,
    }

    const dx = this.speedX * frameTimeDiff
    const dy = this.speedY * frameTimeDiff
    this.x += dx
    this.y += dy

    const collisions = Object.entries(neighbourCells).filter(
      ([, cell]) =>
        cell &&
        cell.type !== "empty" &&
        isColliding(heroRect, {
          left: cell.element.x.baseVal.value,
          right: cell.element.x.baseVal.value + CELL_SIZE,
          top: cell.element.y.baseVal.value,
          bottom: cell.element.y.baseVal.value + CELL_SIZE,
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
          this.x = cell.element.x.baseVal.value - HERO_WIDTH
          break
        case "left":
          this.x = cell.element.x.baseVal.value + CELL_SIZE
          break
        case "bottom":
          this.y = cell.element.y.baseVal.value - HERO_HEIGHT
          break
        case "top":
          this.y = cell.element.y.baseVal.value + CELL_SIZE
          break
      }
    })

    if (basicCollisions.length === 0 && diagonalCollision) {
      const [way] = diagonalCollision
      switch (way) {
        case "bottomRight":
          if (dx > 0) this.y -= dx
          if (dy > 0) this.x -= dy
          break
        case "bottomLeft":
          if (dx < 0) this.y += dx
          if (dy > 0) this.x += dy
          break
        case "topRight":
          if (dx > 0) this.y += dx
          if (dy < 0) this.x += dy
          break
        case "topLeft":
          if (dx < 0) this.y -= dx
          if (dy < 0) this.x -= dy
          break
      }
    }

    this.element.x.baseVal.value = this.x
    this.element.y.baseVal.value = this.y
  }

  checkKeys() {
    // TODO add an automatic correction of the player's position directed to the center axis of the row/column, to force the player to move close to the center of cells
    this.speedX = 0
    this.speedY = 0
    if (KeyState.d || KeyState.ArrowRight) this.speedX += HERO_SPEED
    if (KeyState.a || KeyState.ArrowLeft) this.speedX += -HERO_SPEED
    if (KeyState.w || KeyState.ArrowUp) this.speedY += -HERO_SPEED
    if (KeyState.s || KeyState.ArrowDown) this.speedY += HERO_SPEED

    if (this.speedX !== 0 && this.speedY !== 0) {
      this.speedX *= DIAGONAL_SPEED / HERO_SPEED
      this.speedY *= DIAGONAL_SPEED / HERO_SPEED
    }

    // TODO fungi section
    if (KeyState.o) {
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
    } // TODO mount the fung

    if (KeyState.p) {
      // remove all fungi
      const clouds = svg.querySelector("#clouds") as SVGGElement
      this.fungi.forEach((fung) => {
        const x = fung.element.x.baseVal.value
        const y = fung.element.y.baseVal.value
        fung.element.remove()
        const cloudsXY = this.cloudsXYCoords(board.cells, x, y)
        cloudsXY.forEach((c) => {
          const cloud = new Cloud(c.x, c.y)
          clouds.appendChild(cloud.element)
          cloud.boom()
        })
      })
      this.fungi = []
    } // TODO terminate fungi
  }

  /**
   * Create a new Hero in the given cell
   *
   * @param cell the cell where the hero will be created
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

    this.x = cell.col * CELL_SIZE + (CELL_SIZE - HERO_WIDTH) / 2
    this.y = cell.row * CELL_SIZE + (CELL_SIZE - HERO_HEIGHT) / 2
    this.element.x.baseVal.value = this.x
    this.element.y.baseVal.value = this.y
  }
}

type Rect = {
  left: number
  right: number
  top: number
  bottom: number
}
const isColliding = (rect1: Rect, rect2: Rect) => {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  )
}
