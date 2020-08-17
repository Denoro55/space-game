import {Colors, Shapes, Vector} from "../helpers"
import Actor from "./Actor"

export default class extends Actor {
    constructor(params, level) {
        super(params);
        this.size = new Vector(2, 2);
        this.name = 'boss';
        this.damage = 1;
        this.angle = 0;
        this.shape = Shapes.circle;
        this.color = level.params.boss.color;
        this.maxHp = params.maxHp || 250;
        this.hp = this.maxHp;
        this.difficult = 0;
        this.difficultRanges = [60, 30, 0]
    }

    updateDifficult() {
        for (let i = 0; i < this.difficultRanges.length; i++) {
            if (this.hp > this.difficultRanges[i]) {
                this.difficult = i;
            }
        }
    }

    act(level) {
        // player bullets
        const other = level.actorAt(this, {name: 'playerBullet'});

        if (other) {
            level.actors = level.actors.filter(actor => actor !== other);
            this.hp -= other.damage;
            this.updateDifficult();
            level.createSparkles({count: 7, spread: 11, pos: other.pos, color: Colors.white});
            if (this.hp <= 0) {
                this.destroy(level);
            }
        }

        super.act(level)
    }
}
