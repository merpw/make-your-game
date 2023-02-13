import { CELL_SIZE } from "./board.js";
// import Cloud from "./cloud.js"
// import Fung from "./fung.js"
// import { svg, board } from "./game.js"
// import KeyState from "./keys.js"
const SHEEP_SPEED = 0.1;
const SHEEP_SIZE = CELL_SIZE;
// const DIAGONAL_SPEED = SHEEP_SPEED * (Math.sqrt(2) / 2)
export default class Sheep {
    render(frameTimeDiff, cells) {
        this.move(frameTimeDiff, cells);
        this.element.x.baseVal.value = this.x;
        this.element.y.baseVal.value = this.y;
    }
    // TODO: with high chance can be problems at least with speed of sheep
    /**
     * move sheep between two points(cell centers)
     * OLD DESCRIPTION FROM MY OTHER PROJECT CODE
     * character moving along court
     * @param	dt [s] - time elapsed from previous moment. 0 = start new process
     * @param	scx1 - real coordinate of end moving, along x axis
     * @param	scy1 - real coordinate of end moving, along y axis
     */
    move(dt, cells, scx1 = this.x, scy1 = this.y) {
        if (dt > 0 && this.dt < this.t) {
            //continue previous move
            this.dt += dt;
            this.moveX();
            this.moveY();
        }
        else if (dt === 0) {
            //abort not completion move and/or start new move
            this.dt = 0;
            this.scx0 = this.x;
            this.scy0 = this.y;
            this.scx1 = scx1;
            this.scy1 = scy1;
            this.sdx = this.scx1 - this.scx0;
            this.sdy = this.scy1 - this.scy0;
            this.t =
                Math.sqrt(this.sdx * this.sdx + this.sdy * this.sdy) / SHEEP_SPEED;
        }
        else {
            //previous move completed, time to start new move. Our sheep is not staying in one place
            this.moveToNextCell(cells);
        }
    }
    /**analize the cells available for move to the next position, and execute new move */
    moveToNextCell(cells) {
        const sheepCellX = Math.floor((this.x + this.height / 2) / CELL_SIZE);
        const sheepCellY = Math.floor((this.y + this.width / 2) / CELL_SIZE);
        this.fixDisplacementBeforeNewMove(sheepCellX, sheepCellY);
        const sheepCells = {
            right: cells[sheepCellY][sheepCellX + 1],
            left: cells[sheepCellY][sheepCellX - 1],
            bottom: cells[sheepCellY + 1][sheepCellX],
            top: cells[sheepCellY - 1][sheepCellX],
        };
        const newDirection = this.getNewRandomDirection(sheepCells);
        switch (newDirection) {
            case 1:
                this.move(0, cells, this.x + CELL_SIZE, this.y);
                break;
            case 2:
                this.move(0, cells, this.x, this.y + CELL_SIZE);
                break;
            case 3:
                this.move(0, cells, this.x - CELL_SIZE, this.y);
                break;
            case 4:
                this.move(0, cells, this.x, this.y - CELL_SIZE);
                break;
            default:
                break;
        }
    }
    fixDisplacementBeforeNewMove(sheepCellX, sheepCellY) {
        this.x = sheepCellX * CELL_SIZE;
        this.y = sheepCellY * CELL_SIZE;
    }
    /**creates array and fill it using
     *  @param n number
     *  @param multiplier length of the array
     *  */
    bigChanceX(n, multiplier) {
        // create array of n with random length
        return Array.from({ length: multiplier }, () => n);
    }
    /**get new random direction for sheep, but try to decrease chances to move back */
    getNewRandomDirection(sheepCells) {
        /**array of directions available for move */
        let adi = [];
        const obstacles = this.demonized ? ["wall", "bush"] : ["wall"];
        let x1, x2, x3, x4; // right, bottom, left, top coefficients
        // forcing sheep to move more by sides if possible
        if (this.direction === 1) {
            //right, so increase top and bottom chances
            x1 = this.minorMultiplier;
            x2 = this.majorMultiplier;
            x3 = this.backMultiplier;
            x4 = this.majorMultiplier;
        }
        else if (this.direction === 2) {
            //bottom, so increase right and left chances
            x1 = this.majorMultiplier;
            x2 = this.minorMultiplier;
            x3 = this.majorMultiplier;
            x4 = this.backMultiplier;
        }
        else if (this.direction === 3) {
            //left, so increase top and bottom chances
            x1 = this.backMultiplier;
            x2 = this.majorMultiplier;
            x3 = this.minorMultiplier;
            x4 = this.majorMultiplier;
        }
        else if (this.direction === 4) {
            //top, so increase right and left chances
            x1 = this.majorMultiplier;
            x2 = this.backMultiplier;
            x3 = this.majorMultiplier;
            x4 = this.minorMultiplier;
        }
        else {
            //no direction, so equal chances
            x1 = 1;
            x2 = 1;
            x3 = 1;
            x4 = 1;
        }
        // add directions to array adi, if they are not obstacles
        if (obstacles.indexOf(sheepCells.right.type) === -1) {
            adi = adi.concat(this.bigChanceX(1, x1)); //more chance to do not go back
        }
        if (obstacles.indexOf(sheepCells.bottom.type) === -1) {
            adi = adi.concat(this.bigChanceX(2, x2));
        }
        if (obstacles.indexOf(sheepCells.left.type) === -1) {
            adi = adi.concat(this.bigChanceX(3, x3));
        }
        if (obstacles.indexOf(sheepCells.top.type) === -1) {
            adi = adi.concat(this.bigChanceX(4, x4));
        }
        if (adi.length === 0) {
            //no way to move
            return 0;
        }
        // this.shuffleArray(adi)
        // get random direction from available directions
        const rd = adi[Math.floor(Math.random() * adi.length)];
        this.direction = rd;
        return rd;
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    /** @param direction 1 (positive X), 2 (positive Y), 3 (negative X), 4 (negative Y) */
    constructor(x, y, demonized, direction) {
        this.width = SHEEP_SIZE;
        this.height = SHEEP_SIZE;
        /**direction of sheep moving. 1 - positive X, 2 - positive Y, 3 - negative X, 4 - negative Y */
        this.direction = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.scx = 0;
        this.scy = 0;
        this.scx0 = 0;
        this.scy0 = 0;
        this.sdx = 0;
        this.sdy = 0;
        this.dt = 0;
        this.t = 0;
        this.cx = 0;
        this.cy = 0;
        this.scx1 = 0;
        this.scy1 = 0;
        /** character moving along x axis*/
        this.moveX = () => (this.x = this.scx0 + (this.sdx * this.dt) / this.t);
        /** character moving along y axis*/
        this.moveY = () => (this.y = this.scy0 + (this.sdy * this.dt) / this.t);
        this.majorMultiplier = 40; // increase chances to move in some major direction
        this.minorMultiplier = 20; // increase chances to move in some direction
        this.backMultiplier = 1; // not increase chances to move back(but still possible), so it is 1
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.element.height.baseVal.value = SHEEP_SIZE;
        this.element.width.baseVal.value = SHEEP_SIZE;
        this.demonized = demonized;
        if (this.demonized) {
            this.element.style.fill = "red";
        }
        else {
            this.element.style.fill = "orange";
        }
        this.element.id = "sheep";
        this.element.x.baseVal.value = x;
        this.element.y.baseVal.value = y;
        this.x = x;
        this.y = y;
        this.direction = direction || 1;
    }
}
