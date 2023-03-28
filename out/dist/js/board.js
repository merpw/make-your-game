import Hero from "./hero.js";
import Sheep from "./sheep.js";
import Cell, { CELL_SIZE, PORTAL_EXIT_TIME, } from "./cell.js";
import Timer from "./timer.js";
/** camera height in cells */
const CAMERA_HEIGHT = 7;
const CAMERA_ASPECT_RATIO = 16 / 9;
const MOBILE_CAMERA_ASPECT_RATIO = 1;
/** Coefficient to change camera movement inertia, should be 0..1
 *
 * for 1 it's instantly following hero, for 0 there's no movement at all */
const VIEW_SPEED = 0.1;
/** if camera is closer than this to hero, it won't move */
const VIEW_SENSITIVITY = 0.5;
const SCORES = {
    demonToSheep: +100,
    sheepToDemon: -50,
    /** Bonus for left time, per second */
    timeBonus: +5,
    /** Bonus for left lives, per live */
    livesBonus: +100,
    potion: +100,
    /** Penalty for self poisoning, per frame in cloud (max ≈90) */
    selfPoisoning: -5,
};
export class Board {
    getRandomPotionEffect() {
        return this.POTION_EFFECTS[Math.floor(Math.random() * this.POTION_EFFECTS.length)];
    }
    get score() {
        return this._score;
    }
    set score(value) {
        value < 0 && (value = 0);
        this._score = value;
        const score = document.getElementById("score");
        score && (score.innerText = value.toString());
    }
    get time() {
        return this._time;
    }
    set time(value) {
        this._time = value;
        if (value < 0) {
            this.over();
            return;
        }
        const time = document.getElementById("time");
        time && (time.innerText = value.toString());
    }
    get isPaused() {
        return this._isPaused;
    }
    set isPaused(value) {
        var _a, _b, _c, _d;
        if (this.isOver)
            return;
        this._isPaused = value;
        if (value) {
            (_a = document.getElementById("game")) === null || _a === void 0 ? void 0 : _a.classList.add("paused");
            this.timer.pause();
            (_b = this.eventTimer) === null || _b === void 0 ? void 0 : _b.pause();
            this.hero.pause();
            this.cells.flat().forEach((cell) => cell.pause());
            this.sheepStorage.all.forEach((sheep) => sheep.pause());
        }
        else {
            (_c = document.getElementById("game")) === null || _c === void 0 ? void 0 : _c.classList.remove("paused");
            this.timer.resume();
            (_d = this.eventTimer) === null || _d === void 0 ? void 0 : _d.resume();
            this.hero.resume();
            this.cells.flat().forEach((cell) => cell.resume());
            this.sheepStorage.all.forEach((sheep) => sheep.resume());
        }
    }
    /**
     * Sets {@link cameraTargetX} and {@link cameraTargetY} to show hero in the center of the view
     *
     * Cares about camera boundaries
     * */
    centerCamera() {
        const heroCenterX = this.hero.x + this.hero.width / 2;
        const heroCenterY = this.hero.y + this.hero.height / 2;
        const x = Math.max(0, Math.min(heroCenterX - (this.cameraWidth * CELL_SIZE) / 2, this.width - this.cameraWidth * CELL_SIZE));
        const y = Math.max(0, Math.min(heroCenterY - (this.cameraHeight * CELL_SIZE) / 2, this.height - this.cameraHeight * CELL_SIZE));
        if (this.cameraTargetX !== x || this.cameraTargetY !== y) {
            this.cameraTargetX = x;
            this.cameraTargetY = y;
        }
    }
    /** Changes board {@link element}'s viewBox to move camera to {@link cameraTargetX} and {@link cameraTargetY} */
    renderCamera() {
        if (this.cameraX === undefined || this.cameraY === undefined) {
            this.cameraX = this.cameraTargetX;
            this.cameraY = this.cameraTargetY;
        }
        else {
            if (Math.abs(this.cameraTargetX - this.cameraX) < VIEW_SENSITIVITY &&
                Math.abs(this.cameraTargetY - this.cameraY) < VIEW_SENSITIVITY) {
                return;
            }
            this.cameraX += (this.cameraTargetX - this.cameraX) * VIEW_SPEED;
            this.cameraY += (this.cameraTargetY - this.cameraY) * VIEW_SPEED;
        }
        this.element.setAttribute("viewBox", `${this.cameraX.toFixed(2)} ${this.cameraY.toFixed(2)} ${this.cameraWidth * CELL_SIZE} ${this.cameraHeight * CELL_SIZE}`);
    }
    over(isWin = false) {
        var _a, _b, _c;
        this.isOver = true;
        this.timer.stop();
        (_a = this.eventTimer) === null || _a === void 0 ? void 0 : _a.stop();
        this.hero.stopTimer();
        this.cells.flat().forEach((cell) => cell.stopTimer());
        this.sheepStorage.all.forEach((sheep) => sheep.stopTimer());
        if (isWin) {
            this.score =
                this.score +
                    this.time * SCORES.timeBonus +
                    this.hero.lives * SCORES.livesBonus;
        }
        (_b = document.getElementById("game")) === null || _b === void 0 ? void 0 : _b.classList.remove("paused");
        (_c = document.getElementById("game")) === null || _c === void 0 ? void 0 : _c.classList.add(isWin ? "win" : "over");
    }
    render(frameTimeDiff, time) {
        if (this.isPaused || this.isOver)
            return;
        if (this.hero.speedX !== 0 || this.hero.speedY !== 0) {
            this.centerCamera();
        }
        this.renderCamera();
        this.renderAnimations(time);
        const heroCell = this.getCell(this.hero);
        if (!heroCell) {
            throw new Error("Hero is out of bounds");
        }
        if (heroCell.secret === "potion") {
            this.score += SCORES.potion;
            heroCell.secret = undefined;
            heroCell.type = "empty";
            this.hero.isSick = false;
            const effect = this.getRandomPotionEffect();
            effect();
        }
        if (heroCell.type === "portal") {
            heroCell.type = "portalActivated";
            this.eventTimer = new Timer(() => {
                if (this.hero.cell == this.portalCell) {
                    this.hero.setAsset("none");
                    this.portalCell.type = "empty";
                    this.over(true);
                }
                this.eventTimer = null;
            }, PORTAL_EXIT_TIME, false);
        }
        const heroNeighbours = this.getNeighbors(heroCell);
        this.hero.render(frameTimeDiff, heroCell, heroNeighbours);
        this.sheepStorage.all.forEach((sheep) => {
            if (!sheep.targetCell) {
                const sheepCell = this.getCell(sheep);
                if (!sheepCell) {
                    throw new Error("Sheep is out of bounds");
                }
                if (sheepCell.type === "bush") {
                    sheepCell.type = "empty";
                }
                const sheepNeighbours = this.getNeighbors(sheepCell);
                if (sheep.demonized && this.hero.isLucky) {
                    const heroEntry = Object.entries(sheepNeighbours).find(([, cell]) => cell === heroCell);
                    if (heroEntry) {
                        const heroDirection = heroEntry[0];
                        sheepNeighbours[heroDirection] = null;
                    }
                }
                sheep.setRandomDirection(sheepNeighbours);
            }
            sheep.render(frameTimeDiff);
        });
        const heroRect = this.hero.getRect();
        this.sheepStorage.demonized.forEach((demon) => {
            if (demon.isColliding(heroRect)) {
                this.hero.lives--;
                if (this.hero.lives > 0) {
                    this.hero.spawn(this.getRandomEmptyCell());
                    this.centerCamera();
                }
                else {
                    this.over();
                }
            }
            this.sheepStorage.basic.forEach((sheep) => {
                if (demon.isColliding(sheep.getRect())) {
                    sheep.demonized = true;
                    this.score += SCORES.sheepToDemon;
                }
            });
        });
        /* demons that had contact with cloud and may become sheep */
        const weakDemons = [];
        /* demons that are safe from cloud */
        const safeDemons = [];
        this.sheepStorage.demonized.forEach((demon) => {
            var _a;
            return demon.fromCell.type === "cloud" || ((_a = demon.targetCell) === null || _a === void 0 ? void 0 : _a.type) === "cloud"
                ? weakDemons.push(demon)
                : safeDemons.push(demon);
        });
        weakDemons.forEach((weakDemon) => {
            const weakDemonRect = weakDemon.getRect();
            if (!safeDemons.some((safeDemon) => safeDemon.isColliding(weakDemonRect))) {
                // there's no safe demon that can keep the weak demon demonized (by sharing the devil's power)
                weakDemon.demonized = false;
                this.score += SCORES.demonToSheep;
            }
        });
    }
    renderAnimations(time) {
        var _a;
        (_a = this.hero.animationManager) === null || _a === void 0 ? void 0 : _a.render(time);
        this.sheepStorage.all.forEach((sheep) => { var _a; return (_a = sheep.animationManager) === null || _a === void 0 ? void 0 : _a.render(time); });
        this.cells.flat().forEach((cell) => { var _a; return (_a = cell.animationManager) === null || _a === void 0 ? void 0 : _a.render(time); });
    }
    /**
     * Return a cell of the center of the given object
     * @param x - horizontal coordinate in svg coordinates
     * @param y - vertical coordinate in svg coordinates
     * @param height - height of the object
     * @param width - width of the object
     */
    getCell({ x, y, height, width, }) {
        var _a;
        const cellCol = Math.floor((x + width / 2) / CELL_SIZE);
        const cellRow = Math.floor((y + height / 2) / CELL_SIZE);
        return ((_a = this.cells[cellRow]) === null || _a === void 0 ? void 0 : _a[cellCol]) || null;
    }
    /**
     * Returns the neighbour cells of the given cell
     * @param cell - the {@link Cell} to get the neighbours of
     */
    getNeighbors(cell) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return {
            right: ((_a = this.cells[cell.row]) === null || _a === void 0 ? void 0 : _a[cell.col + 1]) || null,
            left: ((_b = this.cells[cell.row]) === null || _b === void 0 ? void 0 : _b[cell.col - 1]) || null,
            bottom: ((_c = this.cells[cell.row + 1]) === null || _c === void 0 ? void 0 : _c[cell.col]) || null,
            top: ((_d = this.cells[cell.row - 1]) === null || _d === void 0 ? void 0 : _d[cell.col]) || null,
            bottomRight: ((_e = this.cells[cell.row + 1]) === null || _e === void 0 ? void 0 : _e[cell.col + 1]) || null,
            topLeft: ((_f = this.cells[cell.row - 1]) === null || _f === void 0 ? void 0 : _f[cell.col - 1]) || null,
            topRight: ((_g = this.cells[cell.row - 1]) === null || _g === void 0 ? void 0 : _g[cell.col + 1]) || null,
            bottomLeft: ((_h = this.cells[cell.row + 1]) === null || _h === void 0 ? void 0 : _h[cell.col - 1]) || null,
        };
    }
    /**
     * Returns an array of unique random empty and safe cells with the given length
     * @param count - the number of empty cells to find
     */
    getRandomEmptyCells(count) {
        return this.cells
            .flat()
            .filter((cell) => this.isCellEmpty(cell))
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
    }
    constructor(level) {
        this.POTION_EFFECTS = [
            () => (this.hero.isLucky = true),
            () => (this.hero.isSick = true),
            () => this.hero.spawn(this.getRandomEmptyCell()),
            () => this.sheepStorage.basic.forEach((sheep) => (sheep.demonized = true)),
            () => this.sheepStorage.demonized.forEach((sheep) => (sheep.demonized = false)),
            () => this.hero.lives++,
            () => this.hero.lives--,
            () => (this.time += 60),
            // TODO: maybe add extended fungi effect
        ];
        this.sheepStorage = {
            all: new Set(),
            demonized: new Set(),
            basic: new Set(),
        };
        /** Main {@link Timer} in {@link setInterval} mode that counts down the time. */
        this.timer = new Timer(() => this.time--, 1000, true);
        /** Secondary {@link Timer} in {@link setTimeout} mode for single delayed events */
        this.eventTimer = null;
        this._isPaused = false;
        this.isOver = false;
        /** Returns true if the given cell is empty and safe (there's no demons) */
        this.isCellEmpty = (cell) => cell.type === "empty" &&
            ![...this.sheepStorage.demonized].some((sheep) => sheep.targetCell === cell || sheep.fromCell === cell);
        /** Returns one random empty and safe cell */
        this.getRandomEmptyCell = () => this.getRandomEmptyCells(1)[0];
        this.time = level.time;
        this.score = 0;
        const board = level.board.map((row) => [1, ...row, 1]);
        board.push(new Array(board[0].length).fill(1));
        board.unshift(new Array(board[0].length).fill(1));
        this.cells = board.map((row, y) => row.map((cellCode, x) => new Cell(cellCode, x, y)));
        const bushes = this.cells.flat().filter((cell) => cell.type === "bush");
        const [portalCell, potionCell] = bushes.sort(() => Math.random() - 0.5);
        portalCell.secret = "portal";
        this.portalCell = portalCell;
        potionCell.secret = "potion";
        const sheepCells = this.getRandomEmptyCells(level.sheepCount);
        Sheep.onDemonization = (sheep) => {
            if (sheep.demonized) {
                this.sheepStorage.demonized.add(sheep);
                this.sheepStorage.basic.delete(sheep);
                if (this.portalCell.type === "portal") {
                    this.portalCell.type = "empty";
                }
            }
            else {
                this.sheepStorage.demonized.delete(sheep);
                this.sheepStorage.basic.add(sheep);
                if (this.sheepStorage.demonized.size === 0) {
                    this.portalCell.type = "portal";
                }
            }
        };
        sheepCells.forEach((cell) => this.sheepStorage.all.add(new Sheep(cell, this.getNeighbors(cell))));
        const heroCell = this.getRandomEmptyCell();
        Hero.onSick = () => {
            this.score += SCORES.selfPoisoning;
        };
        this.hero = new Hero(heroCell);
        const svg = document.getElementById("board");
        if (!svg) {
            throw new Error("No #board svg element found");
        }
        this.height = this.cells.length * CELL_SIZE;
        this.width = this.cells[0].length * CELL_SIZE;
        this.element = svg;
        this.cameraHeight = CAMERA_HEIGHT;
        this.cameraWidth = Math.floor((window.innerWidth < 600
            ? MOBILE_CAMERA_ASPECT_RATIO
            : CAMERA_ASPECT_RATIO) * this.cameraHeight);
        this.centerCamera();
    }
}
//# sourceMappingURL=board.js.map