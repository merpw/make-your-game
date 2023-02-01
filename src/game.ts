// don't forget .js extensions
import { Board } from "./board.js" // don't forget the .js extension
import Hero from "./hero.js"
import { level1 } from "./levels.js"

const FPS = 60
const NORMAL_FRAME_TIME = 1000 / FPS

const svg = document.querySelector("#game svg") as SVGSVGElement
export const mainHero = new Hero(5, 5)

const board = new Board(svg, mainHero, level1)

svg.viewBox.baseVal.width = board.width
svg.viewBox.baseVal.height = board.height

svg.appendChild(mainHero.element)

let lastTime = 0
const step: FrameRequestCallback = (timestamp: number) => {
  const frameTime = timestamp - lastTime
  lastTime = timestamp

  board.render(frameTime / NORMAL_FRAME_TIME)

  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
