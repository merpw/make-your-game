import { Frame, ATLAS_PATH, ATLAS_CELL_ART_SIZE } from "./animations/frame.js"
import animations, { AnimationName } from "./animations/animations.js"
import { AssetName } from "./animations/animations.js"

/** Animated image implementation, gets one of the assets from {@link animations} by {@link AssetName}*/
export default class AnimationManager<T extends AssetName> {
  /** name of the asset to show, can be one or several of {@link AssetName}'s */
  private readonly assetName: T
  /** svg image that contains cropped asset */
  public readonly element: SVGSVGElement
  /** atlas image that can be cropped by svg {@link element} to get a specific asset using */
  private readonly image: SVGImageElement

  /** animation fps, can be 0 to create static animation */
  private readonly fps: number
  private readonly size: number

  /** current animation name to play in the loop */
  private currentAnimationName?: AnimationName<T>

  /** array of {@link Frame}'s to show*/
  private keyFrames: Frame[] | null = null
  /** current frame index in the animation sequence */
  private currentFrameIndex = 0

  constructor(assetName: T, size: number, fps: number) {
    this.assetName = assetName
    this.size = size
    this.fps = fps

    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    this.element.classList.add("pixelated")

    this.image = document.createElementNS("http://www.w3.org/2000/svg", "image")
    this.image.href.baseVal = ATLAS_PATH
    this.element.appendChild(this.image)

    const assetAnimations = animations[assetName]
    if ("static" in assetAnimations) {
      // if static, render it once
      this.fps = 0
      const [frame] = assetAnimations.static
      this.renderFrame(frame)
    } else {
      this.element.setAttribute("viewBox", "0 0 0 0")
      this.element.setAttribute("width", "0")
      this.element.setAttribute("height", "0")
      // by default the animated element is hidden
    }
  }

  private renderFrame(frame: Frame) {
    frame.flipX
      ? this.image.setAttribute("transform", "scale(-1, 1)")
      : this.image.removeAttribute("transform")
    this.element.setAttribute("viewBox", frame.viewBox)
    const [, , width, height] = frame.viewBox.split(" ")

    const wCoef = Number(width) / ATLAS_CELL_ART_SIZE // prevent stretching to fill maximum possible area of "cell"
    const hCoef = Number(height) / ATLAS_CELL_ART_SIZE

    const aspectRatio = Number(width) / Number(height)
    if (aspectRatio > 1) {
      this.element.setAttribute("width", (this.size * wCoef).toString())
      this.element.setAttribute(
        "height",
        ((this.size / aspectRatio) * wCoef).toString()
      )
    } else {
      this.element.setAttribute(
        "width",
        (this.size * aspectRatio * hCoef).toString()
      )
      this.element.setAttribute("height", (this.size * hCoef).toString())
    }
  }

  /* Renders one specific frame of the animation */
  public renderAnimationFrame<U extends T>(
    animationName: AnimationName<U>,
    frameIndex = 0
  ) {
    const keyFrames = animations[this.assetName][
      animationName as AnimationName<T>
    ] as Frame[]
    const frame = keyFrames[frameIndex]
    this.renderFrame(frame)
  }

  /** last frame time in milliseconds */
  private lastFrameTime = 0

  public render(time: number) {
    if (this.fps === 0 || this.isPaused || !this.keyFrames) {
      return
    }
    if (time - this.lastFrameTime > 1000 / this.fps) {
      this.currentFrameIndex++
      if (this.currentFrameIndex >= this.keyFrames.length) {
        this.currentFrameIndex = 0
      }

      const currentFrame = this.keyFrames[this.currentFrameIndex]
      this.renderFrame(currentFrame)

      this.lastFrameTime = time
    }
  }

  /**
   * Play the animation with the given name
   *
   * @param animationName - name of the animation to play
   * @typeParam U - type of the asset to play animation for. Optional, should be provided only if the {@link AnimationManager} supports several assets
   */
  public play<U extends T>(animationName: AnimationName<U>): void {
    if (this.currentAnimationName === animationName) {
      return
    }
    this.currentAnimationName = animationName as AnimationName<T>
    this.keyFrames = animations[this.assetName][
      this.currentAnimationName
    ] as Frame[]
    this.renderFrame(this.keyFrames[0])
  }

  private isPaused = false

  /**
   * Pause the animation
   *
   * @param shouldResume - default: true. if true, the animation will be resumed when {@link resume} is called
   */
  public pause(shouldResume = true) {
    this.isPaused = true
    if (!shouldResume) {
      this.currentAnimationName = undefined
      this.keyFrames = null
    }
  }

  /** Resume the animation */
  public resume() {
    this.isPaused = false
  }
}
