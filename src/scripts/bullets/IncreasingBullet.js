import Circle from "../actors/Circle"
import {Vector} from "../helpers"

export default class extends Circle {
    constructor(params) {
        super(params);
        this.savedSpeed = params.speed;
        this.speed = new Vector(0, 0);
        this.timer = 50;
        this.damage = 1;
    }

    act (level) {
        if (this.timer > 0) {
            this.timer -= 1;
            this.size = new Vector(this.size.x + 0.01, this.size.y + 0.01)
        } else {
            super.act(level);
            this.speed = this.savedSpeed;
        }
    }
}
