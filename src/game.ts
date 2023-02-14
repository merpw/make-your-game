// don't forget .js extensions
import { Board } from "./board.js" // don't forget the .js extension
import Hero from "./hero.js"
import { level1, level1sheeps, level1bushes } from "./levels.js"

const FPS = 60
const NORMAL_FRAME_TIME = 1000 / FPS

export const svg = document.querySelector("#game svg") as SVGSVGElement
// create svg groups g for the field
const groupLandscape = document.createElementNS("http://www.w3.org/2000/svg", "g")
const groupBushes = document.createElementNS("http://www.w3.org/2000/svg", "g")
const groupFungi = document.createElementNS("http://www.w3.org/2000/svg", "g")
const groupSheeps = document.createElementNS("http://www.w3.org/2000/svg", "g")
const groupPlayers = document.createElementNS("http://www.w3.org/2000/svg", "g")
const groupClouds = document.createElementNS("http://www.w3.org/2000/svg", "g")
groupLandscape.setAttribute("id", "landscape")
groupBushes.setAttribute("id", "bushes")
groupFungi.setAttribute("id", "fungi")
groupSheeps.setAttribute("id", "sheeps")
groupPlayers.setAttribute("id", "players")
groupClouds.setAttribute("id", "clouds")
// add groups to svg
svg.appendChild(groupLandscape) // include stones, grass(empty)
svg.appendChild(groupBushes) // includes bushes
svg.appendChild(groupFungi) // includes fungi will add/remove dinamically
svg.appendChild(groupSheeps) // include sheeps in demonized and normal state
svg.appendChild(groupPlayers) // include players
svg.appendChild(groupClouds) // include clouds after fungi explosion with animation

export const mainHero = new Hero(0, 0)

export const board = new Board(
  svg,
  mainHero,
  level1bushes,
  level1sheeps,
  level1
)

svg.viewBox.baseVal.width = board.width
svg.viewBox.baseVal.height = board.height

groupPlayers.appendChild(mainHero.element)
level1bushes.forEach((bush) => groupBushes.appendChild(bush.element))
level1sheeps.forEach((sheep) => groupSheeps.appendChild(sheep.element))

let lastTime = 0
const step: FrameRequestCallback = (timestamp: number) => {
  const frameTime = timestamp - lastTime
  lastTime = timestamp

  board.render(frameTime / NORMAL_FRAME_TIME)

  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
