import Hero from "./hero.js"
import { Level } from "./levels"
import Sheep from "./sheep.js"
import { Cell, CELL_SIZE } from "./cell.js"

export type NeighbourCells = {
  top: Cell | null
  right: Cell | null
  bottom: Cell | null
  left: Cell | null
  topLeft: Cell | null
  topRight: Cell | null
  bottomLeft: Cell | null
  bottomRight: Cell | null
}

export class Board {
  public cells: Cell[][]
  public width: number
  public height: number
  public hero: Hero

  // sheep: Sheep[]

  render(frameTimeDiff: number) {
    const heroCell = this.getCell(this.hero.x, this.hero.y)
    if (!heroCell) {
      throw new Error("Hero is out of bounds")
    }
    const heroNeighbours = this.getNeighbors(heroCell)
    this.hero.render(frameTimeDiff, heroNeighbours)
  }

  /**
   * Returns the cell at the given coordinates
   * @param x - x (column) coordinate in svg coordinates
   * @param y - y (row) coordinate in svg coordinates
   */
  getCell(x: number, y: number): Cell | null {
    const cellX = Math.floor((x + CELL_SIZE / 2) / CELL_SIZE)
    const cellY = Math.floor((y + CELL_SIZE / 2) / CELL_SIZE)
    return this.cells[cellY]?.[cellX] || null
  }

  /**
   * Returns the neighbours of the given cell
   * @param cell - the cell to get the neighbours of
   */
  getNeighbors(cell: Cell) {
    return {
      right: this.cells[cell.y]?.[cell.x + 1] || null,
      left: this.cells[cell.y]?.[cell.x - 1] || null,
      bottom: this.cells[cell.y + 1]?.[cell.x] || null,
      top: this.cells[cell.y - 1]?.[cell.x] || null,
      bottomRight: this.cells[cell.y + 1]?.[cell.x + 1] || null,
      topLeft: this.cells[cell.y - 1]?.[cell.x - 1] || null,
      topRight: this.cells[cell.y - 1]?.[cell.x + 1] || null,
      bottomLeft: this.cells[cell.y + 1]?.[cell.x - 1] || null,
    }
  }

  /**
   * Returns an array of unique random empty cells with the given length
   * @param count - the number of empty cells to find
   */
  getRandomEmptyCells(count: number): Cell[] {
    return this.cells
      .flat()
      .filter((cell) => cell.type === "empty")
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  }

  constructor(svg: SVGSVGElement, hero: Hero, level: Level) {
    this.hero = hero
    svg.getElementById("players").appendChild(hero.element)

    const board = level.board
    board.forEach((row) => {
      row.push(1)
      row.unshift(1)
    })
    board.push(new Array(board[0].length).fill(1))
    board.unshift(new Array(board[0].length).fill(1))

    const landscape = svg.querySelector("#landscape") as SVGGElement
    this.cells = board.map((row, y) =>
      row.map((cellCode, x) => {
        const cell = new Cell(cellCode, x, y)
        landscape.appendChild(cell.element)
        return cell
      })
    )

    const emptyCells = this.getRandomEmptyCells(level.sheepCount + 1)
    const [heroCell, ...sheepCells] = emptyCells

    const sheep = sheepCells.map((cell) => new Sheep(cell.x, cell.y, false, 0))

    const sheepGroup = svg.querySelector("#sheep") as SVGGElement
    sheep.forEach((sheep) => {
      sheepGroup.appendChild(sheep.element)
    })

    this.hero.x = heroCell.element.x.baseVal.value
    this.hero.y = heroCell.element.y.baseVal.value

    this.width = this.cells[0].length * CELL_SIZE
    this.height = this.cells.length * CELL_SIZE

    svg.viewBox.baseVal.width = this.width
    svg.viewBox.baseVal.height = this.height
  }
}

/*
function intersectRect(r1: DOMRect, r2: DOMRect, gap = 0) {
  if (
    r2.left - r1.right > gap ||
    r1.left - r2.right > gap ||
    r2.top - r1.bottom > gap ||
    r1.top - r2.bottom > gap
  ) {
    return null
  }
  return {
    left: r1.left - r2.right < 0,
    right: r2.left - r1.right < 0,
    top: r1.top - r2.bottom < 0,
    bottom: r2.top - r1.bottom < 0,
  }
}
*/
