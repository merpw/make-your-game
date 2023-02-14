import { mainHero } from "./game.js"

const KeyState = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
  d: false, // second right key
  a: false, // second left key
  w: false, // second up key
  s: false, // second down key
  ö: false, // fung mount key
  ä: false, // fung terminate key
}
export default KeyState

// TODO restyle moves to WASD keys. And F and T keys for fung.

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
