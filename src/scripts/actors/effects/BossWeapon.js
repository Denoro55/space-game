import Actor from "../Actor"
import {Colors, Shapes, Vector} from "../../helpers"
import Bullet from "../../bullets/Bullet"

export default class extends Actor {
    constructor(params) {
        super(params);
        this.shape = params.shape || Shapes.circle;
        this.updateFunc = params.updateFunc || null;
        this.alphaTransitionSpeed = 0.007
        this.alive = true;
        this.reloadTime = 30;
        this.time = this.reloadTime;
        this.activeWeapon = params.type || 0;
        this.currentWeapon = null;
        this.appearedTimer = 100;
    }

    update(level) {
        if (this.updateFunc) {
            this.updateFunc()
        }

        if (this.activeWeapon !== this.currentWeapon) {
            this.activateWeapon(this.activeWeapon)
        }

        if (!this.alive) {
            this.alpha = Math.max(this.alpha - this.alphaTransitionSpeed, 0);
            if (this.alpha <= 0) {
                level.effects = level.effects.filter(effect => effect !== this)
            }
        } else if (this.appearedTimer > 0) {
            this.appearedTimer -= 1;
        } else {
            if (this.time > 0) {
                this.time -= 1;
            } else {
                switch (this.activeWeapon) {
                    case 0:
                        level.createActor(new Bullet({
                            pos: new Vector(this.pos.x, this.pos.y),
                            color: this.color,
                            size: new Vector(.4, .4),
                            name: 'enemyBullet',
                            damage: 30,
                            alpha: .1,
                            states: [
                                {
                                    type: 'changeDir'
                                },
                                {
                                    type: 'changeSpeed',
                                    speed: .15
                                },
                                {
                                    type: 'waiting',
                                    timer: 30 + Math.random() * 35,
                                    options: {
                                        size: {
                                            value: 0.01,
                                            maxSize: 1
                                        },
                                        alpha: {
                                            value: 0.02,
                                            target: 1
                                        }
                                    }
                                },
                                {
                                    type: 'stop',
                                    timer: 25
                                },
                                {
                                    type: 'explode'
                                }
                            ]
                        }));
                        break;
                    case 1:
                        level.createActor(new Bullet({
                            pos: new Vector(this.pos.x, this.pos.y),
                            color: this.color,
                            size: new Vector(.3, .3),
                            name: 'enemyBullet',
                            damage: 10,
                            alpha: .1,
                            states: [
                            {
                                type: 'changeDir',
                                spreadAngle: 38
                            },
                            {
                                type: 'changeSpeed',
                                speed: 0.2,
                            },
                            {
                                type: 'waiting',
                                timer: 50,
                                options: {
                                    alpha: {
                                        value: 0.02,
                                        target: 1
                                    }
                                }
                            }]
                        }));
                        break
                }
                this.time = this.reloadTime;
            }
        }
    }

    activateWeapon(index) {
        this.currentWeapon = index;
        switch (index) {
            case 0:
                this.reloadTime = 30;
                this.time = this.reloadTime;
                break;
            case 1:
                this.reloadTime = 10;
                this.time = this.reloadTime;
                break;
        }
    }

    updateAlpha(alpha) {
        if (this.alpha < alpha) {
            this.alpha += 0.004;
        }
        if (this.alpha > alpha) {
            this.alpha = alpha;
        }
    }

    destroy() {
        this.alive = false
    }
}
