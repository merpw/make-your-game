export const CELL_SIZE = 5

const CELL_CODES = {
  0: "empty",
  1: "wall",
  2: "bush",
} as const

/** Cell codes defined in {@link CELL_CODES} */
export type CellCode = keyof typeof CELL_CODES

type CellType = (typeof CELL_CODES)[CellCode] | "fungi"

const TYPE_STYLES = {
  empty: {
    color: "white",
  },
  wall: {
    color: "black",
  },
  bush: {
    color: "green",
  },
  fungi: {
    color: "#9B0099",
  },
} as const

export class Cell {
  get type(): CellType {
    return this._type
  }

  set type(value: CellType) {
    this.element.style.fill = TYPE_STYLES[value].color
    this._type = value
  }

  private _type!: CellType
  public element: SVGRectElement
  public col: number
  public row: number
  /** x coordinate in svg coordinates */
  public x: number
  /** y coordinate in svg coordinates */
  public y: number

  constructor(typeCode: CellCode, col: number, row: number) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
    this.type = CELL_CODES[typeCode]

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
