import {Colors, Vector, Shapes} from "../helpers"
import Actor from "./Actor"
import {PlayerBullet} from "../bullets"
import {getAngleBetween} from "../helpers"
import Boss from "./Boss"

export default class extends Actor {
    constructor(params, level) {
        super(params);
        this.size = new Vector(0.75, 0.75);
        this.speed = new Vector(0.12, 0.12);
        this.shape = Shapes.circle;
        this.color = Colors.green;
        this.maxHp = 100;
        this.hp = this.maxHp;
        this.reloadTime = 20;
        this.shootTime = 0;
        this.bulletSpeed = 0.18;
        level.player = this;
    }

    act(level, keys) {
        const other = level.actorAt(this);
        if (other) {
            if (other.name === 'enemyBullet') {
                level.actors = level.actors.filter(actor => actor !== other);
                this.hp -= other.damage;
                level.createSparkles({count: 7, spread: 11, pos: other.pos, color: Colors.white});
            } else if (other instanceof Boss) {
                this.hp -= other.damage;
            }
            if (this.hp <= 0) {
                level.fail();
            }
        } else {
            // this.color = this.colors.initial
        }

        let diagonalSpeed = 1;
        if (keys.right && keys.down || keys.right && keys.up || keys.left && keys.down || keys.left && keys.up) {
            diagonalSpeed = 0.80;
        }

        if (keys.right && this.pos.x < level.screenWidth - 1) {
            this.pos.x += this.speed.x * diagonalSpeed;
        }
        if (keys.left && this.pos.x > 0) {
            this.pos.x -= this.speed.x * diagonalSpeed;
        }
        if (keys.up && this.pos.y > 0) {
            this.pos.y -= this.speed.y * diagonalSpeed;
        }
        if (keys.down && this.pos.y < level.screenHeight - 1) {
            this.pos.y += this.speed.y * diagonalSpeed;
        }

        // shooting
        if (this.shootTime > 0) {
            this.shootTime -= 1;
        }

        if (keys.mouseDown && this.shootTime <= 0) {
            const mouse = new Vector(keys.mouse.x / level.cellSize, keys.mouse.y / level.cellSize);
            const angle = getAngleBetween(mouse, this.pos);
            level.createActor(new PlayerBullet({
                name: 'playerBullet',
                pos: new Vector(this.pos.x, this.pos.y),
                speed: new Vector(this.bulletSpeed * Math.cos(angle), this.bulletSpeed * Math.sin(angle)),
                color: Colors.player,
                size: new Vector(.15, .15),
                damage: 1
            }));
            this.shootTime = this.reloadTime;
        }
    }
}
