import { Animated } from "./base.js"
import { AnimationManager } from "./animatedImage"

export const CELL_SIZE = 5

const CLOUD_TIME = 300

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
    color: "gray",
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

export default class Cell extends Animated<"fungus" | "cloud"> {
  // TODO: remove never when cell will be added
  get type(): CellType {
    return this._type
  }

  set type(value: CellType) {
    this._type = value
    if (value === "empty") {
      this.setAnimation("empty")
      return
    }
    if (value === "cloud") {
      this.addTimer(() => {
        this.type = "empty"
      }, CLOUD_TIME)
    }
    if (value === "fungi") {
      this.setAnimation("fungus")
      // TODO: maybe improve this
      ;(this.animationManager as AnimationManager<"fungus">)?.play("stand")
      return
    }
    if (value === "cloud") {
      this.setAnimation("cloud")
      ;(this.animationManager as AnimationManager<"cloud">)?.play("pink")
      return
    }

    // TODO: remove when all assets will be added
    this.setAnimation()
    this.element.style.fill = TYPE_STYLES[value].color
  }

  // TODO: add pause handling
  private _type!: CellType
  public col: number
  public row: number

  constructor(typeCode: CellCode, col: number, row: number) {
    super(CELL_SIZE, CELL_SIZE, col * CELL_SIZE, row * CELL_SIZE)

    const grass = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    grass.height.baseVal.value = CELL_SIZE
    grass.width.baseVal.value = CELL_SIZE
    grass.x.baseVal.value = col * CELL_SIZE
    grass.y.baseVal.value = row * CELL_SIZE
    grass.style.fill = "gray"
    document.getElementById("landscape")?.appendChild(grass)

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
