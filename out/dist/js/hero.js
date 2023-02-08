import KeyState from "./keys.js";
const HERO_SPEED = 0.4;
const HERO_SIZE = 8;
const DIAGONAL_SPEED = HERO_SPEED * (Math.sqrt(2) / 2);
export default class Hero {
    checkKeys() {
        // TODO add an automatic correction of the player's position directed to the center axis of the row/column, to force the player to move close to the center of cells
        this.speedX = 0;
        this.speedY = 0;
        KeyState.ArrowRight && (this.speedX += HERO_SPEED);
        KeyState.ArrowLeft && (this.speedX += -HERO_SPEED);
        KeyState.ArrowUp && (this.speedY += -HERO_SPEED);
        KeyState.ArrowDown && (this.speedY += HERO_SPEED);
        if (this.speedX !== 0 && this.speedY !== 0) {
            this.speedX *= DIAGONAL_SPEED / HERO_SPEED;
            this.speedY *= DIAGONAL_SPEED / HERO_SPEED;
        }
    }
    constructor(x, y) {
        this.width = HERO_SIZE;
        this.height = HERO_SIZE;
        this.speedX = 0;
        this.speedY = 0;
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.element.height.baseVal.value = HERO_SIZE;
        this.element.width.baseVal.value = HERO_SIZE;
        this.element.style.fill = "rebeccapurple";
        this.element.id = "mainHero";
        this.element.x.baseVal.value = x;
        this.element.y.baseVal.value = y;
        this.x = x;
        this.y = y;
    }
}
