import {Colors, Vector} from "../helpers"
import {Boss} from "../actors"
import {Player} from "../actors";
import {IncreasingBullet} from "../bullets"
import {getAngleBetween} from "../helpers/functions"

export default class extends Boss {
    constructor(params) {
        super(params);
        this.size = new Vector(2, 2);
        this.reloadTime = 50;
        this.shootTime = this.reloadTime;
        this.behaviourType = 0;
    }

    act(level) {
        if (this.shootTime > 0) {
            this.shootTime -= 1;
        } else {
            this.shootTime = this.reloadTime;

            const player = level.actors.filter(actor => actor instanceof Player)[0];
            const angle = getAngleBetween(player.pos, this.pos);

            level.actors.push(new IncreasingBullet({
                pos: new Vector(this.pos.x + (1.9 * Math.cos(angle)), this.pos.y + (1.9 * Math.sin(angle))),
                speed: new Vector(0.05 * Math.cos(angle), 0.05 * Math.sin(angle)),
                color: Colors.aqua,
                size: new Vector(.15, .15),
                name: 'enemyBullet'
            }))
        }

        // player bullets
        const other = level.actorAt(this);
        if (other) {
            if (other.name === 'playerBullet') {
                level.actors = level.actors.filter(actor => actor !== other);
                this.hp -= other.damage;
                level.createSparkles({count: 7, spread: 11, pos: other.pos, color: Colors.white});
            }
        }

        level.boss = {
            hp: this.hp,
            maxHp: this.maxHp
        }
    }
}
