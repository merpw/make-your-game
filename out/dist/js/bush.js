const BUSH_SIZE = 8;
export default class Bush {
    // check the each sheep's position to the Bush, and if distance from the bush to not demonized sheep is less than BUSH_SIZE, remove the bush
    render(sheeps) {
        console.log("bush render");
        this.element.x.baseVal.value = this.x;
        this.element.y.baseVal.value = this.y;
        sheeps.forEach((sheep) => {
            const dx = Math.abs(this.element.x.baseVal.value - sheep.element.x.baseVal.value);
            const dy = Math.abs(this.element.y.baseVal.value - sheep.element.y.baseVal.value);
            if (!sheep.demonized) {
                if ((dx < BUSH_SIZE && dy < BUSH_SIZE / 4) ||
                    (dy < BUSH_SIZE && dx < BUSH_SIZE / 4)) {
                    this.element.remove();
                    this.eaten = true;
                }
            }
        });
    }
    constructor(x, y) {
        this.width = BUSH_SIZE;
        this.height = BUSH_SIZE;
        this.eaten = false; // if the bush is eaten by the sheep
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.element.height.baseVal.value = BUSH_SIZE;
        this.element.width.baseVal.value = BUSH_SIZE;
        this.element.style.fill = "green";
        this.element.id = "bush";
        this.element.x.baseVal.value = x;
        this.element.y.baseVal.value = y;
        this.x = x;
        this.y = y;
    }
}
