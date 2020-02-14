import {Colors, Vector} from "../helpers"
import {Boss} from "../actors"
import {Circle, Player} from "../actors";
import {IncreasingBullet} from "../bullets"

export default class extends Boss {
    constructor(params) {
        super(params);
        this.size = new Vector(2, 2);
        this.hp = 100;
        this.reloadTime = 15;
        this.shootTime = this.reloadTime;
        this.behaviourType = 0;
    }

    act(level) {
        if (this.shootTime > 0) {
            this.shootTime -= 1;
        } else {
            this.shootTime = this.reloadTime;

            const player = level.actors.filter(actor => actor instanceof Player)[0];

            const xDiff = player.pos.x * level.cellSize - (this.pos.x * level.cellSize);
            const yDiff = player.pos.y * level.cellSize - (this.pos.y * level.cellSize);
            const angle = Math.atan2(yDiff, xDiff);

            level.actors.push(new IncreasingBullet({
                pos: new Vector(this.pos.x + (1.9 * Math.cos(angle)), this.pos.y + (1.9 * Math.sin(angle))),
                speed: new Vector(0.05 * Math.cos(angle), 0.05 * Math.sin(angle)),
                color: Colors.aqua,
                size: new Vector(.15, .15),
                level: level}))
        }
    }
}
