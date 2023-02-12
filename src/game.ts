// don't forget .js extensions
import { Board } from "./board.js" // don't forget the .js extension
import Hero from "./hero.js"
import { level1, level1sheeps, level1bushes } from "./levels.js"

const FPS = 60
const NORMAL_FRAME_TIME = 1000 / FPS

export const svg = document.querySelector("#game svg") as SVGSVGElement
// create svg groups g for the field
const glandscape = document.createElementNS("http://www.w3.org/2000/svg", "g")
const gbushes = document.createElementNS("http://www.w3.org/2000/svg", "g")
const gfungi = document.createElementNS("http://www.w3.org/2000/svg", "g")
const gsheeps = document.createElementNS("http://www.w3.org/2000/svg", "g")
const gplayers = document.createElementNS("http://www.w3.org/2000/svg", "g")
const gclouds = document.createElementNS("http://www.w3.org/2000/svg", "g")
glandscape.setAttribute("id", "landscape")
gbushes.setAttribute("id", "bushes")
gfungi.setAttribute("id", "fungi")
gsheeps.setAttribute("id", "sheeps")
gplayers.setAttribute("id", "players")
gclouds.setAttribute("id", "clouds")
// add groups to svg
svg.appendChild(glandscape) // include stones, grass(empty)
svg.appendChild(gbushes) // includes bushes
svg.appendChild(gfungi) // includes fungi will add/remove dinamically
svg.appendChild(gsheeps) // include sheeps in demonized and normal state
svg.appendChild(gplayers) // include players
svg.appendChild(gclouds) // include clouds after fungi explosion with animation

export const mainHero = new Hero(8, 8)

export const board = new Board(
  svg,
  mainHero,
  level1bushes,
  level1sheeps,
  level1
)

svg.viewBox.baseVal.width = board.width
svg.viewBox.baseVal.height = board.height

gplayers.appendChild(mainHero.element)
level1bushes.forEach((bush) => gbushes.appendChild(bush.element))
level1sheeps.forEach((sheep) => gsheeps.appendChild(sheep.element))

let lastTime = 0
const step: FrameRequestCallback = (timestamp: number) => {
  const frameTime = timestamp - lastTime
  lastTime = timestamp

  board.render(frameTime / NORMAL_FRAME_TIME)

  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
