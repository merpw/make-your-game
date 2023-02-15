import Hero from "./hero"
import { Level } from "./levels"
import Sheep from "./sheep.js"

export const CELL_SIZE = 5

const CELL_TYPES = [
  { type: "empty", color: "white" },
  { type: "wall", color: "black" },
  { type: "bush", color: "green" },
] as const

type CellType = (typeof CELL_TYPES)[number]["type"]

export class Cell {
  type: CellType
  element: SVGRectElement
  x: number
  y: number

  constructor(typeCode: number, x: number, y: number) {
    this.type = CELL_TYPES[typeCode].type
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
    this.x = x
    this.y = y

    this.element.x.baseVal.value = this.x * CELL_SIZE
    this.element.y.baseVal.value = this.y * CELL_SIZE

    this.element.width.baseVal.value = CELL_SIZE
    this.element.height.baseVal.value = CELL_SIZE

    this.element.style.fill = CELL_TYPES[typeCode].color
  }
}

export class Board {
  public cells: Cell[][]
  public width: number
  public height: number
  public hero: Hero
  // sheeps: Sheep[]

  render(frameTimeDiff: number) {
    this.hero.render(frameTimeDiff, this.cells)
    // this.sheeps.forEach((sheep) => sheep.render(frameTimeDiff, this.cells))
  }

  getNeighbors(cell: Cell) {
    const neighbors = {
      right: this.cells[cell.y][cell.x + 1],
      left: this.cells[cell.y][cell.x - 1],
      bottom: this.cells[cell.y + 1][cell.x],
      top: this.cells[cell.y - 1][cell.x],
      bottomRight: this.cells[cell.y + 1][cell.x + 1],
      topLeft: this.cells[cell.y - 1][cell.x - 1],
      topRight: this.cells[cell.y - 1][cell.x + 1],
      bottomLeft: this.cells[cell.y + 1][cell.x - 1],
    }
    for (const key in neighbors) {
      if (!neighbors[key as keyof typeof neighbors]) {
        return null
      }
    }
    return neighbors
  }

  getRandomEmptyCells(count: number): Cell[] {
    const takenCells: Set<Cell> = new Set()

    const getRandomEmptyCell = (): Cell => {
      const x = Math.floor(Math.random() * this.cells[0].length)
      const y = Math.floor(Math.random() * this.cells.length)
      const cell = this.cells[y][x]
      if (cell.type === "empty" && !takenCells.has(cell)) {
        return cell
      }
      return getRandomEmptyCell()
    }
    for (let i = 0; i < count; i++) {
      takenCells.add(getRandomEmptyCell())
    }
    return [...takenCells]
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
    const heroCell = emptyCells[0]

    const sheeps = emptyCells
      .slice(1)
      .map((cell) => new Sheep(cell.x, cell.y, false, 0))

    const sheepsGroup = svg.querySelector("#sheeps") as SVGGElement
    sheeps.forEach((sheep) => {
      sheepsGroup.appendChild(sheep.element)
    })

    this.hero.x =
      heroCell.element.x.baseVal.value + (CELL_SIZE - this.hero.width) / 2
    this.hero.y =
      heroCell.element.y.baseVal.value + (CELL_SIZE - this.hero.height) / 2

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
