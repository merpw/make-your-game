// TODO implement Fung class.
// Follow the Hero class as an example, with modifications.
// no move required, but demolution by pressing T keyboard key,

import { CELL_SIZE } from "./board.js"

// and mounting by pressing F keyboard key.
const FUNG_SIZE = CELL_SIZE

export default class Fung {
  element: SVGRectElement
  x: number
  y: number
  width = FUNG_SIZE
  height = FUNG_SIZE

  constructor(x: number, y: number) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
    this.element.height.baseVal.value = FUNG_SIZE
    this.element.width.baseVal.value = FUNG_SIZE
    this.element.style.fill = "pink"
    this.element.id = "fung"
    this.element.x.baseVal.value = x
    this.element.y.baseVal.value = y

    this.x = x
    this.y = y
  }
}
