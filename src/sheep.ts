import { Cell, CELL_SIZE } from "./cell.js"

const SHEEP_SIZE = CELL_SIZE
const SHEEP_SPEED = 0.1

export default class Sheep {
  element: SVGRectElement
  x: number
  y: number
  demonized: boolean

  /**
   * 1 - positive X, 2 - positive Y, 3 - negative X, 4 - negative Y
   */
  direction: 1 | 2 | 3 | 4

  render(frameTimeDiff: number, cells: Cell[][]) {
    this.move(frameTimeDiff, cells)
    this.element.x.baseVal.value = this.x
    this.element.y.baseVal.value = this.y
  }

  /** position of sheep in cell, along x axis , at the beginning of moving*/
  startX = 0
  /** position of sheep in cell, along y axis , at the beginning of moving*/
  startY = 0
  /** distance to move along x axis*/
  dx = 0
  /** distance to move along y axis*/
  dy = 0
  /** time elapsed from the previous moment of moving*/
  dt = 0
  /** time to move between two cells*/
  t = 0

  /** moving along x axis*/
  private moveX = () => (this.x = this.startX + (this.dx * this.dt) / this.t)

  /** moving along y axis*/
  private moveY = () => (this.y = this.startY + (this.dy * this.dt) / this.t)

  // TODO: with high chance can be problems at least with speed of sheep
  /**
   * move sheep between two points(cell centers)
   * @param  dt [s] - time elapsed from previous moment. 0 = start new process
   * @param  finishX - coordinate of end moving, along x axis
   * @param  finishY - coordinate of end moving, along y axis
   */
  move(dt: number, cells: Cell[][], finishX = this.x, finishY = this.y) {
    if (dt > 0 && this.dt < this.t) {
      //continue previous move
      this.dt += dt
      this.moveX()
      this.moveY()
    } else if (dt === 0) {
      //abort not completion move and/or start new move
      this.dt = 0
      this.startX = this.x
      this.startY = this.y
      this.dx = finishX - this.x
      this.dy = finishY - this.y
      this.t = Math.sqrt(this.dx * this.dx + this.dy * this.dy) / SHEEP_SPEED
    } else {
      //previous move completed, time to start new move. Our sheep is not staying in one place
      this.moveToNextCell(cells)
    }
  }

  /**analize the cells available for move to the next position, and execute new move */
  moveToNextCell(cells: Cell[][]) {
    const sheepCellX = Math.floor((this.x + SHEEP_SIZE / 2) / CELL_SIZE)
    const sheepCellY = Math.floor((this.y + SHEEP_SIZE / 2) / CELL_SIZE)

    this.fixDisplacementBeforeNewMove(sheepCellX, sheepCellY)

    const sheepCells = {
      right: cells[sheepCellY][sheepCellX + 1],
      left: cells[sheepCellY][sheepCellX - 1],
      bottom: cells[sheepCellY + 1][sheepCellX],
      top: cells[sheepCellY - 1][sheepCellX],
    }

    const newDirection = this.getNewRandomDirection(sheepCells)

    switch (newDirection) {
      case 1:
        this.move(0, cells, this.x + CELL_SIZE, this.y)
        break
      case 2:
        this.move(0, cells, this.x, this.y + CELL_SIZE)
        break
      case 3:
        this.move(0, cells, this.x - CELL_SIZE, this.y)
        break
      case 4:
        this.move(0, cells, this.x, this.y - CELL_SIZE)
        break
      default:
        break
    }
  }

  fixDisplacementBeforeNewMove(sheepCellX: number, sheepCellY: number) {
    this.x = sheepCellX * CELL_SIZE
    this.y = sheepCellY * CELL_SIZE
  }

  /**creates array and fill it using
   *  @param n number
   *  @param multiplier length of the array
   *  */
  bigChanceX(n: number, multiplier: number) {
    // create array of n with random length
    return Array.from({ length: multiplier }, () => n)
  }

  private majorMultiplier = 40 // increase chances to move in some major direction
  private minorMultiplier = 20 // increase chances to move in some direction
  private backMultiplier = 1 // not increase chances to move back(but still possible), so it is 1
  /**get new random direction for sheep, but try to decrease chances to move back */
  getNewRandomDirection(sheepCells: {
    right: Cell
    left: Cell
    bottom: Cell
    top: Cell
  }) {
    /**array of directions available for move */
    let adi: number[] = []
    const obstacles = this.demonized ? ["wall", "bush"] : ["wall"]
    let x1, x2, x3, x4: number // right, bottom, left, top coefficients

    // forcing sheep to move more by sides if possible

    if (this.direction === 1) {
      //right, so increase top and bottom chances
      x1 = this.minorMultiplier
      x2 = this.majorMultiplier
      x3 = this.backMultiplier
      x4 = this.majorMultiplier
    } else if (this.direction === 2) {
      //bottom, so increase right and left chances
      x1 = this.majorMultiplier
      x2 = this.minorMultiplier
      x3 = this.majorMultiplier
      x4 = this.backMultiplier
    } else if (this.direction === 3) {
      //left, so increase top and bottom chances
      x1 = this.backMultiplier
      x2 = this.majorMultiplier
      x3 = this.minorMultiplier
      x4 = this.majorMultiplier
    } else if (this.direction === 4) {
      //top, so increase right and left chances
      x1 = this.majorMultiplier
      x2 = this.backMultiplier
      x3 = this.majorMultiplier
      x4 = this.minorMultiplier
    } else {
      //no direction, so equal chances
      x1 = 1
      x2 = 1
      x3 = 1
      x4 = 1
    }

    // add directions to array adi, if they are not obstacles

    if (obstacles.indexOf(sheepCells.right.type) === -1) {
      adi = adi.concat(this.bigChanceX(1, x1)) //more chance to do not go back
    }
    if (obstacles.indexOf(sheepCells.bottom.type) === -1) {
      adi = adi.concat(this.bigChanceX(2, x2))
    }
    if (obstacles.indexOf(sheepCells.left.type) === -1) {
      adi = adi.concat(this.bigChanceX(3, x3))
    }
    if (obstacles.indexOf(sheepCells.top.type) === -1) {
      adi = adi.concat(this.bigChanceX(4, x4))
    }

    if (adi.length === 0) {
      //no way to move
      return 0
    }
    // this.shuffleArray(adi)
    // get random direction from available directions
    const rd = adi[Math.floor(Math.random() * adi.length)]
    this.direction = rd as 1 | 2 | 3 | 4
    return rd
  }

  shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  /** @param direction 1 (positive X), 2 (positive Y), 3 (negative X), 4 (negative Y) */
  constructor(x: number, y: number, demonized: boolean, direction: number) {
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

    this.x = x
    this.y = y

    this.element.id = "sheep"
    this.element.x.baseVal.value = x * CELL_SIZE
    this.element.y.baseVal.value = y * CELL_SIZE

    this.direction = direction as 1 | 2 | 3 | 4
  }
}
