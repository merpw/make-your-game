import { CELL_SIZE } from "./cell.js";
import Creature from "./base.js";
const HERO_SIZE = CELL_SIZE;
const HERO_SPEED = 0.2;
const DIAGONAL_SPEED = Math.sqrt(2) / 2;
const SICK_TIME = 5000;
const SICK_SPEED = HERO_SPEED / 3;
const LIVES = 3;
const MAX_FUNGI = 4;
const SPAWN_LUCKY_TIME = 5000;
export default class Hero extends Creature {
    /** if true, demons won't choose hero's cell */
    get isLucky() {
        return this._isLucky;
    }
    set isLucky(value) {
        this._isLucky = value;
        value
            ? this.element.classList.add("lucky")
            : this.element.classList.remove("lucky");
    }
    get lives() {
        return this._lives;
    }
    set lives(value) {
        this._lives = value;
        const lives = document.getElementById("lives");
        if (lives)
            lives.innerText = value.toString();
    }
    /** Hero's {@link Way}. */
    set way({ up, down, left, right }) {
        var _a, _b, _c, _d, _e, _f;
        this._way = { up, down, left, right };
        this.speedX = 0;
        this.speedY = 0;
        if (up) {
            this.speedY -= this.speed;
            (_a = this.animationManager) === null || _a === void 0 ? void 0 : _a.play("goUp");
        }
        if (down) {
            this.speedY += this.speed;
            (_b = this.animationManager) === null || _b === void 0 ? void 0 : _b.play("goDown");
        }
        if (left) {
            this.speedX -= this.speed;
            (_c = this.animationManager) === null || _c === void 0 ? void 0 : _c.play("goLeft");
        }
        if (right) {
            this.speedX += this.speed;
            (_d = this.animationManager) === null || _d === void 0 ? void 0 : _d.play("goRight");
        }
        if (this.speedX !== 0 && this.speedY !== 0) {
            this.speedX *= DIAGONAL_SPEED;
            this.speedY *= DIAGONAL_SPEED;
        }
        if (this.speedX === 0 && this.speedY === 0) {
            (_e = this.animationManager) === null || _e === void 0 ? void 0 : _e.pause(false);
        }
        else {
            (_f = this.animationManager) === null || _f === void 0 ? void 0 : _f.resume();
        }
    }
    set isSick(value) {
        var _a;
        this._isSick = value;
        if (value) {
            // TODO: maybe improve to prevent multiple calls
            (_a = Hero.onSick) === null || _a === void 0 ? void 0 : _a.call(Hero);
            this.element.style.opacity = "0.5";
            this.speed = SICK_SPEED;
            this.addTimer(() => {
                this.isSick = false;
            }, SICK_TIME);
        }
        else {
            this.element.style.opacity = "1";
            this.speed = HERO_SPEED;
        }
        this.way = this._way; // update speed
    }
    render(frameTimeDiff, currentCell, neighbourCells) {
        if (this.cell.type === "cloud") {
            this.isSick = true;
        }
        this.cell = currentCell;
        this.neighbourCells = neighbourCells;
        const dx = this.speedX * frameTimeDiff;
        const dy = this.speedY * frameTimeDiff;
        let newX = this.x + dx;
        let newY = this.y + dy;
        const collisions = Object.entries(neighbourCells).filter(([, cell]) => cell &&
            cell.type !== "empty" &&
            cell.type !== "portal" &&
            this.isColliding(cell.getRect()));
        const basicCollisions = collisions.filter(([way]) => way === "right" || way === "left" || way === "bottom" || way === "top");
        const diagonalCollision = collisions.find(([way]) => way === "bottomRight" ||
            way === "bottomLeft" ||
            way === "topRight" ||
            way === "topLeft");
        basicCollisions.forEach(([way, cell]) => {
            if (cell.type === "cloud") {
                this.isSick = true;
                return;
            }
            switch (way) {
                case "right":
                    newX = cell.x - this.width;
                    break;
                case "left":
                    newX = cell.x + CELL_SIZE;
                    break;
                case "bottom":
                    newY = cell.y - this.height;
                    break;
                case "top":
                    newY = cell.y + CELL_SIZE;
                    break;
            }
        });
        if (basicCollisions.length === 0 && diagonalCollision) {
            const [way] = diagonalCollision;
            switch (way) {
                case "bottomRight":
                    if (dx > 0)
                        newY -= dx;
                    if (dy > 0)
                        newX -= dy;
                    break;
                case "bottomLeft":
                    if (dx < 0)
                        newY += dx;
                    if (dy > 0)
                        newX += dy;
                    break;
                case "topRight":
                    if (dx > 0)
                        newY += dx;
                    if (dy < 0)
                        newX += dy;
                    break;
                case "topLeft":
                    if (dx < 0)
                        newY -= dx;
                    if (dy < 0)
                        newX -= dy;
                    break;
            }
        }
        // TODO implement increasing of fungi spores distance after explosion.
        /*
          for this, should be added a new property to fungi distance.
          This property should have type number and affect the nighboors cells calculation some way.
          One potion should increase fungi distance by 1.
          So if fungi distance is 1(one potion collected),
          then fungi should be able to spread to max 8 cells, to four directions around central fungi cell.
          If fungi distance is 2(two potions collected),
          then fungi should be able to spread spores to max 12 cells around central cell (x3 to each direction).
        */
        this.x = newX;
        this.y = newY;
    }
    placeFungi() {
        if (this.fungi.length == MAX_FUNGI ||
            this.cell.type !== "empty" ||
            this.cell.secret)
            return false;
        this.cell.type = "fungus";
        this.fungi.push({
            cell: this.cell,
            neighbourCells: {
                top: this.neighbourCells.top,
                bottom: this.neighbourCells.bottom,
                right: this.neighbourCells.right,
                left: this.neighbourCells.left,
            },
        });
        return true;
    }
    terminateFungi() {
        const fungus = this.fungi.shift();
        if (!fungus)
            return false;
        const { cell, neighbourCells } = fungus;
        cell.type = "cloud";
        [
            neighbourCells.top,
            neighbourCells.bottom,
            neighbourCells.right,
            neighbourCells.left,
        ].forEach((cell) => {
            if ((cell === null || cell === void 0 ? void 0 : cell.type) === "empty")
                cell.type = "cloud";
        });
        return true;
    }
    /** Spawn the hero in the given cell */
    spawn(cell) {
        var _a;
        this.cell = cell;
        this.cell.type = "spawn";
        this.isLucky = true;
        this.addTimer(() => {
            this.isLucky = false;
        }, SPAWN_LUCKY_TIME);
        (_a = this.animationManager) === null || _a === void 0 ? void 0 : _a.renderAnimationFrame("goDown");
        this.x = cell.col * CELL_SIZE + (CELL_SIZE - this.width) / 2;
        this.y = cell.row * CELL_SIZE + (CELL_SIZE - this.height) / 2;
        this.way = { up: false, down: false, left: false, right: false };
        this.isSick = false;
        this.fungi.forEach((fungus) => (fungus.cell.type = "empty"));
        this.fungi = [];
    }
    /**
     * Create a new {@link Hero} in the given cell
     *
     * @param cell - the cell where the hero will be created
     */
    constructor(cell) {
        super(HERO_SIZE, 0, 0, "hero");
        this._isLucky = false;
        /** @remarks It's set on first render */
        this.neighbourCells = {};
        this._way = { up: false, down: false, left: false, right: false };
        this.speed = HERO_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this._isSick = false;
        this.fungi = [];
        // x and y will be set in spawn()
        this.lives = LIVES;
        this.spawn(cell);
    }
}
//# sourceMappingURL=hero.js.map