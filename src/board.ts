import Hero from "./hero.js"
import { Level } from "./levels"
import Sheep from "./sheep.js"
import Cell, { CELL_SIZE, NeighbourCells } from "./cell.js"

export class Board {
  public hero: Hero
  private readonly cells: Cell[][]
  private readonly sheep: Sheep[] = []

  public get isPaused() {
    return this._isPaused
  }

  public set isPaused(value: boolean) {
    this._isPaused = value
    if (value) {
      document.getElementById("board")?.classList.add("paused")
      this.hero.pause()
      this.cells.flat().forEach((cell) => cell.pause())
      this.sheep.forEach((sheep) => sheep.pause())
    } else {
      document.getElementById("board")?.classList.remove("paused")
      this.hero.resume()
      this.cells.flat().forEach((cell) => cell.resume())
      this.sheep.forEach((sheep) => sheep.resume())
    }
  }

  private _isPaused = false

  public render(frameTimeDiff: number, time: number) {
    if (this.isPaused) return

    this.renderAnimations(time)

    const heroCell = this.getCell(this.hero.x, this.hero.y)
    if (!heroCell) {
      throw new Error("Hero is out of bounds")
    }
    const heroNeighbours = this.getNeighbors(heroCell)
    this.hero.render(frameTimeDiff, heroCell, heroNeighbours)

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
      sheep.render(frameTimeDiff)
    })
    const demons = this.sheep.filter((sheep) => sheep.demonized)
    const basic = this.sheep.filter((sheep) => !sheep.demonized)

    const heroRect = this.hero.getRect()

    demons.forEach((demon) => {
      if (demon.isColliding(heroRect)) {
        this.hero.spawn(this.getRandomEmptyCell())
      }
      basic.forEach((sheep) => {
        if (sheep != demon && demon.isColliding(sheep.getRect())) {
          sheep.demonized = true
        }
      })
    })
  }

  public renderAnimations(time: number) {
    this.hero.animationManager?.render(time)
    this.sheep.forEach((sheep) => sheep.animationManager?.render(time))
    this.cells.flat().forEach((cell) => cell.animationManager?.render(time))
  }

  /**
   * Returns the cell at the given coordinates
   * @param x - horizontal coordinate in svg coordinates
   * @param y - vertical coordinate in svg coordinates
   */
  private getCell(x: number, y: number): Cell | null {
    const cellX = Math.floor((x + CELL_SIZE / 2) / CELL_SIZE)
    const cellY = Math.floor((y + CELL_SIZE / 2) / CELL_SIZE)
    return this.cells[cellY]?.[cellX] || null
  }

  /**
   * Returns the neighbours of the given cell
   * @param cell - the {@link Cell} to get the neighbours of
   */
  private getNeighbors(cell: Cell): NeighbourCells {
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
  private isCellEmpty = (cell: Cell) =>
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
  private getRandomEmptyCells(count: number): Cell[] {
    return this.cells
      .flat()
      .filter((cell) => this.isCellEmpty(cell))
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  }

  /** Returns a random empty and safe cell */
  private getRandomEmptyCell = () => this.getRandomEmptyCells(1)[0]

  constructor(level: Level) {
    const board = level.board
    board.forEach((row) => {
      row.push(1)
      row.unshift(1)
    })
    board.push(new Array(board[0].length).fill(1))
    board.unshift(new Array(board[0].length).fill(1))

    this.cells = board.map((row, y) =>
      row.map((cellCode, x) => new Cell(cellCode, x, y))
    )

    const sheepCells = this.getRandomEmptyCells(level.sheepCount)
    this.sheep = sheepCells.map(
      (cell) => new Sheep(cell, this.getNeighbors(cell))
    )
    const heroCell = this.getRandomEmptyCell()
    this.hero = new Hero(heroCell)

    const svg = document.getElementById("board") as SVGSVGElement | null

    svg?.setAttribute(
      "viewBox",
      `0 0 ${this.cells[0].length * CELL_SIZE} ${this.cells.length * CELL_SIZE}`
    )
  }
}
