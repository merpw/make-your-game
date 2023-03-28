import { ATLAS_PATH, ATLAS_CELL_ART_SIZE } from "./animations/frame.js"
import animations from "./animations/animations.js"
/** Animated image implementation, gets one of the assets from {@link animations} by {@link AssetName}*/
export default class AnimationManager {
  constructor(assetName, size, fps) {
    /** array of {@link Frame}'s to show*/
    this.keyFrames = null
    /** current frame index in the animation sequence */
    this.currentFrameIndex = 0
    /** last frame time in milliseconds */
    this.lastFrameTime = 0
    this.isPaused = false
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
  renderFrame(frame) {
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
  renderAnimationFrame(animationName, frameIndex = 0) {
    const keyFrames = animations[this.assetName][animationName]
    const frame = keyFrames[frameIndex]
    this.renderFrame(frame)
  }
  render(time) {
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
  play(animationName) {
    if (this.currentAnimationName === animationName) {
      return
    }
    this.currentAnimationName = animationName
    this.keyFrames = animations[this.assetName][this.currentAnimationName]
    this.renderFrame(this.keyFrames[0])
  }
  /**
   * Pause the animation
   *
   * @param shouldResume - default: true. if true, the animation will be resumed when {@link resume} is called
   */
  pause(shouldResume = true) {
    this.isPaused = true
    if (!shouldResume) {
      this.currentAnimationName = undefined
      this.keyFrames = null
    }
  }
  /** Resume the animation */
  resume() {
    this.isPaused = false
  }
}
//# sourceMappingURL=animationManager.js.map
