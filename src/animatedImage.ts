/**animated image implementation. Use svg element <image> with frames from bitmap atlas */
export class AnimateBitmapBasedSVGImageElement {
  /** svg element to place on the screen */
  private readonly svg: SVGSVGElement

  /** svg element to place in the svg */
  private readonly element: SVGImageElement

  /** path to the atlas image, used to create the image element, and to get the frame width and height from the atlas */
  private readonly pathToAtlas: string

  /** Map of the named frames in the atlas */
  private readonly frames: Map<string, MyFrame>

  /** named animations, used to play the animation */
  private readonly namedAnimations: Map<string, MyAnimation>

  /** frames per second */
  private readonly fps: number

  /** current animation to play in the loop */
  private currentAnimation: MyAnimation | null = null

  /** current frame index in the animation sequence */
  private currentFrameIndex = 0

  /** last frame time in milliseconds */
  private lastFrameTime = 0

  /** current frame name, used to get the frame from the atlas */
  private currentFrameName = ""

  /** current frame from the atlas */
  private currentFrame: MyFrame | null = null

  /** x coordinate of the frame in the atlas, left top corner */
  private currentFrameX = 0

  /** y coordinate of the frame in the atlas, left top corner */
  private currentFrameY = 0

  /** width of the frame in the atlas */
  private currentFrameWidth = 0

  /** height of the frame in the atlas */
  private currentFrameHeight = 0

  /** flip the frame along x axis */
  private currentFrameFlipAlongX = false

  /** flip the frame along y axis */
  private currentFrameFlipAlongY = false

  /** scale the frame along x axis */
  private currentFrameScaleX = 1

  /** scale the frame along y axis */
  private currentFrameScaleY = 1

  /**
   * @param svg - svg element to display on the screen
   * @param pathToAtlas - path to the atlas image, used to create the image element, and to get the frame width and height from the atlas
   * @param frames - Map of the named frames in the atlas
   * @param namedAnimations - named animations, used to play the animation
   * @param fps - frames per second
   * */
  constructor(
    svg: SVGSVGElement,
    pathToAtlas: string,
    frames: Map<string, MyFrame>,
    namedAnimations: Map<string, MyAnimation>,
    fps: number
  ) {
    this.svg = svg
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    ) as SVGImageElement
    this.pathToAtlas = pathToAtlas
    this.element.href.baseVal = this.pathToAtlas
    this.frames = frames
    this.namedAnimations = namedAnimations
    this.fps = fps
    this.svg.appendChild(this.element)
  }

  /**
   * Animation loop. It's called by requestAnimationFrame.
   * */
  loop = (time: number) => {
    if (this.currentAnimation) {
      const frameTimeDiff = time - this.lastFrameTime
      if (frameTimeDiff > 1000 / this.fps) {
        // next frame
        this.currentFrameIndex++
        if (
          this.currentFrameIndex >=
          this.currentAnimation.sequenceOfFrameNames.length
        ) {
          this.currentFrameIndex = 0
        }

        this.currentFrameName =
          this.currentAnimation.sequenceOfFrameNames[this.currentFrameIndex]
        this.currentFrame = this.frames.get(this.currentFrameName) || null
        if (!this.currentFrame) {
          throw new Error(`Frame ${this.currentFrameName} not found`)
        }
        this.currentFrameX = this.currentFrame.x
        this.currentFrameY = this.currentFrame.y
        this.currentFrameWidth = this.currentFrame.width
        this.currentFrameHeight = this.currentFrame.height
        this.currentFrameFlipAlongX = this.currentFrame.flipAlongX
        this.currentFrameFlipAlongY = this.currentFrame.flipAlongY
        this.currentFrameScaleX = this.currentFrame.scaleX
        this.currentFrameScaleY = this.currentFrame.scaleY

        console.log(this.currentFrameFlipAlongX, this.currentFrameFlipAlongY) //TODO: remove this

        // this.svg.setAttribute(
        //   "transform",
        //   `scale(${this.currentFrameFlipAlongX ? -1 : 1}, 1)`
        // )

        //TODO: Finally it works, but requires full refactoring(with adding flipY implementation too) . Transform above(implemented to svg) do nothing in some purposes
        this.element.setAttribute(
          "transform",
          `scale(${this.currentFrameScaleX} , ${this.currentFrameScaleY})`
        )

        this.svg.setAttribute(
          "viewBox",
          `${this.currentFrameX} ${this.currentFrameY} ${this.currentFrameWidth} ${this.currentFrameHeight}`
        )
        this.lastFrameTime = time
      }
    }
    requestAnimationFrame(this.loop)
  }

  /**
   * @param animationName - name of the animation to play. Each animation name is unique and is same as key in {@link AnimateBitmapBasedSVGImageElement.namedAnimations}
   * */
  public play(animationName: string) {
    this.currentAnimation = this.namedAnimations.get(animationName) || null
    if (!this.currentAnimation) {
      throw new Error(`Animation ${animationName} not found`)
    }
    this.currentFrameIndex = 0
    this.lastFrameTime = 0
    this.currentFrameName =
      this.currentAnimation.sequenceOfFrameNames[this.currentFrameIndex]
    this.currentFrame = this.frames.get(this.currentFrameName) || null
    if (!this.currentFrame) {
      throw new Error(`Frame ${this.currentFrameName} not found`)
    }
    this.currentFrameX = this.currentFrame.x
    this.currentFrameY = this.currentFrame.y
    this.currentFrameWidth = this.currentFrame.width
    this.currentFrameHeight = this.currentFrame.height
    this.currentFrameFlipAlongX = this.currentFrame.flipAlongX
    this.currentFrameFlipAlongY = this.currentFrame.flipAlongY
    this.currentFrameScaleX = this.currentFrame.scaleX
    this.currentFrameScaleY = this.currentFrame.scaleY

    console.log(this.currentFrameFlipAlongX, this.currentFrameFlipAlongY)

    this.svg.setAttribute(
      "transform",
      `scale(${this.currentFrameScaleX} , ${this.currentFrameScaleY})`
    )

    this.svg.setAttribute(
      "viewBox",
      `0 0 ${this.currentFrameWidth} ${this.currentFrameHeight}`
    )

    this.lastFrameTime = performance.now()
    requestAnimationFrame(this.loop)

    return this
  }

  /**
   * Stop animation
   * */
  public stop() {
    this.element.style.visibility = "hidden"
    this.currentAnimation = null
    return this
  }

  /**
   * @param animationName - name of the animation to play. Each animation name is unique and is same as key in {@link AnimateBitmapBasedSVGImageElement.namedAnimations}
   * */
  public isPlaying(animationName: string) {
    return (
      this.currentAnimation &&
      this.currentAnimation.name === animationName &&
      this.element.style.visibility === "visible"
    )
  }
}

export class MyFrame {
  /** name of the frame. Each frame name is unique and is same as key in {@link AnimateBitmapBasedSVGImageElement.frames} */
  readonly name: string
  /** x coordinate of the frame in the atlas, left top corner */
  readonly x: number
  /** y coordinate of the frame in the atlas, left top corner */
  readonly y: number
  /** width of the frame in the atlas */
  readonly width: number
  /** height of the frame in the atlas */
  readonly height: number
  /** if true, the frame will be flipped along X axis */
  readonly flipAlongX: boolean
  /** if true, the frame will be flipped along Y axis */
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

export type MyAnimation = {
  /** name of the animation. Each animation name is unique and is same as key in {@link AnimateBitmapBasedSVGImageElement.namedAnimations} */
  name: string
  /** array of frame names in the sequence. Each frame name is {@link MyFrame.name} */
  sequenceOfFrameNames: string[]
}
