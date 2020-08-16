import {angleToRadians, Colors, getRandomPoint, Shapes, Vector} from "../helpers"
import {Boss, Player} from "../actors"
import {getAngleBetween} from '../helpers';
import {Bullet} from '../bullets';
import {
    rotatePolygon,
    createPolygon,
    createOffsetByAngle,
    getPolygonPos,
    spreadAngle,
    getSpeedByAngle,
    getRandom,
    getDistanceBetweenPoints,
    getRotationDirection,
    angleToDegrees
} from '../helpers';
import {makeWave} from './helpers';

const options = {
    color: '#e91e63',
    bullet: {
        offset: 2.2,
        speed: 0.12,
        damage: 10,
        double: {
            speed: 0.15
        }
    },
    states: {
        'multipleShooting': 'stateMultipleShooting',
        'moving': 'stateMoving',
        'simpleShooting': 'stateSimpleShooting',
        'doubleShooting': 'stateDoubleShooting',
        'splashShooting': 'stateSplashShooting',
        'clone': 'stateClone'
    }
};

export default class Illusionist extends Boss {
    constructor(params, level) {
        super(params, level);
        this.size = new Vector(2, 2);
        this.color = options.color;
        this.angle = 0;
        this.clone = params.clone || false;
        this.clones = [];
        this.setNewMovingPoint = this.setNewMovingPoint.bind(this, level);
        this.states = {
            [options.states.multipleShooting]: {
                time: 200,
                reloadTime: {
                    bullet: 8,
                    full: 100
                },
                timer: {
                    bullet: 35,
                    full: 0
                },
                bulletsLimit: 18,
                bullets: 18,
                additionalStates: [],
                options: {
                    times: 1
                }
            },
            [options.states.simpleShooting]: {
                time: 200,
                reloadTime: {
                    bullet: 20
                },
                timer: {
                    bullet: 35
                },
                additionalStates: [],
                options: {
                    times: 1
                }
            },
            [options.states.moving]: {
                time: 200,
                active: false,
                limit: 300,
                point: new Vector(0, 0),
                angle: 0,
                rot: null,
                additionalStates: [options.states.simpleShooting],
                options: {
                    times: 1
                }
            },
            [options.states.clone]: {
                time: 0,
                onlyRoot: true,
                active: false,
                additionalStates: [],
                nextStateName: options.states.moving,
                options: {
                    times: 4,
                    condition: () => {
                        return this.clones.length < 2
                    }
                }
            },
            [options.states.doubleShooting]: {
                time: 200,
                reloadTime: {
                    bullet: 11
                },
                timer: {
                    bullet: 35
                },
                additionalStates: [],
                options: {
                    times: 1
                }
            },
            [options.states.splashShooting]: {
                time: 100,
                reloadTime: {
                    bullet: 25
                },
                timer: {
                    bullet: 35
                },
                bullets: 8,
                bulletRange: 12,
                bulletTimeout: 50,
                additionalStates: [],
                options: {
                    times: 1
                }
            },
        };
        this.stateKeys = this.getStatesKeys();
        this.currentStates = this.clone ? [options.states.moving] : [options.states.multipleShooting];
        this.currentMainState = this.currentStates[0];
        this.timeToNextState = 100;
        if (!this.clone) {
            level.boss = this;
        }
    }

    act(level) {
        // console.log(this.currentStates);
        this.currentStates.forEach(state => {
            const currentState = this.states[state];
            this[state](level, currentState);
        });

        if (this.timeToNextState > 0) {
            this.timeToNextState -= 1;
        } else {
            this.nextState();
        }

        super.act(level);

        this.clones.forEach(clone => {
            if (clone.hp <= 0) {
                this.makeWave(clone, level);
                this.clones = this.clones.filter(c => c !== clone);
            }
        });
    }

    // states
    [options.states.multipleShooting](level, state) {
        if (state.timer.full > 0) {
            state.timer.full -= 1;
        } else {
            if (state.bullets > 0) {
                if (state.timer.bullet <= 0) {
                    const angle = getAngleBetween(level.player.pos, this.pos);
                    level.actors.push(this.createPolygonBullet(angle, 40));
                    state.timer.bullet = state.reloadTime.bullet;
                    state.bullets -= 1;
                } else {
                    state.timer.bullet -= 1;
                }
            } else {
                state.timer.full = state.reloadTime.full;
                state.bullets = state.bulletsLimit;
            }
        }
    }

    [options.states.simpleShooting](level, state) {
        if (state.timer.bullet <= 0) {
            const angle = getAngleBetween(level.player.pos, this.pos);
            level.actors.push(this.createPolygonBullet(angle, 15));
            state.timer.bullet = state.reloadTime.bullet;
        } else {
            state.timer.bullet -= 1;
        }
    }

    [options.states.moving](level, state) {
        if (!state.active) {
            state.active = true;
            this.setNewMovingPoint(state);
        } else {
            this.checkDistanceToPoint(state);
            this.updateAngleToPoint(state);
        }
    }

    [options.states.clone](level, state) {
        if (!state.active) {
            state.active = true;
            const clone = new Illusionist({
                pos: new Vector(this.pos.x, this.pos.y),
                clone: true,
                maxHp: 10
            }, level);
            this.clones.push(clone);
            level.createActor(clone);
        }
    }

    [options.states.doubleShooting](level, state) {
        if (state.timer.bullet <= 0) {
            let angle = getAngleBetween(level.player.pos, this.pos);
            [90, -90].forEach(deg => {
                const positionAngle = angleToRadians(angleToDegrees(getAngleBetween(level.player.pos, this.pos)) + deg);
                level.actors.push(this.createBullet({angle, positionAngle, offset: 2}));
            });
            state.timer.bullet = state.reloadTime.bullet;
        } else {
            state.timer.bullet -= 1;
        }
    }

    [options.states.splashShooting](level, state) {
        if (state.timer.bullet <= 0) {
            let angle = Math.random() * 360;
            for (let i = 0; i < state.bullets; i++) {
                angle += state.bulletRange;
                const radianAngle = angleToRadians(angle);
                setTimeout(() => {
                    level.actors.push(this.createBullet({angle: radianAngle, positionAngle: radianAngle, offset: 1.7}));
                }, i * state.bulletTimeout);
            }
            state.timer.bullet = state.reloadTime.bullet;
        } else {
            state.timer.bullet -= 1;
        }
    }

    getStatesKeys() {
        const keys = [];

        Object.entries(this.states).forEach(([key, values]) => {
            let add = true;
            if (values.options.condition) {
                if (!values.options.condition()) {
                    add = false;
                }
            }
            if (this.clone && values.onlyRoot) {
                add = false;
            }
            if (add) {
                for (let i = 0; i < values.options.times; i++) {
                    keys.push(key);
                }
            }
        });

        // console.log(keys);

        return keys;
    }

    nextState() {
        let nextStateKey;
        // if current state has fixed next state
        if (this.currentMainState.nextStateName) {
            nextStateKey = this.currentMainState.nextStateName;
        } else {
            const randomIndex = Math.floor(Math.random() * this.stateKeys.length);
            nextStateKey = this.stateKeys[randomIndex];
        }
        const nextState = this.states[nextStateKey];
        this.clearStates(nextStateKey);
        this.prepareState(nextStateKey, nextState);
        // add main state
        this.currentMainState = nextState;
        this.currentStates.push(nextStateKey);
        // add additional states
        nextState.additionalStates.forEach(additionalState => {
            this.currentStates.push(additionalState);
        });
        this.timeToNextState = nextState.time;
        this.stateKeys = this.getStatesKeys();
    }

    clearStates(nextStateName) {
        this.currentStates.forEach(stateName => {
            if (stateName !== nextStateName) {
                this.deactivateState(stateName);
            }
        });
        this.currentStates = [];
    }

    deactivateState(stateName) {
        switch (stateName) {
            case options.states.moving: {
                this.speed = new Vector(0, 0);
                break;
            }
            default: {
                break;
            }
        }
    }

    prepareState(stateName, state) {
        switch (stateName) {
            case options.states.clone: {
                state.active = false;
                break;
            }
            default: {
                break;
            }
        }
    }

    setNewMovingPoint(level, state) {
        state.point = getRandomPoint(level.screenWidth - 6, level.screenHeight - 6);
        state.angle = getAngleBetween(state.point, this.pos);
    }

    checkDistanceToPoint(state) {
        const distance = getDistanceBetweenPoints(this.pos, state.point);
        if (distance < 2) {
            this.setNewMovingPoint(state);
        }
    }

    updateAngleToPoint(state) {
        const currentRadianAngle = angleToRadians(this.angle);
        const targetDegrees = angleToDegrees(state.angle);

        this.speed = getSpeedByAngle(.06, currentRadianAngle);
        this.angle = getRotationDirection(this.angle, targetDegrees, 3);
        state.angle = getAngleBetween(state.point, this.pos);
    }

    makeWave(actor, level) {
        const bullets = makeWave(actor.pos, 14, {
            damage: options.bullet.damage,
            offset: .5,
            color: options.color,
            speed: options.bullet.speed
        });
        bullets.forEach(bullet => {
            level.actors.push(bullet);
        })
    }

    createPolygonBullet(angle, spread) {
        const coords = createPolygon([[0, 0], [1, .5], [0, 1], [.25, .5], [0, 0]], .5);
        const newAngle = spreadAngle(angle, spread);

        return new Bullet({
            pos: createOffsetByAngle(getPolygonPos(coords, this.pos), newAngle, 1.8),
            color: this.color,
            size: new Vector(.15, .15),
            name: 'enemyBullet',
            alpha: 1,
            damage: options.bullet.damage,
            angle: newAngle,
            speed: getSpeedByAngle(getRandom(options.bullet.speed, 0.06), newAngle),
            shape: Shapes.polygon,
            shapeOptions: {
                points: rotatePolygon(coords, newAngle)
            },
            states: []
        })
    }

    createBullet(params) {
        return new Bullet({
            pos: createOffsetByAngle(this.pos, params.positionAngle, params.offset),
            color: this.color,
            size: new Vector(.3, .3),
            name: 'enemyBullet',
            alpha: 1,
            damage: options.bullet.damage,
            angle: params.angle,
            speed: getSpeedByAngle(options.bullet.double.speed, params.angle),
            states: []
        })
    }

    destroy(level) {
        if (!this.clone) {
            level.win({text: 'Вы победили Иллюзиониста!'});
        }
        level.destroyActor(this);
    }
}
