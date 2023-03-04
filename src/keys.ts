import { Way } from "./hero"
import { Board } from "./board"

/** Configuration of the control keys. */
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
  Resume: "Enter",
}

/**
 * The state of the keys that control the game.
 * @example
 * MoveInputState.get("w")
 * // false
 * */
export const MoveInputState = new Map<string, boolean>(
  Object.values(CONTROLS.move).flatMap((keys) =>
    keys.map((key) => [key, false])
  )
)

/** Get the current way of the Hero according to the {@link MoveInputState| state of the control keys} */
const getWay = (): Way => ({
  up: CONTROLS.move.Up.some((key) => MoveInputState.get(key)),
  down: CONTROLS.move.Down.some((key) => MoveInputState.get(key)),
  left: CONTROLS.move.Left.some((key) => MoveInputState.get(key)),
  right: CONTROLS.move.Right.some((key) => MoveInputState.get(key)),
})

/** Take control of the {@link Board} using the keyboard. */
const takeControl = (board: Board) => {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.repeat) return
    const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key

    if (board.isPaused) {
      if (key === CONTROLS.Restart) {
        console.log("not implemented yet")
        return
      }
      if (key === CONTROLS.Resume || key === CONTROLS.Pause) {
        board.isPaused = false
      }
      return
    }

    if (key === CONTROLS.Pause) {
      board.isPaused = true
      return
    }

    if (MoveInputState.has(key)) {
      MoveInputState.set(key, true)
      board.hero.way = getWay()
      return
    }
    if (key === CONTROLS.PlaceFungi) {
      board.hero.placeFungi()
      return
    }
    if (key === CONTROLS.TerminateFungi) {
      board.hero.terminateFungi()
      return
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
  window.addEventListener("blur", () => {
    board.isPaused = true
  })
}

export default takeControl
