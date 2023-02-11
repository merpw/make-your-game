import { Cell, CELL_SIZE } from "./board.js"
// import Cloud from "./cloud.js"
// import Fung from "./fung.js"
// import { svg, board } from "./game.js"
// import KeyState from "./keys.js"

const SHEEP_SPEED = 0.4
const SHEEP_SIZE = 8
// const DIAGONAL_SPEED = SHEEP_SPEED * (Math.sqrt(2) / 2)

export default class Sheep {
  element: SVGRectElement
  x: number
  y: number
  demonized: boolean
  width = SHEEP_SIZE
  height = SHEEP_SIZE

  /**direction of sheep moving. 1 - positive X, 2 - positive Y, 3 - negative X, 4 - negative Y */
  direction = 1

  speedX = 0
  speedY = 0

  render(frameTimeDiff: number, cells: Cell[][]) {
    // const sheepCellX = Math.floor((this.x + this.height / 2) / CELL_SIZE)
    // const sheepCellY = Math.floor((this.y + this.width / 2) / CELL_SIZE)

    // const sheepCells = {
    //   right: cells[sheepCellY][sheepCellX + 1],
    //   left: cells[sheepCellY][sheepCellX - 1],
    //   bottom: cells[sheepCellY + 1][sheepCellX],
    //   top: cells[sheepCellY - 1][sheepCellX],
    //   bottomRight: cells[sheepCellY + 1][sheepCellX + 1],
    //   topLeft: cells[sheepCellY - 1][sheepCellX - 1],
    //   topRight: cells[sheepCellY - 1][sheepCellX + 1],
    //   bottomLeft: cells[sheepCellY + 1][sheepCellX - 1],
    // }

    // const sheepRect = {
    //   top: this.y,
    //   bottom: this.y + this.height,
    //   left: this.x,
    //   right: this.x + this.width,
    // }

    // this.x += this.speedX * frameTimeDiff
    // this.y += this.speedY * frameTimeDiff

    this.move(frameTimeDiff, cells)

    this.element.x.baseVal.value = this.x
    this.element.y.baseVal.value = this.y
  }

  scx = 0
  scy = 0
  scx0 = 0
  scy0 = 0
  sdx = 0
  sdy = 0
  dt = 0
  t = 0
  cx = 0
  cy = 0
  scx1 = 0
  scy1 = 0

  /** character moving along x axis*/
  private moveX = () => (this.x = this.scx0 + (this.sdx * this.dt) / this.t)

  /** character moving along y axis*/
  private moveY = () => (this.y = this.scy0 + (this.sdy * this.dt) / this.t)

  // TODO: with high chance can be problems at least with speed of sheep
  /**
   * move sheep between two points(cell centers)
   * OLD DESCRIPTION FROM MY OTHER PROJECT CODE
   * character moving along court
   * @param	dt [s] - time elapsed from previous moment. 0 = start new process
   * @param	scx1 - real coordinate of end moving, along x axis
   * @param	scy1 - real coordinate of end moving, along y axis
   */
  move(dt: number, cells: Cell[][], scx1 = this.x, scy1 = this.y) {
    if (dt > 0 && this.dt < this.t) {
      //continue previous move
      this.dt += dt
      this.moveX()
      this.moveY()
    } else if (dt === 0) {
      //abort not completion move and/or start new move
      this.dt = 0
      this.scx0 = this.x
      this.scy0 = this.y
      this.scx1 = scx1
      this.scy1 = scy1
      this.sdx = this.scx1 - this.scx0
      this.sdy = this.scy1 - this.scy0
      this.t =
        Math.sqrt(this.sdx * this.sdx + this.sdy * this.sdy) / SHEEP_SPEED
    } else {
      //previous move completed, time to start new move. Our sheep is not staying in one place
      this.moveToNextCell(cells)
    }
  }

  /**analize the cells available for move to the next position, and execute new move */
  moveToNextCell(cells: Cell[][]) {
    const sheepCellX = Math.floor((this.x + this.height / 2) / CELL_SIZE)
    const sheepCellY = Math.floor((this.y + this.width / 2) / CELL_SIZE)

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

  /**get new random direction for sheep, but try to decrease chances to move back */
  getNewRandomDirection(sheepCells: {
    right: Cell
    left: Cell
    bottom: Cell
    top: Cell
  }) {
    const availableDirections = []
    const obstacles = this.demonized ? ["wall", "bush"] : ["wall"]
    if (obstacles.indexOf(sheepCells.right.type) === -1) {
      availableDirections.push(this.direction === 3 ? 1 : 1, 1, 1, 1) //more chance to do not go back
    }
    if (obstacles.indexOf(sheepCells.left.type) === -1) {
      availableDirections.push(this.direction === 1 ? 3 : 3, 3, 3, 3) //more chance to do not go back
    }
    if (obstacles.indexOf(sheepCells.bottom.type) === -1) {
      availableDirections.push(this.direction === 4 ? 2 : 2, 2, 2, 2) //more chance to do not go back
    }
    if (obstacles.indexOf(sheepCells.top.type) === -1) {
      availableDirections.push(this.direction === 2 ? 4 : 4, 4, 4, 4) //more chance to do not go back
    }

    if (availableDirections.length === 0) {
      //no way to move
      return 0
    }
    //get random direction from available directions
    return availableDirections[
      Math.floor(Math.random() * availableDirections.length)
    ]
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

    this.element.id = "sheep"
    this.element.x.baseVal.value = x
    this.element.y.baseVal.value = y

    this.x = x
    this.y = y
    this.direction = direction || 1
  }
}
