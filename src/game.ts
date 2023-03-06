import { Board } from "./board.js"
import { Level, level1 } from "./levels.js"
import "./keys.js"

const FPS = 60
const NORMAL_FRAME_TIME = 1000 / FPS

/** removes all elements in layers and {@link currentBoard} */
const clean = () => {
  document
    .querySelectorAll("#game g.layer > *")
    .forEach((node) => node.remove())
  const game = document.getElementById("game") as HTMLElement
  game.classList.value = ""
  currentBoard = null
}

/** Sets {@link currentLevel} and {@link currentBoard} */
const setLevel = (newLevel: Level) => {
  clean()
  currentLevel = newLevel
  currentBoard = new Board(currentLevel)
}
export const restartLevel = () => setLevel(currentLevel)

let currentLevel: Level
export let currentBoard: Board | null

setLevel(level1)

let lastTime = 0
let lastFrameTime = 1000 / FPS
const step: FrameRequestCallback = (timestamp: number) => {
  const frameTime = timestamp - lastTime
  lastTime = timestamp

  if (frameTime < 2 * lastFrameTime) {
    // limit the frame time to 2x the last frame time
    // to avoid huge jumps in the game state
    currentBoard?.render(frameTime / NORMAL_FRAME_TIME, timestamp)
  }

  lastFrameTime = frameTime
  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
