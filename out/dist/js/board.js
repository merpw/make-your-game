const CELL_SIZE = 8;
const CELL_TYPES = [
    { type: "empty", color: "white" },
    { type: "wall", color: "black" },
    { type: "bush", color: "green" }
];
export class Cell {
    constructor(typeCode) {
        this.type = CELL_TYPES[typeCode].type;
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.element.width.baseVal.value = CELL_SIZE;
        this.element.height.baseVal.value = CELL_SIZE;
        this.element.style.fill = CELL_TYPES[typeCode].color;
    }
}
export class Board {
    render(frameTimeDiff) {
        this.renderHero(frameTimeDiff);
        this.renderFunges(frameTimeDiff);
    }
    renderFunges(frameTimeDiff) {
    }
    renderHero(frameTimeDiff) {
        const heroCellX = Math.floor((this.hero.x + this.hero.height / 2) / CELL_SIZE);
        const heroCellY = Math.floor((this.hero.y + this.hero.width / 2) / CELL_SIZE);
        const heroCells = {
            right: this.cells[heroCellY][heroCellX + 1],
            left: this.cells[heroCellY][heroCellX - 1],
            bottom: this.cells[heroCellY + 1][heroCellX],
            top: this.cells[heroCellY - 1][heroCellX],
            bottomRight: this.cells[heroCellY + 1][heroCellX + 1],
            topLeft: this.cells[heroCellY - 1][heroCellX - 1],
            topRight: this.cells[heroCellY - 1][heroCellX + 1],
            bottomLeft: this.cells[heroCellY + 1][heroCellX - 1]
        };
        const heroRect = {
            top: this.hero.y,
            bottom: this.hero.y + this.hero.height,
            left: this.hero.x,
            right: this.hero.x + this.hero.width
        };
        this.hero.x += this.hero.speedX * frameTimeDiff;
        this.hero.y += this.hero.speedY * frameTimeDiff;
        if (heroCells.right.type !== "empty" &&
            this.hero.speedX > 0 &&
            heroRect.right >= heroCells.right.element.x.baseVal.value) {
            this.hero.x -= this.hero.speedX * frameTimeDiff;
        }
        if (heroCells.left.type !== "empty" &&
            this.hero.speedX < 0 &&
            heroRect.left <= heroCells.left.element.x.baseVal.value + CELL_SIZE) {
            this.hero.x -= this.hero.speedX * frameTimeDiff;
        }
        if (heroCells.bottom.type !== "empty" &&
            this.hero.speedY > 0 &&
            heroRect.bottom >= heroCells.bottom.element.y.baseVal.value) {
            this.hero.y -= this.hero.speedY * frameTimeDiff;
        }
        if (heroCells.top.type !== "empty" &&
            this.hero.speedY < 0 &&
            heroRect.top <= heroCells.top.element.y.baseVal.value + CELL_SIZE) {
            this.hero.y -= this.hero.speedY * frameTimeDiff;
        }
        this.hero.element.x.baseVal.value = this.hero.x;
        this.hero.element.y.baseVal.value = this.hero.y;
    }
    getRandomEmptyCell() {
        const x = Math.floor(Math.random() * this.cells[0].length);
        const y = Math.floor(Math.random() * this.cells.length);
        if (this.cells[y][x].type !== "empty") {
            return this.getRandomEmptyCell();
        }
        return this.cells[y][x];
    }
    constructor(svg, hero, boardNums) {
        this.fungi = [];
        this.hero = hero;
        boardNums.forEach((row) => {
            row.push(1);
            row.unshift(1);
        });
        boardNums.push(new Array(boardNums[0].length).fill(1));
        boardNums.unshift(new Array(boardNums[0].length).fill(1));
        this.cells = boardNums.map((row) => row.map((cellCode) => new Cell(cellCode)));
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                cell.element.x.baseVal.value = x * CELL_SIZE;
                cell.element.y.baseVal.value = y * CELL_SIZE;
                svg.appendChild(cell.element);
            });
        });
        const heroCell = this.getRandomEmptyCell();
        this.hero.x =
            heroCell.element.x.baseVal.value + (CELL_SIZE - this.hero.width) / 2;
        this.hero.y =
            heroCell.element.y.baseVal.value + (CELL_SIZE - this.hero.height) / 2;
        this.width = this.cells[0].length * CELL_SIZE;
        this.height = this.cells.length * CELL_SIZE;
    }
}
function intersectRect(r1, r2, gap = 0) {
    if (r2.left - r1.right > gap ||
        r1.left - r2.right > gap ||
        r2.top - r1.bottom > gap ||
        r1.top - r2.bottom > gap) {
        return null;
    }
    return {
        left: r1.left - r2.right < 0,
        right: r2.left - r1.right < 0,
        top: r1.top - r2.bottom < 0,
        bottom: r2.top - r1.bottom < 0
    };
}
