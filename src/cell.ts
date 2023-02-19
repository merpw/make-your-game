import { Animated } from "./base.js"

export const CELL_SIZE = 5

const CLOUD_TIME = 500

const CELL_CODES = {
  0: "empty",
  1: "wall",
  2: "bush",
} as const

/** Cell codes defined in {@link CELL_CODES} */
export type CellCode = keyof typeof CELL_CODES

type CellType = (typeof CELL_CODES)[CellCode] | "fungi" | "cloud"

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
  cloud: {
    color: "#00FFFF",
  },
} as const

export default class Cell extends Animated {
  get type(): CellType {
    return this._type
  }

  set type(value: CellType) {
    if (value === "cloud") {
      this.addTimer(() => {
        this.type = "empty"
      }, CLOUD_TIME)
    }
    this.element.style.fill = TYPE_STYLES[value].color
    this._type = value
  }

  // TODO: add pause handling
  private _type!: CellType
  public col: number
  public row: number

  constructor(typeCode: CellCode, col: number, row: number) {
    super(CELL_SIZE, CELL_SIZE, col * CELL_SIZE, row * CELL_SIZE)
    this.type = CELL_CODES[typeCode]

    this.col = col
    this.row = row
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
