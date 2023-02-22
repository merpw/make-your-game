import Cell, { CELL_SIZE, NeighbourCells } from "./cell.js"
import Creature from "./base.js"

const HERO_SPEED = 0.2
const HERO_WIDTH = CELL_SIZE
const HERO_HEIGHT = CELL_SIZE

const SICK_TIME = 5000
const SICK_SPEED = HERO_SPEED / 3

const MAX_FUNGI = 4

const DIAGONAL_SPEED = Math.sqrt(2) / 2

export default class Hero extends Creature<"hero"> {
  public cell!: Cell // there's ! because it's set in spawn()

  /** @remarks It's set on first render */
  private neighbourCells = {} as NeighbourCells

  /** Hero's {@link Way}. */
  public set way({ up, down, left, right }: Way) {
    this._way = { up, down, left, right }
    this.speedX = 0
    this.speedY = 0
    if (up) {
      this.speedY -= this.speed
      this.animationManager?.play("goUp")
    }
    if (down) {
      this.speedY += this.speed
      this.animationManager?.play("goDown")
    }
    if (left) {
      this.speedX -= this.speed
      this.animationManager?.play("goLeft")
    }
    if (right) {
      this.speedX += this.speed
      this.animationManager?.play("goRight")
    }

    if (this.speedX !== 0 && this.speedY !== 0) {
      this.speedX *= DIAGONAL_SPEED
      this.speedY *= DIAGONAL_SPEED
    }
    if (this.speedX === 0 && this.speedY === 0) {
      this.animationManager?.pause()
    } else {
      this.animationManager?.resume()
    }
  }

  private _way: Way = { up: false, down: false, left: false, right: false }
  private speed = HERO_SPEED
  private speedX = 0
  private speedY = 0

  private set isSick(value: boolean) {
    this._isSick = value

    if (value) {
      this.element.style.opacity = "0.5"
      this.speed = SICK_SPEED

      this.addTimer(() => {
        this.isSick = false
      }, SICK_TIME)
    } else {
      this.element.style.opacity = "1"
      this.speed = HERO_SPEED
    }
    this.way = this._way // update speed
  }

  private _isSick = false
  private fungi: {
    cell: Cell
    neighbourCells: Pick<NeighbourCells, "top" | "left" | "right" | "bottom">
  }[] = []

  public render(
    frameTimeDiff: number,
    currentCell: Cell,
    neighbourCells: NeighbourCells
  ) {
    if (this.cell.type === "cloud") {
      this.isSick = true
    }
    this.cell = currentCell
    this.neighbourCells = neighbourCells

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
      if (cell.type === "cloud") {
        this.isSick = true
        return
      }
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

  public placeFungi = () => {
    if (this.fungi.length == MAX_FUNGI || this.cell.type === "fungi") return
    this.cell.type = "fungi"
    this.fungi.push({
      cell: this.cell,
      neighbourCells: {
        top: this.neighbourCells.top,
        bottom: this.neighbourCells.bottom,
        right: this.neighbourCells.right,
        left: this.neighbourCells.left,
      },
    })
  }

  public terminateFungi() {
    const fungus = this.fungi.shift()
    if (!fungus) return
    const { cell, neighbourCells } = fungus
    cell.type = "cloud"
    ;[
      neighbourCells.top,
      neighbourCells.bottom,
      neighbourCells.right,
      neighbourCells.left,
    ].forEach((cell) => {
      if (cell?.type === "empty") cell.type = "cloud"
    })
  }

  /** Spawn the hero in the given cell */
  public spawn(cell: Cell) {
    this.cell = cell
    this.x = cell.col * CELL_SIZE + (CELL_SIZE - HERO_WIDTH) / 2
    this.y = cell.row * CELL_SIZE + (CELL_SIZE - HERO_HEIGHT) / 2
  }

  /**
   * Create a new {@link Hero} in the given cell
   *
   * @param cell - the cell where the hero will be created
   */
  constructor(cell: Cell) {
    super(HERO_HEIGHT, HERO_WIDTH, 0, 0, "hero")
    // x and y will be set in spawn()

    this.element.style.fill = "rebeccapurple"
    this.animationManager?.play("goUp")
    this.spawn(cell)
  }
}
export type Way = {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}
