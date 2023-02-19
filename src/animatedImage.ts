/**animated image implementation. Use svg element <image> with frames from bitmap atlas */
export class AnimateBitmapBasedSVGImageElement {
  private readonly _svg: SVGSVGElement // svg element to place on the screen
  private readonly _element: SVGImageElement // svg element to place in the svg
  private readonly _pathToAtlas: string // path to the atlas image, used to create the image element, and to get the frame width and height from the atlas
  private readonly _frames: Map<string, MyFrame> // Map of the named frames in the atlas
  private readonly _namedAnimations: Map<string, MyAnimation> // named animations, used to play the animation
  private readonly _fps: number // frames per second
  private _currentAnimation: MyAnimation | null = null // current animation to play in the loop
  private _currentFrameIndex = 0 // current frame index in the animation sequence
  private _lastFrameTime = 0 // last frame time in milliseconds
  private _currentFrameName = "" // current frame name, used to get the frame from the atlas
  private _currentFrame: MyFrame | null = null // current frame from the atlas
  private _currentFrameX = 0 // x coordinate of the frame in the atlas, left top corner
  private _currentFrameY = 0 // y coordinate of the frame in the atlas, left top corner
  private _currentFrameWidth = 0 // width of the frame in the atlas
  private _currentFrameHeight = 0 // height of the frame in the atlas

  /**
   * @param element svg element to place on the screen
   * @param pathToAtlas path to the atlas image, used to create the image element, and to get the frame width and height from the atlas
   * @param frames Map of the named frames in the atlas
   * @param namedAnimations named animations, used to play the animation
   * @param fps frames per second
   * */
  constructor(
    svg: SVGSVGElement,
    pathToAtlas: string,
    frames: Map<string, MyFrame>,
    namedAnimations: Map<string, MyAnimation>,
    fps: number
  ) {
    this._svg = svg
    this._element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    ) as SVGImageElement

    this._svg.appendChild(this._element)
    this._pathToAtlas = pathToAtlas
    this._element.href.baseVal = this._pathToAtlas
    this._frames = frames
    this._namedAnimations = namedAnimations
    this._fps = fps
  }

  /**
   * Animation loop. It's called by requestAnimationFrame.
   * */
  _loop = (time: number) => {
    if (this._currentAnimation) {
      const frameTimeDiff = time - this._lastFrameTime
      if (frameTimeDiff > 1000 / this._fps) {
        // next frame
        this._currentFrameIndex++
        if (
          this._currentFrameIndex >=
          this._currentAnimation.sequenceOfFrameNames.length
        ) {
          this._currentFrameIndex = 0
        }

        this._currentFrameName =
          this._currentAnimation.sequenceOfFrameNames[this._currentFrameIndex]
        this._currentFrame = this._frames.get(this._currentFrameName) || null
        if (!this._currentFrame) {
          throw new Error(`Frame ${this._currentFrameName} not found`)
        }
        this._currentFrameX = this._currentFrame.x
        this._currentFrameY = this._currentFrame.y
        this._currentFrameWidth = this._currentFrame.width
        this._currentFrameHeight = this._currentFrame.height
        // this._element.x.baseVal.value = this._currentFrameX
        // this._element.y.baseVal.value = this._currentFrameY
        // this._element.width.baseVal.value = this._currentFrameWidth
        // this._element.height.baseVal.value = this._currentFrameHeight
        this._svg.setAttribute(
          "viewBox",
          `${this._currentFrameX} ${this._currentFrameY} ${this._currentFrameWidth} ${this._currentFrameHeight}`
        )
        this._lastFrameTime = time
      }
    }
    requestAnimationFrame(this._loop)
  }

  /**
   * @param animationName name of the animation to play. Each animation name is unique and is same as key in {@link AnimateBitmapBasedSVGImageElement._namedAnimations}
   * */
  public play(animationName: string) {
    this._currentAnimation = this._namedAnimations.get(animationName) || null
    if (!this._currentAnimation) {
      throw new Error(`Animation ${animationName} not found`)
    }
    this._currentFrameIndex = 0
    this._lastFrameTime = 0
    this._currentFrameName =
      this._currentAnimation.sequenceOfFrameNames[this._currentFrameIndex]
    this._currentFrame = this._frames.get(this._currentFrameName) || null
    if (!this._currentFrame) {
      throw new Error(`Frame ${this._currentFrameName} not found`)
    }
    this._currentFrameX = this._currentFrame.x
    this._currentFrameY = this._currentFrame.y
    this._currentFrameWidth = this._currentFrame.width
    this._currentFrameHeight = this._currentFrame.height
    // this._element.x.baseVal.value = this._currentFrameX
    // this._element.y.baseVal.value = this._currentFrameY
    // this._element.width.baseVal.value = this._currentFrameWidth
    // this._element.height.baseVal.value = this._currentFrameHeight

    this._svg.setAttribute(
      "viewBox",
      `0 0 ${this._currentFrameWidth} ${this._currentFrameHeight}`
    )

    this._lastFrameTime = performance.now()
    requestAnimationFrame(this._loop)

    return this
  }

  /**
   * Stop animation
   * */
  public stop() {
    this._element.style.visibility = "hidden"
    this._currentAnimation = null
    return this
  }

  /**
   * @param animationName name of the animation to play. Each animation name is unique and is same as key in {@link AnimatedImage._namedAnimations}
   * */
  public isPlaying(animationName: string) {
    return (
      this._currentAnimation &&
      this._currentAnimation.name === animationName &&
      this._element.style.visibility === "visible"
    )
  }
}

/**
 * @param name name of the frame. Each frame name is unique and is same as key in {@link AnimatedImage._frames}
 * @param x x coordinate of the frame in the atlas, left top corner
 * @param y y coordinate of the frame in the atlas, left top corner
 * @param width width of the frame in the atlas
 * @param height height of the frame in the atlas
 * */
export type MyFrame = {
  name: string
  x: number
  y: number
  width: number
  height: number
}

/**
 * @param name name of the animation. Each animation name is unique and is same as key in {@link AnimatedImage._namedAnimations}
 * @param sequenceOfFrameNames array of frame names in the sequence. Each frame name is {@link MyFrame.name}
 */
export type MyAnimation = {
  name: string
  sequenceOfFrameNames: string[]
}
