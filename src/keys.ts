import { Way } from "./hero"
import { Board } from "./board"

const CONTROLS = {
  move: {
    Up: ["w", "ArrowUp"],
    Down: ["s", "ArrowDown"],
    Left: ["a", "ArrowLeft"],
    Right: ["d", "ArrowRight"],
  },
  PlaceFungi: "f",
  TerminateFungi: "t",

  Restart: "r",
  Pause: "p",
}

const MoveInputState = new Map<string, boolean>(
  Object.values(CONTROLS.move).flatMap((keys) =>
    keys.map((key) => [key, false])
  )
)

MoveInputState.get("ArrayExpression")

const getWay = (): Way => ({
  up: CONTROLS.move.Up.some((key) => MoveInputState.get(key)),
  down: CONTROLS.move.Down.some((key) => MoveInputState.get(key)),
  left: CONTROLS.move.Left.some((key) => MoveInputState.get(key)),
  right: CONTROLS.move.Right.some((key) => MoveInputState.get(key)),
})

const takeControl = (board: Board) => {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key

    if (MoveInputState.has(key)) {
      MoveInputState.set(key, true)
      board.hero.way = getWay()
      return
    }
    if (key === CONTROLS.Pause) {
      board.isPaused = !board.isPaused
      return
    }
    if (board.isPaused) {
      if (key === CONTROLS.Restart) {
        console.log("not implemented yet")
        return
      }
    }
  })

  window.addEventListener("keyup", (event: KeyboardEvent) => {
    const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key

    if (MoveInputState.has(key)) {
      MoveInputState.set(key, false)
      board.hero.way = getWay()
      return
    }
  })
}

export default takeControl
