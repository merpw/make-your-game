import { Way } from "./hero"
import { currentBoard, restartLevel } from "./game.js"
import { pauseUIManager } from "./uiManager.js"

/** Configuration of the control keys. */
const CONTROLS = {
  move: {
    Up: ["w", "ArrowUp", "touchUp"],
    Down: ["s", "ArrowDown", "touchDown"],
    Left: ["a", "ArrowLeft", "touchLeft"],
    Right: ["d", "ArrowRight", "touchRight"],
  },
  PlaceFungi: "f",
  TerminateFungi: "t",

  Restart: "r",
  Pause: "p",
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

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.repeat || !currentBoard) return
  const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key

  if (currentBoard.isPaused) {
    if (key === CONTROLS.Restart) {
      restartLevel()
      return
    }
    if (key === CONTROLS.Pause) {
      currentBoard.isPaused = false
    }
    return
  }

  if (key === CONTROLS.Pause) {
    currentBoard.isPaused = true
    return
  }

  if (MoveInputState.has(key)) {
    MoveInputState.set(key, true)
    currentBoard.hero.way = getWay()
    return
  }
  if (key === CONTROLS.PlaceFungi) {
    currentBoard.hero.placeFungi()
    return
  }
  if (key === CONTROLS.TerminateFungi) {
    currentBoard.hero.terminateFungi()
    return
  }
})

window.addEventListener("keyup", (event: KeyboardEvent) => {
  if (!currentBoard) return
  const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key

  if (!currentBoard.isPaused) {
    if (MoveInputState.has(key)) {
      MoveInputState.set(key, false)
      currentBoard.hero.way = getWay()
      return
    }
  } else {
    switch (key) {
      case "ArrowUp":
      case "ArrowLeft":
      case "w":
      case "a":
        pauseUIManager.selectPreviousButton()
        break
      case "ArrowDown":
      case "ArrowRight":
      case "s":
      case "d":
        pauseUIManager.selectNextButton()
        break
      case "Enter":
        pauseUIManager.clickActiveButton()
        break

      default:
        break
    }
  }
})
window.addEventListener("blur", () => {
  if (!currentBoard) return
  currentBoard.isPaused = true
})

const touchControls = document.getElementById("touch-controls")
const buttons = document.querySelectorAll(
  "#touch-controls button"
) as NodeListOf<HTMLButtonElement>

if (touchControls && touchControls.style.display !== "none") {
  touchControls.addEventListener("selectstart", (e) => e.preventDefault())
  buttons.forEach((button) => {
    if (MoveInputState.has(button.id)) {
      button.addEventListener(
        "pointerdown",
        (e) => button.releasePointerCapture(e.pointerId)
        // workaround for https://github.com/w3c/pointerevents/issues/178#issuecomment-1029108322
      )
      button.addEventListener("pointerenter", () => {
        if (!currentBoard || currentBoard.isPaused) return
        MoveInputState.set(button.id, true)
        currentBoard.hero.way = getWay()
      })
      button.addEventListener("pointerleave", () => {
        if (!currentBoard || currentBoard.isPaused) return
        MoveInputState.set(button.id, false)
        currentBoard.hero.way = getWay()
      })
      return
    }
    if (button.id === "touchPlaceFungi") {
      button.addEventListener("pointerdown", () => {
        if (!currentBoard || currentBoard.isPaused) return
        currentBoard.hero.placeFungi()
      })
      return
    }
    if (button.id === "touchTerminateFungi") {
      button.addEventListener("pointerdown", () => {
        if (!currentBoard || currentBoard.isPaused) return
        currentBoard?.hero.terminateFungi()
      })
    }
  })
}
