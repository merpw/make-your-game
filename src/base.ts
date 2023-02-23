import Timer from "./timer.js"
import AnimationManager from "./animationManager.js"
import { AssetName } from "./animations/animations"

/** A class for non-static objects that can be animated and paused */
export class Animated<T extends AssetName> {
  public animationManager!: AnimationManager<T>
  protected element!: SVGSVGElement // There's '!' because they're set in setAnimation
  protected readonly height: number
  protected readonly width: number

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

  public pause() {
    this.timer?.pause()
    this.animationManager?.pause(false)
  }

  public resume() {
    this.timer?.resume()
    this.animationManager?.resume()
  }

  public setAnimation(assetName: T | "none") {
    this.element?.remove()
    if (assetName === "none") return

    this.animationManager = new AnimationManager(
      assetName,
      this.height,
      this.width,
      12
    )

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

  constructor(
    height: number,
    width: number,
    x: number,
    y: number,
    assetName: T | "none"
  ) {
    this.height = height
    this.width = width
    this._x = x
    this._y = y

    this.setAnimation(assetName)
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
}

type Rect = {
  left: number
  right: number
  top: number
  bottom: number
}
