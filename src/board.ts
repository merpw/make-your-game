import Fung from "./fung"
import Hero from "./hero"

export const CELL_SIZE = 8

const CELL_TYPES = [
  { type: "empty", color: "white" },
  { type: "wall", color: "black" },
  { type: "bush", color: "green" },
] as const

type CellType = (typeof CELL_TYPES)[number]["type"]

export class Cell {
  public type: CellType
  element: SVGRectElement

  constructor(typeCode: number) {
    this.type = CELL_TYPES[typeCode].type
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
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

  render(frameTimeDiff: number) {
    this.hero.render(frameTimeDiff, this.cells)
  }

  getRandomEmptyCell(): Cell {
    const x = Math.floor(Math.random() * this.cells[0].length)
    const y = Math.floor(Math.random() * this.cells.length)
    if (this.cells[y][x].type !== "empty") {
      return this.getRandomEmptyCell()
    }
    return this.cells[y][x]
  }

  constructor(svg: SVGSVGElement, hero: Hero, boardNums: number[][]) {
    this.hero = hero

    boardNums.forEach((row) => {
      row.push(1)
      row.unshift(1)
    })
    boardNums.push(new Array(boardNums[0].length).fill(1))
    boardNums.unshift(new Array(boardNums[0].length).fill(1))

    this.cells = boardNums.map((row) =>
      row.map((cellCode) => new Cell(cellCode))
    )

    // get the group g element from the svg
    const landscape = svg.querySelector("g") as SVGGElement

    this.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        cell.element.x.baseVal.value = x * CELL_SIZE
        cell.element.y.baseVal.value = y * CELL_SIZE
        landscape.appendChild(cell.element)
      })
    })

    const heroCell = this.getRandomEmptyCell()
    this.hero.x =
      heroCell.element.x.baseVal.value + (CELL_SIZE - this.hero.width) / 2
    this.hero.y =
      heroCell.element.y.baseVal.value + (CELL_SIZE - this.hero.height) / 2

    this.width = this.cells[0].length * CELL_SIZE
    this.height = this.cells.length * CELL_SIZE
  }
}

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
