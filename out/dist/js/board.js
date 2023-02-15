import Sheep from "./sheep.js";
export const CELL_SIZE = 5;
const CELL_TYPES = [
    { type: "empty", color: "white" },
    { type: "wall", color: "black" },
    { type: "bush", color: "green" },
];
export class Cell {
    constructor(typeCode, x, y) {
        this.type = CELL_TYPES[typeCode].type;
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.x = x;
        this.y = y;
        this.element.x.baseVal.value = this.x * CELL_SIZE;
        this.element.y.baseVal.value = this.y * CELL_SIZE;
        this.element.width.baseVal.value = CELL_SIZE;
        this.element.height.baseVal.value = CELL_SIZE;
        this.element.style.fill = CELL_TYPES[typeCode].color;
    }
}
export class Board {
    // sheeps: Sheep[]
    render(frameTimeDiff) {
        const heroCell = this.getCell(this.hero.x, this.hero.y);
        if (!heroCell) {
            throw new Error("Hero is out of bounds");
        }
        const heroNeighbours = this.getNeighbors(heroCell);
        this.hero.render(frameTimeDiff, heroNeighbours);
    }
    /**
     * Returns the cell at the given coordinates
     * @param x - x (column) coordinate in svg coordinates
     * @param y - y (row) coordinate in svg coordinates
     */
    getCell(x, y) {
        var _a;
        const cellX = Math.floor((x + CELL_SIZE / 2) / CELL_SIZE);
        const cellY = Math.floor((y + CELL_SIZE / 2) / CELL_SIZE);
        return ((_a = this.cells[cellY]) === null || _a === void 0 ? void 0 : _a[cellX]) || null;
    }
    /**
     * Returns the neighbours of the given cell
     * @param cell - the cell to get the neighbours of
     */
    getNeighbors(cell) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return {
            right: ((_a = this.cells[cell.y]) === null || _a === void 0 ? void 0 : _a[cell.x + 1]) || null,
            left: ((_b = this.cells[cell.y]) === null || _b === void 0 ? void 0 : _b[cell.x - 1]) || null,
            bottom: ((_c = this.cells[cell.y + 1]) === null || _c === void 0 ? void 0 : _c[cell.x]) || null,
            top: ((_d = this.cells[cell.y - 1]) === null || _d === void 0 ? void 0 : _d[cell.x]) || null,
            bottomRight: ((_e = this.cells[cell.y + 1]) === null || _e === void 0 ? void 0 : _e[cell.x + 1]) || null,
            topLeft: ((_f = this.cells[cell.y - 1]) === null || _f === void 0 ? void 0 : _f[cell.x - 1]) || null,
            topRight: ((_g = this.cells[cell.y - 1]) === null || _g === void 0 ? void 0 : _g[cell.x + 1]) || null,
            bottomLeft: ((_h = this.cells[cell.y + 1]) === null || _h === void 0 ? void 0 : _h[cell.x - 1]) || null,
        };
    }
    /**
     * Returns an array of unique random empty cells with the given length
     * @param count - the number of empty cells to find
     */
    getRandomEmptyCells(count) {
        return this.cells
            .flat()
            .filter((cell) => cell.type === "empty")
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
    }
    constructor(svg, hero, level) {
        this.hero = hero;
        svg.getElementById("players").appendChild(hero.element);
        const board = level.board;
        board.forEach((row) => {
            row.push(1);
            row.unshift(1);
        });
        board.push(new Array(board[0].length).fill(1));
        board.unshift(new Array(board[0].length).fill(1));
        const landscape = svg.querySelector("#landscape");
        this.cells = board.map((row, y) => row.map((cellCode, x) => {
            const cell = new Cell(cellCode, x, y);
            landscape.appendChild(cell.element);
            return cell;
        }));
        const emptyCells = this.getRandomEmptyCells(level.sheepCount + 1);
        const [heroCell, ...sheepCells] = emptyCells;
        const sheep = sheepCells.map((cell) => new Sheep(cell.x, cell.y, false, 0));
        const sheepGroup = svg.querySelector("#sheep");
        sheep.forEach((sheep) => {
            sheepGroup.appendChild(sheep.element);
        });
        this.hero.x = heroCell.element.x.baseVal.value;
        this.hero.y = heroCell.element.y.baseVal.value;
        this.width = this.cells[0].length * CELL_SIZE;
        this.height = this.cells.length * CELL_SIZE;
        svg.viewBox.baseVal.width = this.width;
        svg.viewBox.baseVal.height = this.height;
    }
}
/*
function intersectRect(r1: DOMRect, r2: DOMRect, gap = 0) {
  if (
    r2.left - r1.right > gap ||
    r1.left - r2.right > gap ||
    r2.top - r1.bottom > gap ||
    r1.top - r2.bottom > gap
  ) {
    return null
  }
  return {
    left: r1.left - r2.right < 0,
    right: r2.left - r1.right < 0,
    top: r1.top - r2.bottom < 0,
    bottom: r2.top - r1.bottom < 0,
  }
}
*/
