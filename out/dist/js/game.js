// don't forget .js extensions
import { Board } from "./board.js"; // don't forget the .js extension
import Hero from "./hero.js";
import { level1 } from "./levels.js";
const FPS = 60;
const NORMAL_FRAME_TIME = 1000 / FPS;
export const svg = document.querySelector("#game svg");
// create svg group for the field
const landscape = document.createElementNS("http://www.w3.org/2000/svg", "g");
const fungi = document.createElementNS("http://www.w3.org/2000/svg", "g");
const sheeps = document.createElementNS("http://www.w3.org/2000/svg", "g");
const players = document.createElementNS("http://www.w3.org/2000/svg", "g");
const clouds = document.createElementNS("http://www.w3.org/2000/svg", "g");
landscape.setAttribute("id", "landscape");
fungi.setAttribute("id", "fungi");
sheeps.setAttribute("id", "sheeps");
players.setAttribute("id", "players");
clouds.setAttribute("id", "clouds");
// add groups to svg
svg.appendChild(landscape); // include stones, bush, grass(empty)
svg.appendChild(fungi); // includes fungi will add/remove dinamically
svg.appendChild(sheeps); // include sheeps in demonized and normal state
svg.appendChild(players); // include players
svg.appendChild(clouds); // include clouds after fungi explosion with animation
export const mainHero = new Hero(8, 8);
export const board = new Board(svg, mainHero, level1);
svg.viewBox.baseVal.width = board.width;
svg.viewBox.baseVal.height = board.height;
players.appendChild(mainHero.element);
let lastTime = 0;
const step = (timestamp) => {
    const frameTime = timestamp - lastTime;
    lastTime = timestamp;
    board.render(frameTime / NORMAL_FRAME_TIME);
    window.requestAnimationFrame(step);
};
window.requestAnimationFrame(step);
