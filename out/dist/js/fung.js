// TODO implement Fung class.
// Follow the Hero class as an example, with modifications.
// no move required, but demolution by pressing T keyboard key,
import { CELL_SIZE } from "./board.js";
// and mounting by pressing F keyboard key.
const FUNG_SIZE = CELL_SIZE;
export default class Fung {
    constructor(x, y) {
        this.width = FUNG_SIZE;
        this.height = FUNG_SIZE;
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.element.height.baseVal.value = FUNG_SIZE;
        this.element.width.baseVal.value = FUNG_SIZE;
        this.element.style.fill = "pink";
        this.element.id = "fung";
        this.element.x.baseVal.value = x;
        this.element.y.baseVal.value = y;
        this.x = x;
        this.y = y;
    }
}
