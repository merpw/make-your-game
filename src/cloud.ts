// TODO implement Cloud class.

import { CELL_SIZE } from "./board.js"

//animation and after that remove from svg(not implemented yet)
const CLOUD_SIZE = CELL_SIZE

export default class Cloud {
  element: SVGRectElement
  x: number
  y: number
  width = CLOUD_SIZE
  height = CLOUD_SIZE

  /**remove cloud with 1 second delay*/
  boom() {
    setTimeout(() => {
      this.element.remove()
    }, 1000)
  }

  constructor(x: number, y: number) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    )
    this.element.height.baseVal.value = CLOUD_SIZE
    this.element.width.baseVal.value = CLOUD_SIZE
    this.element.style.fill = "red"
    this.element.style.stroke = "black" // TODO: remove later
    this.element.style.strokeWidth = "1px solid"
    this.element.id = "cloud"
    this.element.x.baseVal.value = x
    this.element.y.baseVal.value = y

    this.x = x
    this.y = y
  }
}
