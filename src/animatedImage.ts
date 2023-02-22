import { Frame, ATLAS_PATH } from "./animations/frame.js"
import animations from "./animations/animations.js"
import { AssetName } from "./animations/animations.js"

/** animated image implementation. Use svg element <image> with frames from bitmap atlas */
export class AnimationManager<T extends AssetName> {
  /** svg element to place on the screen */
  public readonly element: SVGSVGElement
  private readonly image: SVGImageElement
  /** named animations, used to play the animation */
  private readonly animations: (typeof animations)[T]

  /** frames per second */
  private readonly fps: number

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
   * @param height - height of the animated element
   * @param width - width of the animated element
   * @param fps - frames per second
   * */
  constructor(assetName: T, height: number, width: number, fps: number) {
    this.animations = animations[assetName]
    this.fps = fps
    // TODO: think about implement code for fps = 0
    /* when the frame is not changed, just ignore any calculations after play() call,
    until animation is changed, but keep the same object(f.e. when portal is not turned on)*/

    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    this.element.classList.add("pixelated")

    this.element.setAttribute("width", width.toString())
    this.element.setAttribute("height", height.toString())
    // TODO: why panic if this.element.x.baseVal.value = "5" ?

    this.element.setAttribute("viewBox", "0 0 0 0")
    // by default its hidden

    this.image = document.createElementNS("http://www.w3.org/2000/svg", "image")
    this.image.href.baseVal = ATLAS_PATH
    this.element.appendChild(this.image)
  }

  /**
   * Animation loop. It's called by requestAnimationFrame.
   * */
  public render(time: number) {
    if (this.isPaused || !this.keyFrames) {
      return
    }
    if (time - this.lastFrameTime > 1000 / this.fps) {
      // next frame
      this.currentFrameIndex++
      if (this.currentFrameIndex >= this.keyFrames.length) {
        this.currentFrameIndex = 0
      }

      const currentFrame = this.keyFrames[this.currentFrameIndex]
      if (!currentFrame) {
        return
      }

      currentFrame.flipX
        ? this.image.setAttribute("transform", "scale(-1, 1)")
        : this.image.removeAttribute("transform")

      this.element.setAttribute("viewBox", currentFrame.viewBox)
      this.lastFrameTime = time
    }
  }

  /**
   * @param animationName - name of the animation to play. Each animation name is unique and is same as key in {@link AnimationManager.animations}
   * */
  public play(animationName: keyof typeof this.animations) {
    this.currentAnimationName = animationName
    this.keyFrames = this.animations[animationName] as Frame[] // TODO: maybe remove as Frame[]
  }

  /** Pause the animation */
  public pause() {
    this.isPaused = true
  }

  public resume() {
    this.isPaused = false
  }
}
