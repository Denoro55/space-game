import {Colors, Vector, Shapes} from "../helpers"
import Actor from "./Actor"

export default class extends Actor {
    constructor(params) {
        super(params);
        this.size = new Vector(0.8, 0.8)
        this.speed = new Vector(0.1, 0.1);
        this.shape = Shapes.square;
        this.color = Colors.yellow;
        this.colors = {
            initial: Colors.yellow,
            touched: Colors.blue
        }
        this.hp = 100;
    }

    act(level, keys) {
        const other = level.actorAt(this);
        if (other) {
            if (other.name === 'enemyBullet') {
                level.actors = level.actors.filter(actor => actor !== other);
                this.hp -= other.damage;
                level.createSparkles({count: 7, spread: 11, pos: other.pos, color: Colors.aqua});
            } else {
                this.color = this.colors.touched
            }
        } else {
            this.color = this.colors.initial
        }
        if (keys.right) {
            this.pos.x += this.speed.x;
        }
        if (keys.left) {
            this.pos.x -= this.speed.x;
        }
        if (keys.up) {
            this.pos.y -= this.speed.y;
        }
        if (keys.down) {
            this.pos.y += this.speed.y;
        }
    }
}
