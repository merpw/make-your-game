import { Animated } from "./base.js"
import AnimationManager from "./animationManager.js"

export const CELL_SIZE = 5

const CLOUD_TIME = 300

const CELL_CODES = {
  0: "empty",
  1: "wall",
  2: "bush",
} as const

/** Cell codes defined in {@link CELL_CODES} */
export type CellCode = keyof typeof CELL_CODES

type CellType = (typeof CELL_CODES)[CellCode] | "fungus" | "cloud"

export default class Cell extends Animated<
  "fungus" | "cloud" | "wall" | "grass" | "bush"
> {
  get type(): CellType {
    return this._type
  }

  set type(value: CellType) {
    this._type = value

    if (value === "cloud") {
      this.setAsset("cloud")
      ;(this.animationManager as AnimationManager<"cloud">)?.play("pink")

      this.addTimer(() => {
        this.type = "empty"
      }, CLOUD_TIME)
      return
    }
    if (value === "empty") {
      this.setAsset("none")
      return
    }

    this.setAsset(value)

    if (value === "fungus") {
      ;(this.animationManager as AnimationManager<"fungus">)?.play("stand")
      return
    }
  }

  private _type!: CellType
  public col: number
  public row: number

  constructor(typeCode: CellCode, col: number, row: number) {
    super(CELL_SIZE, col * CELL_SIZE, row * CELL_SIZE, "none")

    const { element: grass } = new AnimationManager("grass", CELL_SIZE, 0)

    grass.x.baseVal.value = col * CELL_SIZE
    grass.y.baseVal.value = row * CELL_SIZE

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
