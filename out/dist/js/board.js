import Hero from "./hero.js";
import Sheep from "./sheep.js";
import { Cell, CELL_SIZE } from "./cell.js";
export class Board {
    // sheep: Sheep[]
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
    constructor(svg, level) {
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
        const sheep = sheepCells.map((cell) => new Sheep(cell.col, cell.row, false, 0));
        const sheepGroup = svg.querySelector("#sheep");
        sheep.forEach((sheep) => {
            sheepGroup.appendChild(sheep.element);
        });
        this.hero = new Hero(heroCell);
        svg.getElementById("players").appendChild(this.hero.element);
        this.width = this.cells[0].length * CELL_SIZE;
        this.height = this.cells.length * CELL_SIZE;
        svg.viewBox.baseVal.width = this.width;
        svg.viewBox.baseVal.height = this.height;
    }
}
