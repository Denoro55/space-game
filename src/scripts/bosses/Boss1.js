import {Colors, Shapes, Vector} from "../helpers"
import {Boss, Player} from "../actors"
import {angleToDegrees, angleToRadians, getAngleBetween, getRandomPoint} from "../helpers/functions"
import Bullet from "../bullets/Bullet"
import BossWeapon from "../actors/effects/BossWeapon"

export default class extends Boss {
    constructor(params) {
        super(params);
        this.name = 'boss';
        this.size = new Vector(2, 2);
        this.damage = 1;
        this.reloadTime = 35;
        this.shootTime = this.reloadTime;
        this.states = [
            {
                bullets: 0,
                nextState: [0, 1, 2, 4]
            },
            {
                bullets: 0,
                bulletPositions: [],
                nextState: [0, 1, 2, 4]
            },
            {
                stopTime: 200,
                nextState: [3, 3, 3, 4]
            },
            {
                pointPosition: new Vector(0, 0),
                nextState: [0, 1]
            },
            {
                pointPosition: new Vector(0, 0),
                timer: -1,
                startTimer: 15,
                waves: 15,
                nextState: [0, 1, 2]
            }
        ];
        this.activeStateIndex = 0;
        this.currentStateIndex = null;
        this.weapons = {
            left: {
                active: false,
                type: 0,
                weapon: null
            },
            right: {
                active: false,
                type: 0,
                weapon: null
            },
        };
        this.bulletOptions = {
            offset: 1.9,
            speed: 0.12,
            damage: 10
        };
        this.delay = 0;
        this.alpha = 1;
        this.alphaTransitionSpeed = 0.004;
        this.maxSpeed = 0.06;
        this.visibility = true;
    }

    act(level) {
        if (this.activeStateIndex !== this.currentStateIndex) {
            this.activateState(this.activeStateIndex, level);
        }
        const state = this.states[this.activeStateIndex];
        this.changeAlpha(this.visibility);
        if (this.delay > 0) {
            this.delay -= 1;
        } else {
            if (this.shootTime > 0) {
                this.shootTime -= 1;
            }
            switch (this.activeStateIndex) {
                case 0:
                    if (this.shootTime <= 0) {
                        this.shootTime = this.reloadTime;

                        const player = level.actors.filter(actor => actor instanceof Player)[0];
                        const angle = getAngleBetween(player.pos, this.pos);

                        level.actors.push(new Bullet({
                            pos: new Vector(this.pos.x + (this.bulletOptions.offset * Math.cos(angle)), this.pos.y + (this.bulletOptions.offset * Math.sin(angle))),
                            color: Colors.aqua,
                            size: new Vector(.15, .15),
                            name: 'enemyBullet',
                            alpha: .1,
                            damage: this.bulletOptions.damage,
                            angle,
                            states: [{
                                type: 'stop',
                                timer: 45,
                                options: {
                                    size: {
                                        value: 0.01,
                                        maxSize: 0.7
                                    },
                                    alpha: {
                                        value: 0.03,
                                        target: 1
                                    }
                                },
                            },
                            {
                                type: 'changeDir',
                                target: 'player'
                            },
                            {
                                type: 'changeSpeed',
                                speed: this.bulletOptions.speed
                            }]
                        }));

                        state.bullets -=1;
                    }
                    if (state.bullets <= 0) {
                        this.nextState(level);
                    }
                    break;
                case 1:
                    if (this.shootTime <= 0 && state.bulletPositions.length > 0) {
                        const angle = state.bulletPositions.shift() * 45 * Math.PI / 180;

                        level.actors.push(new Bullet({
                            pos: new Vector(this.pos.x + (this.bulletOptions.offset * Math.cos(angle)), this.pos.y + (this.bulletOptions.offset * Math.sin(angle))),
                            color: Colors.aqua,
                            size: new Vector(.15, .15),
                            name: 'enemyBullet',
                            damage: this.bulletOptions.damage,
                            states: [{
                                type: 'stopped',
                                timer: 50,
                                options: {
                                    size: {
                                        value: 0.01,
                                        maxSize: 0.7
                                    }
                                },
                            },
                                {
                                    type: 'changeDir',
                                    target: 'player',
                                    spreadAngle: 50
                                },
                                {
                                    type: 'changeSpeed',
                                    speed: this.bulletOptions.speed
                                }]
                        }));

                        this.shootTime = this.reloadTime;
                    }
                    if (state.bulletPositions.length <= 0) {
                        this.nextState(level);
                    }
                    break;
                case 2:
                    super.act(level);

                    const player = level.actors.filter(actor => actor instanceof Player)[0];
                    this.moveToPoint(player.pos);

                    if (this.shootTime <= 0) {
                        this.makeFloatingBullet(level);
                        this.shootTime = this.reloadTime;
                    }

                    if (state.stopTime > 0) {
                        state.stopTime -= 1;
                    } else {
                        this.nextState(level);
                    }

                    break;
                case 3:
                    super.act(level);
                    this.moveToPoint(state.pointPosition);
                    if (this.shootTime <= 0) {
                        this.makeFloatingBullet(level);
                        this.shootTime = this.reloadTime;
                    }
                    const distance = Math.sqrt((this.pos.x - state.pointPosition.x)**2 + (this.pos.y - state.pointPosition.y)**2);
                    if (distance < this.maxSpeed * 35) {
                        this.nextState(level);
                    }
                    break;
                case 4:
                    super.act(level);
                    this.moveToPoint(state.pointPosition);
                    const distance2 = Math.sqrt((this.pos.x - state.pointPosition.x)**2 + (this.pos.y - state.pointPosition.y)**2);
                    if (distance2 < this.maxSpeed * 35) {
                        this.speed = new Vector(0, 0);
                        if (state.timer < 0) {
                            state.timer = state.startTimer;
                            const percentHealth = this.getPercentHealth();
                            const count = percentHealth < 50 ? 12 : 8
                            state.bulletPositions = this.fillBullets(count);
                            this.makeWave(state, level);
                            state.waves -= 1;
                        } else {
                            state.timer -= 1;
                        }
                    }
                    if (state.waves <= 0) {
                        this.nextState(level);
                    }
                    break;
            }
        }

        // player bullets
        const other = level.actorAt(this, {name: 'playerBullet'});

        if (other) {
            level.actors = level.actors.filter(actor => actor !== other);
            this.hp -= other.damage;
            level.createSparkles({count: 7, spread: 11, pos: other.pos, color: Colors.white});
            if (this.hp <= 0) {
                level.win({text: 'Вы победили призрака!'});
            }
        }

        level.boss = {
            hp: this.hp,
            maxHp: this.maxHp
        }
    }

    makeWave(state, level) {
        const offset = Math.random() * 30;
        const percentHealth = this.getPercentHealth();
        let count, plusAngle;
        if (percentHealth < 50) {
            count = 12;
            plusAngle = 30;
        } else {
            count = 8;
            plusAngle = 45;
        }
        for (let i = 0; i < count; i++) {
            const angle = (offset + state.bulletPositions.shift() * plusAngle) * Math.PI / 180;
            level.actors.push(new Bullet({
                pos: new Vector(this.pos.x + (this.bulletOptions.offset * Math.cos(angle)), this.pos.y + (this.bulletOptions.offset * Math.sin(angle))),
                color: Colors.aqua,
                size: new Vector(.2, .2),
                name: 'enemyBullet',
                alpha: .1,
                damage: this.bulletOptions.damage,
                states: [
                    {
                        type: 'stopped',
                        timer: 25,
                        options: {
                            size: {
                                value: 0.01,
                                maxSize: 0.7
                            },
                            alpha: {
                                value: 0.04,
                                target: 1
                            }
                        },
                    },
                    {
                        type: 'changeDir',
                        dir: angle
                    },
                    {
                        type: 'changeSpeed',
                        speed: this.bulletOptions.speed
                    }
                ]
            }))
        }
    }

    makeFloatingBullet(level) {
        level.actors.push(new Bullet({
            pos: new Vector(this.pos.x, this.pos.y),
            color: Colors.aqua,
            size: new Vector(.15, .15),
            name: 'enemyBullet',
            damage: this.bulletOptions.damage,
            states: [{
                type: 'stopped',
                timer: 150 + (Math.random() * 500),
                options: {
                    size: {
                        value: 0.01,
                        maxSize: 0.7
                    }
                },
            },
                {
                    type: 'changeDir',
                    target: 'player',
                    spreadAngle: 25
                },
                {
                    type: 'changeSpeed',
                    speed: this.bulletOptions.speed
                }]
        }))
    }

    moveToPoint(point) {
        const rotSpeed = .002;

        if (this.pos.x < point.x) {
            this.speed = new Vector(Math.min(this.speed.x + rotSpeed, this.maxSpeed), this.speed.y);
        } else if (this.pos.x > point.x) {
            this.speed = new Vector(Math.max(this.speed.x - rotSpeed, -this.maxSpeed), this.speed.y);
        }

        if (this.pos.y < point.y) {
            this.speed = new Vector(this.speed.x, Math.min(this.speed.y + rotSpeed, this.maxSpeed));
        } else if (this.pos.y > point.y) {
            this.speed = new Vector(this.speed.x, Math.max(this.speed.y - rotSpeed, -this.maxSpeed));
        }
    }

    fillBullets(n = 8) {
        const arr = [];
        for (let i = 0; i < n; i++) {
            arr.push(i);
        }
        return arr.sort(function() {
            return Math.random() - 0.5;
        });
    }

    nextState(level) {
        const state = this.states[this.activeStateIndex];
        const num = Math.floor(Math.random() * state.nextState.length);
        this.activateState(state.nextState[num], level);
    }

    getCoordsWeapon (name, level) {
        const offset = name === 'left' ? -90 : 90;
        const player = level.actors.filter(actor => actor instanceof Player)[0];
        const angle = angleToRadians(angleToDegrees(getAngleBetween(player.pos, this.pos)) + offset);
        return new Vector(this.pos.x + (this.bulletOptions.offset * Math.cos(angle)), this.pos.y + (this.bulletOptions.offset * Math.sin(angle)));
    }

    getAlpha () {
        return this.alpha;
    }

    activateWeapon(name, level) {
        if (!this.weapons[name].active) {
            const that = this;
            const weapon = new BossWeapon({
                pos: new Vector(this.pos.x, this.pos.y),
                color: Colors.aqua,
                size: new Vector(.7, .7),
                alpha: 0,
                shape: Shapes.circle,
                type: Math.floor(Math.random() * 2),
                updateFunc: function() {
                    this.pos = that.getCoordsWeapon(name, level);
                    this.updateAlpha(that.getAlpha())
                }
            })
            this.weapons[name].active = true;
            this.weapons[name].weapon = weapon;
            level.effects.push(weapon);
        }
    }

    disableWeapon(name) {
        if (this.weapons[name].active) {
            this.weapons[name].active = false;
            this.weapons[name].weapon.destroy();
        }
    }

    changeAlpha(sign) {
        if (!sign) {
            this.alpha = Math.max(this.alpha - this.alphaTransitionSpeed, 0);
        } else {
            this.alpha = Math.min(this.alpha + this.alphaTransitionSpeed, 1);
        }
    }

    randomizeVisibility() {
        this.visibility = Math.random() < .5
    }

    getPercentHealth() {
        return this.hp * 100 / this.maxHp;
    }

    activateState(index, level) {
        this.activeStateIndex = index;
        this.currentStateIndex = index;
        const state = this.states[index];
        const percentHealth = this.getPercentHealth();

        this.disableWeapon('left', level);
        this.disableWeapon('right', level);
        this.randomizeVisibility();

        if (percentHealth < 50) {
            this.maxSpeed = 0.09;
        }

        switch (index) {
            case 0:
                if (percentHealth < 50) {
                    state.bullets = 8 + Math.random() * 6;
                } else {
                    state.bullets = 4 + Math.random() * 6;
                }
                this.delay = 50;
                this.reloadTime = 35;
                if (Math.random() < .4 + (1 - percentHealth / 100)) {
                    this.activateWeapon('left', level);
                }
                if (Math.random() < .4 + (1 - percentHealth / 100)) {
                    this.activateWeapon('right', level);
                }
                break;
            case 1:
                state.bulletPositions = this.fillBullets();
                this.reloadTime = 10;
                this.delay = 50;
                this.shootTime = this.reloadTime;
                break;
            case 2:
                const player = level.actors.filter(actor => actor instanceof Player)[0];
                const angle = getAngleBetween(player.pos, this.pos);
                this.speed = new Vector(.03 * Math.cos(angle), .03 * Math.sin(angle));
                this.shootTime = this.reloadTime;
                state.stopTime = 400;
                this.visibility = false;
                if (percentHealth > 50) {
                    this.reloadTime = 40
                } else if (percentHealth <= 50 && percentHealth > 25) {
                    this.reloadTime = 25;
                    if (Math.random() < .5) {
                        this.activateWeapon('right', level);
                    }
                } else {
                    this.reloadTime = 25;
                    if (Math.random() < .5) {
                        this.activateWeapon('right', level);
                    }
                    if (Math.random() < .5) {
                        this.activateWeapon('left', level);
                    }
                }
                break;
            case 3:
                const mapOffset = 6;
                const randomPosition = getRandomPoint(level.screenWidth - mapOffset, level.screenHeight - mapOffset);
                state.pointPosition = new Vector(3 + randomPosition.x, 3 + randomPosition.y)
                break;
            case 4:
                state.pointPosition = new Vector(level.screenWidth / 2, level.screenHeight / 2);
                state.waves = Math.floor(15 + Math.random() * 10);
                break;
        }
    }
}
