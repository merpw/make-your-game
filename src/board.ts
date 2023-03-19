import Hero from "./hero.js"
import { Level } from "./levels"
import Sheep from "./sheep.js"
import Cell, {
  CellCode,
  CELL_SIZE,
  NeighbourCells,
  PORTAL_EXIT_TIME,
} from "./cell.js"
import Timer from "./timer.js"

/** camera height in cells */
const CAMERA_HEIGHT = 7

const CAMERA_ASPECT_RATIO = 16 / 9
const MOBILE_CAMERA_ASPECT_RATIO = 1

/** Coefficient to change camera movement inertia, should be 0..1
 *
 * for 1 it's instantly following hero, for 0 there's no movement at all */
const VIEW_SPEED = 0.1

/** if camera is closer than this to hero, it won't move */
const VIEW_SENSITIVITY = 0.5

const SCORES = {
  demonToSheep: +100,
  sheepToDemon: -50,
  /** Bonus for left time, per second */
  timeBonus: +5,
  /** Bonus for left lives, per live */
  livesBonus: +100,
  potion: +100,
  /** Penalty for self poisoning, per frame in cloud (max ≈90) */
  selfPoisoning: -5,
} as const

export class Board {
  public hero: Hero
  private element: SVGSVGElement
  private readonly height: number
  private readonly width: number
  private readonly cells: Cell[][]
  private readonly portalCell: Cell
  private POTION_EFFECTS: (() => void)[] = [
    () => (this.hero.isLucky = true),
    () => (this.hero.isSick = true),
    () => this.hero.spawn(this.getRandomEmptyCell()),
    () => this.sheepStorage.basic.forEach((sheep) => (sheep.demonized = true)),
    () =>
      this.sheepStorage.demonized.forEach((sheep) => (sheep.demonized = false)),
    () => this.hero.lives++,
    () => this.hero.lives--,
    () => (this.time += 60),
    // TODO: maybe add extended fungi effect
  ]

  getRandomPotionEffect() {
    return this.POTION_EFFECTS[
      Math.floor(Math.random() * this.POTION_EFFECTS.length)
    ]
  }

  private readonly sheepStorage = {
    all: new Set<Sheep>(),
    demonized: new Set<Sheep>(),
    basic: new Set<Sheep>(),
  }

  public get score() {
    return this._score
  }

  public set score(value: number) {
    value < 0 && (value = 0)
    this._score = value
    const score = document.getElementById("score")
    score && (score.innerText = value.toString())
  }

  _score!: number

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
  /** Main {@link Timer} in {@link setInterval} mode that counts down the time. */
  private timer = new Timer(() => this.time--, 1000, true)
  /** Secondary {@link Timer} in {@link setTimeout} mode for single delayed events */
  private eventTimer: Timer | null = null

  public get isPaused() {
    return this._isPaused
  }

  public set isPaused(value: boolean) {
    if (this.isOver) return
    this._isPaused = value
    if (value) {
      document.getElementById("game")?.classList.add("paused")

      this.timer.pause()
      this.eventTimer?.pause()
      this.hero.pause()
      this.cells.flat().forEach((cell) => cell.pause())
      this.sheepStorage.all.forEach((sheep) => sheep.pause())
    } else {
      document.getElementById("game")?.classList.remove("paused")

      this.timer.resume()
      this.eventTimer?.resume()
      this.hero.resume()
      this.cells.flat().forEach((cell) => cell.resume())
      this.sheepStorage.all.forEach((sheep) => sheep.resume())
    }
  }

  private _isPaused = false
  /** Camera horizontal position in svg coordinate
   *
   * if `undefined`, it will be set to {@link cameraTargetX} on next {@link renderCamera} call
   */
  private cameraX: number | undefined
  /** Camera target horizontal position in svg coordinates
   *
   * it's set in {@link centerCamera} and used in {@link renderCamera} to move camera smoothly
   */
  private cameraTargetX!: number // there's ! because it's set in centerCamera called in constructor
  /** camera current vertical position in svg coordinate
   *
   * if `undefined`, it will be set to {@link cameraTargetY} on next {@link renderCamera} call
   */
  private cameraY: number | undefined
  /** Camera target vertical position in svg coordinates
   *
   * it's set in {@link centerCamera} and used in {@link renderCamera} to move camera smoothly
   */
  private cameraTargetY!: number // there's ! because it's set in centerCamera called in constructor
  private readonly cameraHeight: number
  private readonly cameraWidth: number

  /**
   * Sets {@link cameraTargetX} and {@link cameraTargetY} to show hero in the center of the view
   *
   * Cares about camera boundaries
   * */
  centerCamera() {
    const heroCenterX = this.hero.x + this.hero.width / 2
    const heroCenterY = this.hero.y + this.hero.height / 2
    const x = Math.max(
      0,
      Math.min(
        heroCenterX - (this.cameraWidth * CELL_SIZE) / 2,
        this.width - this.cameraWidth * CELL_SIZE
      )
    )
    const y = Math.max(
      0,
      Math.min(
        heroCenterY - (this.cameraHeight * CELL_SIZE) / 2,
        this.height - this.cameraHeight * CELL_SIZE
      )
    )
    if (this.cameraTargetX !== x || this.cameraTargetY !== y) {
      this.cameraTargetX = x
      this.cameraTargetY = y
    }
  }

  /** Changes board {@link element}'s viewBox to move camera to {@link cameraTargetX} and {@link cameraTargetY} */
  renderCamera() {
    if (this.cameraX === undefined || this.cameraY === undefined) {
      this.cameraX = this.cameraTargetX
      this.cameraY = this.cameraTargetY
    } else {
      if (
        Math.abs(this.cameraTargetX - this.cameraX) < VIEW_SENSITIVITY &&
        Math.abs(this.cameraTargetY - this.cameraY) < VIEW_SENSITIVITY
      ) {
        return
      }
      this.cameraX += (this.cameraTargetX - this.cameraX) * VIEW_SPEED
      this.cameraY += (this.cameraTargetY - this.cameraY) * VIEW_SPEED
    }

    this.element.setAttribute(
      "viewBox",
      `${this.cameraX.toFixed(2)} ${this.cameraY.toFixed(2)} ${
        this.cameraWidth * CELL_SIZE
      } ${this.cameraHeight * CELL_SIZE}`
    )
  }

  public over(isWin = false) {
    this.isPaused = true
    this.isOver = true
    this.timer.stop()
    if (isWin) {
      this.score =
        this.score +
        this.time * SCORES.timeBonus +
        this.hero.lives * SCORES.livesBonus
    }
    document.getElementById("game")?.classList.add(isWin ? "win" : "over")
  }

  private isOver = false

  public render(frameTimeDiff: number, time: number) {
    if (this.isPaused) return
    if (this.hero.speedX !== 0 || this.hero.speedY !== 0) {
      this.centerCamera()
    }

    this.renderCamera()
    this.renderAnimations(time)

    const heroCell = this.getCell(this.hero)
    if (!heroCell) {
      throw new Error("Hero is out of bounds")
    }
    if (heroCell.secret === "potion") {
      this.score += SCORES.potion
      heroCell.secret = undefined
      heroCell.type = "empty"
      this.hero.isSick = false
      const effect = this.getRandomPotionEffect()
      effect()
    }
    if (heroCell.type === "portal") {
      heroCell.type = "portalActivated"
      this.eventTimer = new Timer(
        () => {
          if (this.hero.cell == this.portalCell) {
            this.hero.setAsset("none")
            this.portalCell.type = "empty"
            this.over(true)
          }
          this.eventTimer = null
        },
        PORTAL_EXIT_TIME,
        false
      )
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
          this.centerCamera()
        } else {
          this.over()
        }
      }
      this.sheepStorage.basic.forEach((sheep) => {
        if (demon.isColliding(sheep.getRect())) {
          sheep.demonized = true
          this.score += SCORES.sheepToDemon
        }
      })
    })

    /* demons that had contact with cloud and may become sheep */
    const weakDemons: Sheep[] = []
    /* demons that are safe from cloud */
    const safeDemons: Sheep[] = []

    this.sheepStorage.demonized.forEach((demon) =>
      demon.fromCell.type === "cloud" || demon.targetCell?.type === "cloud"
        ? weakDemons.push(demon)
        : safeDemons.push(demon)
    )

    weakDemons.forEach((weakDemon) => {
      const weakDemonRect = weakDemon.getRect()
      if (
        !safeDemons.some((safeDemon) => safeDemon.isColliding(weakDemonRect))
      ) {
        // there's no safe demon that can keep the weak demon demonized (by sharing the devil's power)
        weakDemon.demonized = false
        this.score += SCORES.demonToSheep
      }
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
    this.score = 0

    const board = level.board.map((row) => [1, ...row, 1] as CellCode[])

    board.push(new Array(board[0].length).fill(1))
    board.unshift(new Array(board[0].length).fill(1))

    this.cells = board.map((row, y) =>
      row.map((cellCode, x) => new Cell(cellCode, x, y))
    )
    const bushes = this.cells.flat().filter((cell) => cell.type === "bush")

    const [portalCell, potionCell] = bushes.sort(() => Math.random() - 0.5)
    portalCell.secret = "portal"
    this.portalCell = portalCell
    potionCell.secret = "potion"

    const sheepCells = this.getRandomEmptyCells(level.sheepCount)

    Sheep.onDemonization = (sheep) => {
      if (sheep.demonized) {
        this.sheepStorage.demonized.add(sheep)
        this.sheepStorage.basic.delete(sheep)
        if (this.portalCell.type === "portal") {
          this.portalCell.type = "empty"
        }
      } else {
        this.sheepStorage.demonized.delete(sheep)
        this.sheepStorage.basic.add(sheep)

        if (this.sheepStorage.demonized.size === 0) {
          this.portalCell.type = "portal"
        }
      }
    }

    sheepCells.forEach((cell) =>
      this.sheepStorage.all.add(new Sheep(cell, this.getNeighbors(cell)))
    )

    const heroCell = this.getRandomEmptyCell()
    Hero.onSick = () => {
      this.score += SCORES.selfPoisoning
    }
    this.hero = new Hero(heroCell)

    const svg = document.getElementById("board") as SVGSVGElement | null
    if (!svg) {
      throw new Error("No #board svg element found")
    }
    this.height = this.cells.length * CELL_SIZE
    this.width = this.cells[0].length * CELL_SIZE
    this.element = svg

    this.cameraHeight = CAMERA_HEIGHT
    // TODO: maybe improve mobile device detection
    this.cameraWidth = Math.floor(
      (screen.orientation?.type === "portrait-primary"
        ? MOBILE_CAMERA_ASPECT_RATIO
        : CAMERA_ASPECT_RATIO) * this.cameraHeight
    )
    this.centerCamera()
  }
}
