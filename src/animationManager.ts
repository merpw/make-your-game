import { Frame, ATLAS_PATH, ATLAS_CELL_ART_SIZE } from "./animations/frame.js"
import animations from "./animations/animations.js"
import { AssetName } from "./animations/animations.js"

/** animated image implementation. Use svg element <image> with frames from bitmap atlas */
export default class AnimationManager<T extends AssetName> {
  /** svg element to place on the screen */
  public readonly element: SVGSVGElement
  private readonly image: SVGImageElement
  /** named animations, used to play the animation */
  private readonly animations: (typeof animations)[T]

  /** frames per second */
  private readonly fps: number
  private readonly size: number

  /** current animation name to play in the loop */
  private currentAnimationName?: keyof typeof this.animations

  /** current animation to play in the loop */
  private keyFrames: Frame[] | null = null

  private isPaused = false

  /** current frame index in the animation sequence */
  private currentFrameIndex = 0

  /** last frame time in milliseconds */
  private lastFrameTime = 0

  /**
   * @param assetName - named animations, used to play the animation
   * @param size - height of the animated element
   * @param fps - frames per second
   * */
  constructor(assetName: T, size: number, fps: number) {
    this.animations = animations[assetName]
    this.fps = fps
    this.size = size

    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    this.element.classList.add("pixelated")

    this.image = document.createElementNS("http://www.w3.org/2000/svg", "image")
    this.image.href.baseVal = ATLAS_PATH
    this.element.appendChild(this.image)

    if ("static" in this.animations) {
      // if static, render it once
      this.fps = 0
      const [frame] = this.animations.static
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
  public renderAnimationFrame(
    animationName: keyof typeof this.animations,
    frameIndex = 0
  ) {
    const keyFrames = this.animations[animationName] as Frame[] // TODO: maybe remove as Frame[]
    const frame = keyFrames[frameIndex]
    this.renderFrame(frame)
  }

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
      if (!currentFrame) {
        return
      }

      this.renderFrame(currentFrame)

      this.lastFrameTime = time
    }
  }

  /**
   * Play the animation with the given name
   * @param animationName - name of the animation to play. Each animation name is unique and is same as key in {@link AnimationManager.animations}
   * */
  public play(animationName: keyof typeof this.animations) {
    this.currentAnimationName = animationName
    this.keyFrames = this.animations[animationName] as Frame[] // TODO: maybe remove as Frame[]
  }

  /**
   * Pause the animation
   *
   * @param shouldResume - default: true. if true, the animation will resume when {@link AnimationManager.resume} is called
   * */
  public pause(shouldResume = true) {
    this.isPaused = true
    if (!shouldResume) {
      this.keyFrames = null
    }
  }

  /** Resume the animation */
  public resume() {
    this.isPaused = false
  }
}
