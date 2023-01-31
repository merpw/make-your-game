import KeyState from "./keys.js"
const HERO_SPEED = 1
const DIAGONAL_SPEED = HERO_SPEED * (Math.sqrt(2) / 2)
export default class Hero {
  checkKeys() {
    this.speedX = 0
    this.speedY = 0
    KeyState.ArrowRight && (this.speedX += HERO_SPEED)
    KeyState.ArrowLeft && (this.speedX += -HERO_SPEED)
    KeyState.ArrowUp && (this.speedY += -HERO_SPEED)
    KeyState.ArrowDown && (this.speedY += HERO_SPEED)
    if (this.speedX !== 0 && this.speedY !== 0) {
      this.speedX *= DIAGONAL_SPEED / HERO_SPEED
      this.speedY *= DIAGONAL_SPEED / HERO_SPEED
    }
  }
  render(frameTimeDiff) {
    this.x += this.speedX * frameTimeDiff
    this.y += this.speedY * frameTimeDiff
    // TODO: maybe change this (transform?)
    this.element.cx.baseVal.value = this.x
    this.element.cy.baseVal.value = this.y
  }
  constructor(element) {
    this.speedX = 0
    this.speedY = 0
    this.element = element
    this.x = element.cx.baseVal.value
    this.y = element.cy.baseVal.value
  }
}
