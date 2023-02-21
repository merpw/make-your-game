/** animated image implementation. Use svg element <image> with frames from bitmap atlas */
export class AnimationManager {
  /** svg element to place on the screen */
  private readonly svg: SVGSVGElement

  /** svg element to place in the svg */
  private readonly element: SVGImageElement

  /** Map of the named frames in the atlas */
  private readonly frames: Map<string, MyFrame>

  /** named animations, used to play the animation */
  private readonly namedAnimations: Map<string, MyAnimation>

  /** frames per second */
  private readonly fps: number

  /** current animation to play in the loop */
  private currentAnimation: MyAnimation | null = null

  private isPaused = false

  /** current frame index in the animation sequence */
  private currentFrameIndex = 0

  /** last frame time in milliseconds */
  private lastFrameTime = 0

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
    )
    this.element.href.baseVal = pathToAtlas
    this.frames = frames
    this.namedAnimations = namedAnimations
    this.fps = fps
    this.svg.appendChild(this.element)
  }

  /**
   * Animation loop. It's called by requestAnimationFrame.
   * */
  private render = (time: number) => {
    if (this.isPaused || !this.currentAnimation) {
      return
    }
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

      const currentFrameName =
        this.currentAnimation.sequenceOfFrameNames[this.currentFrameIndex]

      const currentFrame = this.frames.get(currentFrameName)
      if (!currentFrame) {
        return
      }

      this.element.setAttribute(
        "transform",
        `scale(${currentFrame.scaleX} , ${currentFrame.scaleX})`
      )

      this.svg.setAttribute(
        "viewBox",
        `${currentFrame.x} ${currentFrame.y} ${currentFrame.width} ${currentFrame.height}`
      )
      this.lastFrameTime = time
    }

    requestAnimationFrame(this.render)
  }

  /**
   * @param animationName - name of the animation to play. Each animation name is unique and is same as key in {@link AnimationManager.namedAnimations}
   * */
  public play(animationName: string) {
    this.currentAnimation = this.namedAnimations.get(
      animationName
    ) as MyAnimation

    requestAnimationFrame(this.render)
    // TODO: consider alternatives (e.g. SVG animate)
  }

  /** Pause the animation */
  public pause() {
    this.isPaused = true
  }

  public resume() {
    this.isPaused = false
    requestAnimationFrame(this.render)
  }
}

export class MyFrame {
  /** name of the frame. Each frame name is unique and is same as key in {@link AnimationManager.frames} */
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
  /** name of the animation. Each animation name is unique and is same as key in {@link AnimationManager.namedAnimations} */
  name: string
  /** array of frame names in the sequence. Each frame name is {@link MyFrame.name} */
  sequenceOfFrameNames: string[]
}
