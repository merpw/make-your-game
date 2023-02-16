export const CELL_SIZE = 5;
const CELL_TYPES = [
    { type: "empty", color: "white" },
    { type: "wall", color: "black" },
    { type: "bush", color: "green" },
];
export class Cell {
    constructor(typeCode, col, row) {
        this.type = CELL_TYPES[typeCode].type;
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.col = col;
        this.row = row;
        this.element.x.baseVal.value = this.col * CELL_SIZE;
        this.element.y.baseVal.value = this.row * CELL_SIZE;
        this.element.width.baseVal.value = CELL_SIZE;
        this.element.height.baseVal.value = CELL_SIZE;
        this.element.style.fill = CELL_TYPES[typeCode].color;
    }
}
