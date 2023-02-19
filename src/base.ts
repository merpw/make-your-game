import Timer from "./timer.js"

/** A class for non-static objects that can be animated and paused */
export class Animated {
  public element: SVGRectElement
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
  }

  public resume() {
    this.timer?.resume()
  }

  constructor(height: number, width: number, x: number, y: number) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
    this.height = height
    this.width = width
    this.element.height.baseVal.value = height
    this.element.width.baseVal.value = width
    this.element.x.baseVal.value = x
    this.element.y.baseVal.value = y
  }
}

/** A class for all moving creatures */
export default class Creature extends Animated {
  public get x() {
    return super.x
  }

  public set x(value: number) {
    this.element.x.baseVal.value = value
  }

  public get y() {
    return super.y
  }

  public set y(value: number) {
    this.element.y.baseVal.value = value
  }

  public isColliding(rect: Rect) {
    const thisRect = {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    }
    return (
      rect.left < thisRect.right &&
      rect.right > thisRect.left &&
      rect.top < thisRect.bottom &&
      rect.bottom > thisRect.top
    )
  }

  constructor(height: number, width: number, x: number, y: number) {
    super(height, width, x, y)
  }
}

type Rect = {
  left: number
  right: number
  top: number
  bottom: number
}
