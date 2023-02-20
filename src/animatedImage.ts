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
  private _currentFrameFlipAlongX = false // flip the frame along x axis
  private _currentFrameFlipAlongY = false // flip the frame along y axis
  private _currentFrameScaleX = 1 // scale the frame along x axis
  private _currentFrameScaleY = 1 // scale the frame along y axis

  /**
   * @param svg svg element to display on the screen
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
    this._pathToAtlas = pathToAtlas
    this._element.href.baseVal = this._pathToAtlas
    this._frames = frames
    this._namedAnimations = namedAnimations
    this._fps = fps
    this._svg.appendChild(this._element)
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
        this._currentFrameFlipAlongX = this._currentFrame.flipAlongX
        this._currentFrameFlipAlongY = this._currentFrame.flipAlongY
        this._currentFrameScaleX = this._currentFrame.scaleX
        this._currentFrameScaleY = this._currentFrame.scaleY

        console.log(this._currentFrameFlipAlongX, this._currentFrameFlipAlongY) //TODO: remove this

        // this._svg.setAttribute(
        //   "transform",
        //   `scale(${this._currentFrameFlipAlongX ? -1 : 1}, 1)`
        // )

        //TODO: Finally it works, but requires full refactoring(with adding flipY implementation too) . Transform above(implemented to _svg) do nothing in some purposes
        this._element.setAttribute(
          "transform",
          `scale(${this._currentFrameScaleX} , ${this._currentFrameScaleY})`
        )

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
    this._currentFrameFlipAlongX = this._currentFrame.flipAlongX
    this._currentFrameFlipAlongY = this._currentFrame.flipAlongY
    this._currentFrameScaleX = this._currentFrame.scaleX
    this._currentFrameScaleY = this._currentFrame.scaleY

    console.log(this._currentFrameFlipAlongX, this._currentFrameFlipAlongY)

    this._svg.setAttribute(
      "transform",
      `scale(${this._currentFrameScaleX} , ${this._currentFrameScaleY})`
    )

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
   * @param animationName name of the animation to play. Each animation name is unique and is same as key in {@link AnimateBitmapBasedSVGImageElement._namedAnimations}
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
 * @param flipAlongX if true, the frame will be flipped along X axis
 * @param flipAlongY if true, the frame will be flipped along Y axis
 * */
export class MyFrame {
  readonly name: string
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly flipAlongX: boolean
  readonly flipAlongY: boolean
  readonly scaleX: 1 | -1
  readonly scaleY: 1 | -1

  constructor(frameData: {
    name: string
    x: number
    y: number
    width: number
    height: number
    flipAlongX: boolean
    flipAlongY: boolean
  }) {
    this.name = frameData.name
    this.width = frameData.width
    this.height = frameData.height
    this.flipAlongX = frameData.flipAlongX
    this.flipAlongY = frameData.flipAlongY
    this.scaleX = this.flipAlongX ? -1 : 1
    this.scaleY = this.flipAlongY ? -1 : 1

    if (this.flipAlongX) {
      this.x = -(frameData.x + frameData.width)
    } else {
      this.x = frameData.x
    }

    if (this.flipAlongY) {
      this.y = -(frameData.y + frameData.height)
    } else {
      this.y = frameData.y
    }
  }
}

/**
 * @param name name of the animation. Each animation name is unique and is same as key in {@link AnimatedImage._namedAnimations}
 * @param sequenceOfFrameNames array of frame names in the sequence. Each frame name is {@link MyFrame.name}
 */
export type MyAnimation = {
  name: string
  sequenceOfFrameNames: string[]
}
