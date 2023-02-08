import { mainHero } from "./game.js"

const KeyState = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
  s: false, // second right key
  q: false, // second left key
  w: false, // second up key
  a: false, // second down key
  f: false, // fungus mount key
  t: false // fungus terminate key
}
export default KeyState

// TODO restyle moves to WASD keys. And F and T keys for fungus.

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
