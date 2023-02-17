// don't forget .js extensions
import { Board } from "./board.js" // don't forget the .js extension
import { level1 } from "./levels.js"
import takeControl from "./keys.js"

const FPS = 60
const NORMAL_FRAME_TIME = 1000 / FPS

export const svg = document.querySelector("#game svg") as SVGSVGElement
export const board = new Board(svg, level1)

takeControl(board)

let lastTime = 0
const step: FrameRequestCallback = (timestamp: number) => {
  const frameTime = timestamp - lastTime
  lastTime = timestamp

  board.render(frameTime / NORMAL_FRAME_TIME)

  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
