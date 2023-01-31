// don't forget .js extensions
import { Cell } from "./board.js" // don't forget the .js extension
import Hero from "./hero.js"
const FPS = 60
const NORMAL_FRAME_TIME = 1000 / FPS
const cell = new Cell()
console.log("Game is running", cell)
const svg = document.querySelector("#game svg")
const circle = svg.querySelector("#mainHero")
export const mainHero = new Hero(circle)
let lastTime = 0
const step = (timestamp) => {
  const frameTime = timestamp - lastTime
  lastTime = timestamp
  mainHero.render(frameTime / NORMAL_FRAME_TIME)
  window.requestAnimationFrame(step)
}
window.requestAnimationFrame(step)
