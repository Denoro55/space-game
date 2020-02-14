import {Vector, Colors} from "../helpers"

export default class {
    constructor({pos, speed, size, color, strokeWidth}) {
        this.pos = pos;
        this.speed = speed || new Vector(0, 0);
        this.size = size || new Vector(1, 1);
        this.color = color || Colors.blue;
        this.options = {
            strokeWidth: strokeWidth || 2
        }
    }

    act(level) {
        this.pos = this.pos.add(this.speed);

        const posX = this.pos.x * level.cellSize;
        const posY = this.pos.y * level.cellSize;

        if (posY > (level.height + 3) * level.cellSize || posY < -100 || posX < -100 || posX > (level.width + 3) * level.cellSize) {
            level.actors = level.actors.filter(actor => actor !== this);
        }
    }
}
