import Hero from "./hero.js"
import { Level } from "./levels"
import Sheep from "./sheep.js"
import { Cell, CELL_SIZE, NeighbourCells } from "./cell.js"

export class Board {
  public cells: Cell[][]
  svg: SVGSVGElement
  public hero: Hero

  sheep: Sheep[]

  render(frameTimeDiff: number) {
    const heroCell = this.getCell(this.hero.x, this.hero.y)
    if (!heroCell) {
      throw new Error("Hero is out of bounds")
    }
    const heroNeighbours = this.getNeighbors(heroCell)
    this.hero.render(frameTimeDiff, heroNeighbours)

    this.sheep.forEach((sheep) => {
      if (!sheep.targetCell) {
        const sheepCell = this.getCell(sheep.x, sheep.y)
        if (!sheepCell) {
          throw new Error("Sheep is out of bounds")
        }
        if (sheepCell.type === "bush") {
          sheepCell.type = "empty"
        }
        const sheepNeighbours = this.getNeighbors(sheepCell)
        sheep.setRandomDirection(sheepNeighbours)
      }
      if (
        sheep.demonized &&
        (heroCell === sheep.targetCell ||
          Object.values(heroNeighbours).includes(sheep.targetCell)) &&
        this.hero.isColliding({
          left: sheep.x,
          right: sheep.x + CELL_SIZE,
          top: sheep.y,
          bottom: sheep.y + CELL_SIZE,
        })
      ) {
        this.hero.spawn(this.getRandomEmptyCell())
      }
      sheep.render(frameTimeDiff)
    })
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
  getNeighbors(cell: Cell): NeighbourCells {
    return {
      right: this.cells[cell.row]?.[cell.col + 1] || null,
      left: this.cells[cell.row]?.[cell.col - 1] || null,
      bottom: this.cells[cell.row + 1]?.[cell.col] || null,
      top: this.cells[cell.row - 1]?.[cell.col] || null,
      bottomRight: this.cells[cell.row + 1]?.[cell.col + 1] || null,
      topLeft: this.cells[cell.row - 1]?.[cell.col - 1] || null,
      topRight: this.cells[cell.row - 1]?.[cell.col + 1] || null,
      bottomLeft: this.cells[cell.row + 1]?.[cell.col - 1] || null,
    }
  }

  /** Returns true if the given cell is empty and safe */
  isCellEmpty = (cell: Cell) =>
    cell.type === "empty" &&
    !this.sheep.some(
      (sheep) =>
        sheep.demonized &&
        (sheep.targetCell === cell || this.getCell(sheep.x, sheep.y) === cell)
    )

  /**
   * Returns an array of unique random empty and safe cells with the given length
   * @param count - the number of empty cells to find
   */
  getRandomEmptyCells(count: number): Cell[] {
    return this.cells
      .flat()
      .filter((cell) => this.isCellEmpty(cell))
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  }

  /** Returns a random empty and safe cell */
  getRandomEmptyCell = () => this.getRandomEmptyCells(1)[0]

  constructor(svg: SVGSVGElement, level: Level) {
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

    const sheepCells = this.getRandomEmptyCells(level.sheepCount)
    const sheepGroup = svg.querySelector("#sheep") as SVGGElement
    this.sheep = sheepCells.map((cell) => {
      const sheep = new Sheep(cell, this.getNeighbors(cell))
      sheepGroup.appendChild(sheep.element)
      return sheep
    })
    const heroCell = this.getRandomEmptyCell()
    this.hero = new Hero(heroCell)

    svg.getElementById("players").appendChild(this.hero.element)

    svg.viewBox.baseVal.width = this.cells[0].length * CELL_SIZE
    svg.viewBox.baseVal.height = this.cells.length * CELL_SIZE
    this.svg = svg
  }
}
