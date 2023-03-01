import { Animated } from "./base.js"
import AnimationManager from "./animationManager.js"

export const CELL_SIZE = 5

const CLOUD_TIME = 300
const SPAWN_CLOUD_TIME = 1000

const CELL_CODES = {
  0: "empty",
  1: "wall",
  2: "bush",
} as const

/** Cell codes defined in {@link CELL_CODES} */
export type CellCode = keyof typeof CELL_CODES

type CellType = (typeof CELL_CODES)[CellCode] | "fungus" | "cloud" | "spawn"

export default class Cell extends Animated<
  "fungus" | "cloud" | "wall" | "grass" | "bush" | "portal" | "potion"
> {
  get type(): CellType {
    return this._type
  }

  set type(value: CellType) {
    this._type = value

    if (value === "empty") {
      if (!this.secret) {
        this.setAsset("none")
        return
      }
      if (this.secret === "portalActive" || this.secret === "portal") {
        this.setAsset("portal")
        this.animationManager?.play<"portal">(
          this.secret === "portalActive" ? "on" : "off"
        )
        return
      }
      if (this.secret === "potion") {
        this.setAsset("potion")
        this.animationManager?.play<"potion">("stand")
        return
      }
      return
    }

    if (value === "wall" || value === "bush") {
      // static
      this.setAsset(value)
      return
    }

    if (value === "spawn") {
      this.setAsset("cloud")
      this.animationManager?.play<"cloud">("blue")
      this.addTimer(() => {
        this.type = "empty"
      }, SPAWN_CLOUD_TIME)
      return
    }

    if (value === "cloud") {
      let bg: SVGElement | null
      if (this.secret) {
        // create a copy of a secret to show under the cloud
        bg = this.element.cloneNode(true) as SVGSVGElement
        document.getElementById("landscape")?.appendChild(bg)
      }
      this.setAsset("cloud")
      this.animationManager?.play<"cloud">("pink")
      this.addTimer(() => {
        this.type = "empty"
        bg?.remove()
      }, CLOUD_TIME)
      return
    }

    if (value === "fungus") {
      this.setAsset("fungus")
      this.animationManager?.play<"fungus">("stand")
      return
    }
  }

  private _type!: CellType
  public col: number
  public row: number

  public secret?: "portal" | "portalActive" | "potion"

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
