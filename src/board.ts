import Hero from "./hero.js"
import { Level } from "./levels"
import Sheep from "./sheep.js"
import Cell, { CellCode, CELL_SIZE, NeighbourCells } from "./cell.js"
import Timer from "./timer.js"

export class Board {
  public hero: Hero
  private readonly cells: Cell[][]
  private readonly portal: Cell
  private readonly potion: Cell
  private readonly sheepStorage = {
    all: new Set<Sheep>(),
    demonized: new Set<Sheep>(),
    basic: new Set<Sheep>(),
  }

  public get time() {
    return this._time
  }

  set time(value: number) {
    this._time = value
    if (value < 0) {
      this.over()
      return
    }
    const time = document.getElementById("time")
    time && (time.innerText = value.toString())
  }

  private _time!: number

  private timer = new Timer(() => this.time--, 1000, true)

  public get isPaused() {
    return this._isPaused
  }

  public set isPaused(value: boolean) {
    if (this.isOver) return
    this._isPaused = value
    if (value) {
      document.getElementById("game")?.classList.add("paused")

      this.timer.pause()
      this.hero.pause()
      this.cells.flat().forEach((cell) => cell.pause())
      this.sheepStorage.all.forEach((sheep) => sheep.pause())
    } else {
      document.getElementById("game")?.classList.remove("paused")

      this.timer.resume()
      this.hero.resume()
      this.cells.flat().forEach((cell) => cell.resume())
      this.sheepStorage.all.forEach((sheep) => sheep.resume())
    }
  }

  private _isPaused = false

  public over() {
    this.isPaused = true
    this.isOver = true
    this.timer.stop()
    document.getElementById("game")?.classList.add("over")
  }

  private isOver = false

  public render(frameTimeDiff: number, time: number) {
    if (this.isPaused) return

    this.renderAnimations(time)

    const heroCell = this.getCell(this.hero)
    if (!heroCell) {
      throw new Error("Hero is out of bounds")
    }
    const heroNeighbours = this.getNeighbors(heroCell)
    this.hero.render(frameTimeDiff, heroCell, heroNeighbours)

    this.sheepStorage.all.forEach((sheep) => {
      if (!sheep.targetCell) {
        const sheepCell = this.getCell(sheep)
        if (!sheepCell) {
          throw new Error("Sheep is out of bounds")
        }
        if (sheepCell.type === "bush") {
          sheepCell.type = "empty"
        }
        const sheepNeighbours = this.getNeighbors(sheepCell)

        if (sheep.demonized && this.hero.isLucky) {
          const heroEntry = Object.entries(sheepNeighbours).find(
            ([, cell]) => cell === heroCell
          )
          if (heroEntry) {
            const heroDirection = heroEntry[0] as keyof NeighbourCells
            sheepNeighbours[heroDirection] = null
          }
        }

        sheep.setRandomDirection(sheepNeighbours)
      }
      sheep.render(frameTimeDiff)
    })

    const heroRect = this.hero.getRect()

    this.sheepStorage.demonized.forEach((demon) => {
      if (demon.isColliding(heroRect)) {
        this.hero.lives--
        if (this.hero.lives > 0) {
          this.hero.spawn(this.getRandomEmptyCell())
        } else {
          this.over()
        }
      }
      this.sheepStorage.basic.forEach((sheep) => {
        if (demon.isColliding(sheep.getRect())) {
          sheep.demonized = true
        }
      })
    })
  }

  public renderAnimations(time: number) {
    this.hero.animationManager?.render(time)
    this.sheepStorage.all.forEach((sheep) =>
      sheep.animationManager?.render(time)
    )
    this.cells.flat().forEach((cell) => cell.animationManager?.render(time))
  }

  /**
   * Return a cell of the center of the given object
   * @param x - horizontal coordinate in svg coordinates
   * @param y - vertical coordinate in svg coordinates
   * @param height - height of the object
   * @param width - width of the object
   */
  private getCell({
    x,
    y,
    height,
    width,
  }: {
    x: number
    y: number
    height: number
    width: number
  }): Cell | null {
    const cellCol = Math.floor((x + width / 2) / CELL_SIZE)
    const cellRow = Math.floor((y + height / 2) / CELL_SIZE)
    return this.cells[cellRow]?.[cellCol] || null
  }

  /**
   * Returns the neighbour cells of the given cell
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

  /** Returns true if the given cell is empty and safe (there's no demons) */
  private isCellEmpty = (cell: Cell) =>
    cell.type === "empty" &&
    ![...this.sheepStorage.demonized].some(
      (sheep) => sheep.targetCell === cell || sheep.fromCell === cell
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

  /** Returns one random empty and safe cell */
  private getRandomEmptyCell = () => this.getRandomEmptyCells(1)[0]

  constructor(level: Level) {
    this.time = level.time

    const board = level.board.map((row) => [1, ...row, 1] as CellCode[])

    board.push(new Array(board[0].length).fill(1))
    board.unshift(new Array(board[0].length).fill(1))

    this.cells = board.map((row, y) =>
      row.map((cellCode, x) => new Cell(cellCode, x, y))
    )
    const bushes = this.cells.flat().filter((cell) => cell.type === "bush")

    const [portalCell] = bushes.sort(() => Math.random() - 0.5)
    portalCell.secret = "portal"
    this.portal = portalCell

    this.potion = this.portal
    // add potion into cell
    while (this.potion === this.portal) {
      // TODO: not looks very safe, depends on the bushes number
      const [potionCell] = bushes.sort(() => Math.random() - 0.5)
      if (potionCell === this.portal) continue
      potionCell.secret = "potion"
      this.potion = potionCell
    }

    const sheepCells = this.getRandomEmptyCells(level.sheepCount)

    Sheep.onDemonization = (sheep) => {
      if (sheep.demonized) {
        this.sheepStorage.demonized.add(sheep)
        this.sheepStorage.basic.delete(sheep)
      } else {
        this.sheepStorage.demonized.delete(sheep)
        this.sheepStorage.basic.add(sheep)

        if (this.sheepStorage.demonized.size === 0) {
          this.portal.type = "portal"
        }
      }
    }

    sheepCells.forEach((cell) =>
      this.sheepStorage.all.add(new Sheep(cell, this.getNeighbors(cell)))
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
