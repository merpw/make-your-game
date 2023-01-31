export class Cell {
  constructor(type = "empty") {
    this.type = "empty"
    this.type = type
  }
}
export class Board {
  constructor(boardNums) {
    this.width = 0
    this.height = 0
    this.cells = boardNums.map((row) =>
      row.map((cell) => new Cell(cell === 0 ? "wall" : "empty"))
    )
    this.width = this.cells[0].length
    this.height = this.cells.length
  }
}
