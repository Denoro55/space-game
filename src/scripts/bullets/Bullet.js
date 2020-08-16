import {Colors, Shapes, Vector} from "../helpers"
import {Player} from "../actors"
import {angleToRadians, getAngleBetween} from "../helpers"
import {Bullet} from "./index"
import Actor from "../actors/Actor"

export default class extends Actor {
    constructor(params) {
        super(params);
        this.damage = params.damage || 1;
        this.states = params.states || [];
        this.angle = params.angle || 0;
        this.shape = params.shape || Shapes.circle;
        this.shapeOptions = params.shapeOptions || {};
        this.activeStateIndex = 0;
        this.currentStateIndex = null;
    }

    act (level) {
        const state = this.states[this.activeStateIndex];

        super.act(level);
        if (!state) {
            return;
        }

        if (this.currentStateIndex !== this.activeStateIndex) {
            this.activateState(this.activeStateIndex, state, level)
        }

        // options
        if (state.options) {
            if (state.options.size) {
                if (this.size.x < state.options.size.maxSize) {
                    this.size = new Vector(this.size.x + state.options.size.value, this.size.y + state.options.size.value)
                }
            }
            if (state.options.alpha) {
                if (this.alpha < state.options.alpha.target) {
                    this.alpha = Math.min(this.alpha + state.options.alpha.value, 1);
                }
            }
        }

        // timer
        if (state.timer !== undefined) {
            if (state.timer > 0) {
                state.timer -= 1;
            } else {
                this.activeStateIndex += 1;
            }
        } else {
            this.activeStateIndex += 1;
        }
    }

    activateState(index, state, level) {
        this.currentStateIndex = index;
        switch (state.type) {
            case 'changeDir':
                // направление уже определено
                if (state.dir) {
                    this.angle = state.dir;
                } else {
                    const player = level.actors.filter(actor => actor instanceof Player)[0];
                    let angle;
                    if (state.spreadAngle) {
                        const spreadAngle = -state.spreadAngle + (Math.random() * (state.spreadAngle * 2));
                        angle = getAngleBetween(player.pos, this.pos) + angleToRadians(spreadAngle);
                    } else {
                        angle = getAngleBetween(player.pos, this.pos);
                    }
                    this.angle = angle;
                }
                break;
            case 'changeSpeed':
                this.speed = new Vector(state.speed * Math.cos(this.angle), state.speed * Math.sin(this.angle));
                break;
            case 'stop':
                this.speed = new Vector(0, 0);
                break;
            case 'explode':
                level.destroyActor(this);
                level.createSparkles({count: 7, spread: 11, pos: this.pos, color: Colors.white});
                const offset = Math.random() * 60;
                for (let i = 0; i < 6; i++) {
                    const angle = angleToRadians(i * 60 + offset);
                    level.actors.push(new Bullet({
                        pos: new Vector(this.pos.x, this.pos.y),
                        speed: new Vector(.17 * Math.cos(angle), .17* Math.sin(angle)),
                        color: Colors.aqua,
                        size: new Vector(.2, .2),
                        name: 'enemyBullet',
                        damage: 5
                    }))
                }
                break;
        }
    }
}

