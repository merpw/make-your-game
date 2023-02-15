import Cloud from "./cloud.js";
import Fung from "./fung.js";
import { svg, board } from "./game.js";
import KeyState from "./keys.js";
import { CELL_SIZE } from "./cell.js";
const HERO_SPEED = 0.2;
const HERO_SIZE = CELL_SIZE;
const DIAGONAL_SPEED = HERO_SPEED * (Math.sqrt(2) / 2);
export default class Hero {
    cloudsXYCoords(cells, x, y) {
        // TODO: refactor this
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
    render(frameTimeDiff, neighbourCells) {
        if (this.speedX === 0 && this.speedY === 0)
            return;
        const heroRect = {
            left: this.x,
            right: this.x + HERO_SIZE,
            top: this.y,
            bottom: this.y + HERO_SIZE,
        };
        let dx = this.speedX * frameTimeDiff;
        let dy = this.speedY * frameTimeDiff;
        if (neighbourCells.right &&
            neighbourCells.right.type !== "empty" &&
            this.speedX > 0 &&
            heroRect.right >= neighbourCells.right.element.x.baseVal.value) {
            dx = 0;
        }
        if (neighbourCells.left &&
            neighbourCells.left.type !== "empty" &&
            this.speedX < 0 &&
            heroRect.left <= neighbourCells.left.element.x.baseVal.value + CELL_SIZE) {
            dx = 0;
        }
        if (neighbourCells.bottom &&
            neighbourCells.bottom.type !== "empty" &&
            this.speedY > 0 &&
            heroRect.bottom >= neighbourCells.bottom.element.y.baseVal.value) {
            dy = 0;
        }
        if (neighbourCells.top &&
            neighbourCells.top.type !== "empty" &&
            this.speedY < 0 &&
            heroRect.top <= neighbourCells.top.element.y.baseVal.value + CELL_SIZE) {
            dy = 0;
        }
        // TODO: refactor collision detection
        // for (const ways in neighbourCells) {
        //   const cell = neighbourCells[ways as keyof NeighbourCells]
        //   if (!cell) continue
        //   const cellRect = {
        //     left: cell.x,
        //     right: cell.x + CELL_SIZE,
        //     top: cell.y,
        //     bottom: cell.y + CELL_SIZE,
        //   }
        //   if (isColliding(heroRect, cellRect)) {
        //     dx = 0
        //     dy = 0
        //     break
        //   }
        // }
        this.x += dx;
        this.y += dy;
        this.element.x.baseVal.value = this.x;
        this.element.y.baseVal.value = this.y;
    }
    checkKeys() {
        // TODO add an automatic correction of the player's position directed to the center axis of the row/column, to force the player to move close to the center of cells
        this.speedX = 0;
        this.speedY = 0;
        if (KeyState.d || KeyState.ArrowRight)
            this.speedX += HERO_SPEED;
        if (KeyState.a || KeyState.ArrowLeft)
            this.speedX += -HERO_SPEED;
        if (KeyState.w || KeyState.ArrowUp)
            this.speedY += -HERO_SPEED;
        if (KeyState.s || KeyState.ArrowDown)
            this.speedY += HERO_SPEED;
        if (this.speedX !== 0 && this.speedY !== 0) {
            this.speedX *= DIAGONAL_SPEED / HERO_SPEED;
            this.speedY *= DIAGONAL_SPEED / HERO_SPEED;
        }
        // TODO fungi section
        if (KeyState.o) {
            if (this.fungi.length < 4) {
                // TODO HARDCODED constant for the max number of fungi
                const fungibox = svg.querySelector("#fungi");
                // determine the position of the new fung, it should be in the center of the cell
                const nearCellCenterX = Math.floor((this.x + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE;
                const nearCellCenterY = Math.floor((this.y + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE;
                if (!this.fungi.some((fung) => fung.element.x.baseVal.value === nearCellCenterX &&
                    fung.element.y.baseVal.value === nearCellCenterY)) {
                    // the cell is not already occupied by a fung
                    const fung = new Fung(nearCellCenterX, nearCellCenterY);
                    this.fungi.push(fung);
                    fungibox.appendChild(fung.element);
                }
            }
        } // TODO mount the fung
        if (KeyState.p) {
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
    /**
     * Create a new Hero in the given cell
     *
     * @param cell the cell where the hero will be created
     */
    constructor(cell) {
        this.speedX = 0;
        this.speedY = 0;
        this.fungi = [];
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.element.height.baseVal.value = HERO_SIZE;
        this.element.width.baseVal.value = HERO_SIZE;
        this.element.style.fill = "rebeccapurple";
        this.element.id = "mainHero";
        this.x = cell.x * CELL_SIZE;
        this.y = cell.y * CELL_SIZE;
        this.element.x.baseVal.value = this.x;
        this.element.y.baseVal.value = this.y;
    }
}
const isColliding = (rect1, rect2) => {
    return (rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top);
};
