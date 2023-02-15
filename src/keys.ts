import { board } from "./game.js"

const KeyState = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
  d: false, // second right key
  a: false, // second left key
  w: false, // second up key
  s: false, // second down key
  o: false, // fung mount key
  p: false, // fung terminate key
}
export default KeyState

// TODO restyle moves to WASD keys. And F and T keys for fung.

window.addEventListener("keydown", (event: KeyboardEvent) => {
  const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key
  if (key in KeyState) {
    KeyState[key as keyof typeof KeyState] = true
    board.hero.checkKeys()
  }
})

window.addEventListener("keyup", (event: KeyboardEvent) => {
  const key = event.key.match(/^[A-Z]$/) ? event.key.toLowerCase() : event.key
  if (key in KeyState) {
    KeyState[key as keyof typeof KeyState] = false
    board.hero.checkKeys()
  }
})
