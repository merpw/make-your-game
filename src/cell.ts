export const CELL_SIZE = 5

const CELL_TYPES = [
  { type: "empty", color: "white" },
  { type: "wall", color: "black" },
  { type: "bush", color: "green" },
] as const

type CellType = (typeof CELL_TYPES)[number]["type"]

export class Cell {
  get type(): CellType {
    return this._type
  }

  set type(value: CellType) {
    const type = CELL_TYPES.find((t) => t.type === value)
    this.element.style.fill = type?.color || "white"
    this._type = value
  }

  private _type!: CellType
  element: SVGRectElement
  col: number
  row: number
  /** x coordinate in svg coordinates */
  x: number
  /** y coordinate in svg coordinates */
  y: number

  constructor(typeCode: number, col: number, row: number) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
    this.type = CELL_TYPES[typeCode].type

    this.col = col
    this.row = row
    this.x = col * CELL_SIZE
    this.y = row * CELL_SIZE

    this.element.x.baseVal.value = this.x
    this.element.y.baseVal.value = this.y

    this.element.width.baseVal.value = CELL_SIZE
    this.element.height.baseVal.value = CELL_SIZE
  }
}

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
