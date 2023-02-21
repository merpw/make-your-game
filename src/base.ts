import Timer from "./timer.js"
import {
  AnimateBitmapBasedSVGImageElement,
  MyAnimation,
  MyFrame,
} from "./animatedImage.js"

/** A class for non-static objects that can be animated and paused */
export class Animated {
  public element: SVGRectElement
  public animatedElement?: SVGSVGElement
  public animationManager?: AnimateBitmapBasedSVGImageElement
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

  constructor(
    height: number,
    width: number,
    x: number,
    y: number,
    animationAsset?: string
  ) {
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

    if (animationAsset) {
      this.animatedElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      )
      this.animatedElement.classList.add("pixelated")

      const frameSize = 16

      this.animatedElement.setAttribute("width", width.toString())
      this.animatedElement.setAttribute("height", height.toString())
      // TODO: why panic if this.animatedElement.x.baseVal.value = "5" ?
      // this.animatedElement.setAttribute("viewBox", "0 0 16 16") // looks like ignored, and later too

      const frames = new Map<string, MyFrame>([
        [
          "step1",
          new MyFrame({
            name: "step1",
            x: 0,
            y: 0,
            width: frameSize,
            height: frameSize,
            flipAlongX: false,
            flipAlongY: false,
          }),
        ],
        [
          "step2",
          new MyFrame({
            name: "step2",
            x: frameSize,
            y: 0,
            width: frameSize,
            height: frameSize,
            flipAlongX: false,
            flipAlongY: false,
          }),
        ],
        [
          "step3",
          new MyFrame({
            name: "step3",
            x: 0,
            y: frameSize,
            width: frameSize,
            height: frameSize,
            flipAlongX: false,
            flipAlongY: false,
          }),
        ],
        [
          "step4",
          new MyFrame({
            name: "step4",
            x: frameSize,
            y: frameSize,
            width: frameSize,
            height: frameSize,
            flipAlongX: false,
            flipAlongY: false,
          }),
        ],
      ])

      const namedAnimations = new Map<string, MyAnimation>([
        [
          "walk",
          {
            name: "walk",
            sequenceOfFrameNames: ["step1", "step2", "step3", "step4"],
          },
        ],
      ])

      this.animationManager = new AnimateBitmapBasedSVGImageElement(
        this.animatedElement,
        "assets/atlas.png",
        frames,
        namedAnimations,
        16
      )
      this.animationManager.play("walk")
    }
  }
}

/** A class for all moving creatures */
export default class Creature extends Animated {
  public get x() {
    return super.x
  }

  public set x(value: number) {
    this.animatedElement && (this.animatedElement.x.baseVal.value = value)
    this.element.x.baseVal.value = value
  }

  public get y() {
    return super.y
  }

  public set y(value: number) {
    this.animatedElement && (this.animatedElement.y.baseVal.value = super.y)
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
    animationAsset?: string
  ) {
    super(height, width, x, y, animationAsset)
  }
}

type Rect = {
  left: number
  right: number
  top: number
  bottom: number
}
