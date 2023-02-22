import Timer from "./timer.js"
import { AnimationManager, MyFrame } from "./animatedImage.js"

/** A class for non-static objects that can be animated and paused */
export class Animated {
  public element: SVGSVGElement | SVGRectElement // TODO: remove Rect when all assets will be implemented
  public animationManager?: AnimationManager // TODO: make required
  protected readonly height: number
  protected readonly width: number

  /** x (horizontal) coordinate in svg coordinates. */
  public get x(): number {
    return this.element.x.baseVal.value
  }

  /** y (vertical) coordinate in svg coordinates. */
  public get y(): number {
    return this.element.y.baseVal.value
  }

  private timer: Timer | null = null

  public addTimer(callback: () => void, timeout: number) {
    this.timer?.stop()
    this.timer = new Timer(callback, timeout)
  }

  public pause() {
    this.timer?.pause()
    this.animationManager?.pause()
  }

  public resume() {
    this.timer?.resume()
    this.animationManager?.resume()
  }

  constructor(
    height: number,
    width: number,
    x: number,
    y: number,
    namedAnimations: Map<string, MyFrame[]>,
    animationAsset?: string
  ) {
    this.height = height
    this.width = width

    if (!animationAsset) {
      //TODO: remove when all assets will be implemented
      this.element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      )

      this.element.height.baseVal.value = height
      this.element.width.baseVal.value = width
      this.element.x.baseVal.value = x
      this.element.y.baseVal.value = y
      return
    }
    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    this.element.classList.add("pixelated")

    this.element.setAttribute("width", width.toString())
    this.element.setAttribute("height", height.toString())
    // TODO: why panic if this.element.x.baseVal.value = "5" ?
    this.element.setAttribute("viewBox", "0 0 16 16") // looks like ignored, and later too

    this.animationManager = new AnimationManager(
      this.element,
      "assets/atlas.png", //TODO: replace to "animationAsset" when all assets will be implemented
      namedAnimations,
      16
    )
    this.animationManager.play("goRight") //TODO: is it required?
    this.animationManager.pause()
  }
}

/** A class for all moving creatures */
export default class Creature extends Animated {
  public get x() {
    return super.x
  }

  public set x(value: number) {
    this.element && (this.element.x.baseVal.value = value)
    this.element.x.baseVal.value = value
  }

  public get y() {
    return super.y
  }

  public set y(value: number) {
    this.element && (this.element.y.baseVal.value = super.y)
    this.element.y.baseVal.value = value
  }

  /** Returns a rectangle that represents the creature's position */
  public getRect(): Rect {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    }
  }

  /** Returns true if the creature is colliding with the given rectangle */
  public isColliding(rect: Rect) {
    const thisRect = this.getRect()
    return (
      rect.left < thisRect.right &&
      rect.right > thisRect.left &&
      rect.top < thisRect.bottom &&
      rect.bottom > thisRect.top
    )
  }

  constructor(
    height: number,
    width: number,
    x: number,
    y: number,
    namedAnimations: Map<string, MyFrame[]>,
    animationAsset?: string
  ) {
    super(height, width, x, y, namedAnimations, animationAsset)
  }
}

type Rect = {
  left: number
  right: number
  top: number
  bottom: number
}
