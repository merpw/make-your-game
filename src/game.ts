// don't forget .js extensions
import { Board } from "./board.js" // don't forget the .js extension
import { level1 } from "./levels.js"
import takeControl from "./keys.js"

const FPS = 60
const NORMAL_FRAME_TIME = 1000 / FPS

export const board = new Board(level1)

takeControl(board)

let lastTime = 0
let lastFrameTime = 1000 / FPS
const step: FrameRequestCallback = (timestamp: number) => {
  const frameTime = timestamp - lastTime
  lastTime = timestamp

  if (frameTime < 2 * lastFrameTime) {
    // limit the frame time to 2x the last frame time
    // to avoid huge jumps in the game state
    board.render(frameTime / NORMAL_FRAME_TIME, timestamp)
  }

  lastFrameTime = frameTime
  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
