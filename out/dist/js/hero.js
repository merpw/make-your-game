import { CELL_SIZE } from "./board.js";
import Cloud from "./cloud.js";
import Fung from "./fung.js";
import { svg, board } from "./game.js";
import KeyState from "./keys.js";
const HERO_SPEED = 0.4;
const HERO_SIZE = 8;
const DIAGONAL_SPEED = HERO_SPEED * (Math.sqrt(2) / 2);
export default class Hero {
    cloudsXYCoords(cells, x, y) {
        const fungCellX = Math.floor((x + CELL_SIZE / 2) / CELL_SIZE);
        const fungCellY = Math.floor((y + CELL_SIZE / 2) / CELL_SIZE);
        const cloudsCells = {
            right: cells[fungCellY][fungCellX + 1],
            left: cells[fungCellY][fungCellX - 1],
            bottom: cells[fungCellY + 1][fungCellX],
            top: cells[fungCellY - 1][fungCellX],
        };
        // collect new clouds coordinates, for 5 clouds include: center, top, bottom, left, right clouds
        const cloudsCoords = [];
        // center
        cloudsCoords.push({ x: x, y: y });
        // top
        if (cloudsCells.top.type === "empty") {
            cloudsCoords.push({ x: x, y: y - CELL_SIZE / 2 }); // entermediate cloud, to smooth the borders
            cloudsCoords.push({ x: x, y: y - CELL_SIZE });
        }
        // bottom
        if (cloudsCells.bottom.type === "empty") {
            cloudsCoords.push({ x: x, y: y + CELL_SIZE / 2 }); // entermediate cloud, to smooth the borders
            cloudsCoords.push({ x: x, y: y + CELL_SIZE });
        }
        // left
        if (cloudsCells.left.type === "empty") {
            cloudsCoords.push({ x: x - CELL_SIZE / 2, y: y }); // entermediate cloud, to smooth the borders
            cloudsCoords.push({ x: x - CELL_SIZE, y: y });
        }
        // right
        if (cloudsCells.right.type === "empty") {
            cloudsCoords.push({ x: x + CELL_SIZE / 2, y: y }); // entermediate cloud, to smooth the borders
            cloudsCoords.push({ x: x + CELL_SIZE, y: y });
        }
        return cloudsCoords;
    }
    render(frameTimeDiff, cells) {
        const heroCellX = Math.floor((this.x + this.height / 2) / CELL_SIZE);
        const heroCellY = Math.floor((this.y + this.width / 2) / CELL_SIZE);
        const heroCells = {
            right: cells[heroCellY][heroCellX + 1],
            left: cells[heroCellY][heroCellX - 1],
            bottom: cells[heroCellY + 1][heroCellX],
            top: cells[heroCellY - 1][heroCellX],
            bottomRight: cells[heroCellY + 1][heroCellX + 1],
            topLeft: cells[heroCellY - 1][heroCellX - 1],
            topRight: cells[heroCellY - 1][heroCellX + 1],
            bottomLeft: cells[heroCellY + 1][heroCellX - 1],
        };
        const heroRect = {
            top: this.y,
            bottom: this.y + this.height,
            left: this.x,
            right: this.x + this.width,
        };
        this.x += this.speedX * frameTimeDiff;
        this.y += this.speedY * frameTimeDiff;
        if (heroCells.right.type !== "empty" &&
            this.speedX > 0 &&
            heroRect.right >= heroCells.right.element.x.baseVal.value) {
            this.x -= this.speedX * frameTimeDiff;
        }
        if (heroCells.left.type !== "empty" &&
            this.speedX < 0 &&
            heroRect.left <= heroCells.left.element.x.baseVal.value + CELL_SIZE) {
            this.x -= this.speedX * frameTimeDiff;
        }
        if (heroCells.bottom.type !== "empty" &&
            this.speedY > 0 &&
            heroRect.bottom >= heroCells.bottom.element.y.baseVal.value) {
            this.y -= this.speedY * frameTimeDiff;
        }
        if (heroCells.top.type !== "empty" &&
            this.speedY < 0 &&
            heroRect.top <= heroCells.top.element.y.baseVal.value + CELL_SIZE) {
            this.y -= this.speedY * frameTimeDiff;
        }
        this.element.x.baseVal.value = this.x;
        this.element.y.baseVal.value = this.y;
    }
    checkKeys() {
        // TODO add an automatic correction of the player's position directed to the center axis of the row/column, to force the player to move close to the center of cells
        this.speedX = 0;
        this.speedY = 0;
        if (KeyState.s || KeyState.ArrowRight)
            this.speedX += HERO_SPEED;
        if (KeyState.q || KeyState.ArrowLeft)
            this.speedX += -HERO_SPEED;
        if (KeyState.w || KeyState.ArrowUp)
            this.speedY += -HERO_SPEED;
        if (KeyState.a || KeyState.ArrowDown)
            this.speedY += HERO_SPEED;
        if (this.speedX !== 0 && this.speedY !== 0) {
            this.speedX *= DIAGONAL_SPEED / HERO_SPEED;
            this.speedY *= DIAGONAL_SPEED / HERO_SPEED;
        }
        // TODO fungi section
        if (KeyState.f) {
            const fungibox = svg.querySelector("#fungi");
            // determine the position of the new fung, it should be in the center of the cell
            const nearCellCenterX = Math.floor((this.x + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE;
            const nearCellCenterY = Math.floor((this.y + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE;
            const fung = new Fung(nearCellCenterX, nearCellCenterY);
            this.fungi.push(fung);
            fungibox.appendChild(fung.element);
        } // TODO mount the fung
        if (KeyState.t) {
            // remove all fungi
            const clouds = svg.querySelector("#clouds");
            this.fungi.forEach((fung) => {
                const x = fung.element.x.baseVal.value;
                const y = fung.element.y.baseVal.value;
                fung.element.remove();
                const cloudsXY = this.cloudsXYCoords(board.cells, x, y);
                cloudsXY.forEach((c) => {
                    const cloud = new Cloud(c.x, c.y);
                    clouds.appendChild(cloud.element);
                    cloud.boom();
                });
            });
            this.fungi = [];
        } // TODO terminate fungi
    }
    constructor(x, y) {
        this.width = HERO_SIZE;
        this.height = HERO_SIZE;
        this.speedX = 0;
        this.speedY = 0;
        this.fungi = [];
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.element.height.baseVal.value = HERO_SIZE;
        this.element.width.baseVal.value = HERO_SIZE;
        this.element.style.fill = "rebeccapurple";
        this.element.id = "mainHero";
        this.element.x.baseVal.value = x;
        this.element.y.baseVal.value = y;
        this.x = x;
        this.y = y;
    }
}
