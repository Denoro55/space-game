import {Vector, Colors} from "../helpers"

export default class {
    constructor({pos, speed, size, color, name, strokeWidth, style}) {
        this.pos = pos;
        this.speed = speed || new Vector(0, 0);
        this.size = size || new Vector(1, 1);
        this.color = color || Colors.blue;
        this.name = name || ''
        this.options = {
            strokeWidth: strokeWidth || 2,
            style: style || 'stroke'
        }
    }

    act(level) {
        this.pos = this.pos.add(this.speed);

        if (this.pos.x > (level.screenWidth + 3) || this.pos.x < -3 || this.pos.y < -3 || this.pos.y > (level.screenHeight + 3)) {
            level.actors = level.actors.filter(actor => actor !== this);
        }
    }
}
