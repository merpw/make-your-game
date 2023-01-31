export class Cell {
  public type: "empty" | "wall" = "empty"

  constructor(type: "empty" | "wall" = "empty") {
    this.type = type
  }
}

export class Board {
  public cells: Cell[][]
  public width = 0
  public height = 0

  constructor(boardNums: number[][]) {
    this.cells = boardNums.map((row) =>
      row.map((cell) => new Cell(cell === 0 ? "wall" : "empty"))
    )
    this.width = this.cells[0].length
    this.height = this.cells.length
  }
}
