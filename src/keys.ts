import { mainHero } from "./game.js"

const KeyState = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
}
export default KeyState

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key in KeyState) {
    // TODO add a check for if no another keys are already pressed, to prevent diagonal movement
    KeyState[event.key as keyof typeof KeyState] = true
    mainHero.checkKeys()
  }
})

window.addEventListener("keyup", (event: KeyboardEvent) => {
  if (event.key in KeyState) {
    KeyState[event.key as keyof typeof KeyState] = false
    mainHero.checkKeys()
  }
})
