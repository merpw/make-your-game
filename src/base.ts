import Timer from "./timer.js"
import AnimationManager from "./animationManager.js"
import { AssetName } from "./animations/animations"

/** A class for non-static objects that can be animated using {@link AnimationManager}*/
export class Animated<T extends AssetName> {
  public animationManager?: AnimationManager<T>
  protected element!: SVGSVGElement // There's '!' because they're set in setAnimation
  private readonly size: number

  get width() {
    return this.element.width.baseVal.value
  }

  get height() {
    return this.element.height.baseVal.value
  }

  /** x (horizontal) coordinate in svg coordinates. */
  public get x(): number {
    return this._x
  }

  protected _x: number

  /** y (vertical) coordinate in svg coordinates. */
  public get y(): number {
    return this._y
  }

  protected _y: number

  private timer: Timer | null = null

  public addTimer(callback: () => void, timeout: number) {
    this.timer?.stop()
    this.timer = new Timer(callback, timeout)
  }

  public stopTimer() {
    this.timer?.stop()
    this.timer = null
  }

  public pause() {
    this.timer?.pause()
    this.animationManager?.pause(true)
  }

  public resume() {
    this.timer?.resume()
    this.animationManager?.resume()
  }

  public setAsset(assetName: T | "none") {
    this.element?.remove()
    if (assetName === "none") {
      this.animationManager = undefined
      return
    }

    this.animationManager = new AnimationManager(assetName, this.size, 12)

    this.element = this.animationManager.element

    this.element.x.baseVal.value = this._x
    this.element.y.baseVal.value = this._y

    switch (assetName) {
      case "hero":
        return document.getElementById("players")?.appendChild(this.element)
      case "sheep":
        return document.getElementById("sheep")?.appendChild(this.element)
      case "fungus":
        return document.getElementById("fungi")?.appendChild(this.element)
      case "cloud":
        return document.getElementById("clouds")?.appendChild(this.element)
      default:
        return document.getElementById("landscape")?.appendChild(this.element)
    }
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

  constructor(size: number, x: number, y: number, assetName: T | "none") {
    this._x = x
    this._y = y
    this.size = size

    this.setAsset(assetName)
  }
}

/** A class for all moving creatures */
export default class Creature<T extends AssetName> extends Animated<T> {
  public get x() {
    return super.x
  }

  public set x(value: number) {
    this._x = value
    this.element.x.baseVal.value = value
  }

  public get y() {
    return super.y
  }

  public set y(value: number) {
    this._y = value
    this.element.y.baseVal.value = value
  }

  /** Returns true if the creature is colliding with the given rectangle */
  public isColliding(rect: Rect) {
    const thisRect = this.getRect()
    return (
      thisRect.right > rect.left &&
      thisRect.left < rect.right &&
      thisRect.bottom > rect.top &&
      thisRect.top < rect.bottom
    )
  }
}

type Rect = {
  left: number
  right: number
  top: number
  bottom: number
}
