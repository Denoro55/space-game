import {Colors, Shapes} from "../helpers"
import Actor from "./Actor"

export default class extends Actor {
    constructor(params) {
        super(params);
        this.damage = 1;
        this.shape = Shapes.circle;
        this.color = Colors.aqua;
        this.maxHp = params.maxHp || 250;
        this.hp = this.maxHp;
    }

    act(level) {
        // player bullets
        const other = level.actorAt(this, {name: 'playerBullet'});

        if (other) {
            level.actors = level.actors.filter(actor => actor !== other);
            this.hp -= other.damage;
            level.createSparkles({count: 7, spread: 11, pos: other.pos, color: Colors.white});
            if (this.hp <= 0) {
                this.destroy(level);
            }
        }

        super.act(level)
    }
}
