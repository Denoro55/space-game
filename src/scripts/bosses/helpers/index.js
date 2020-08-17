import {Bullet} from '../../bullets';
import {createOffsetByAngle, getSpeedByAngle, Vector} from '../../helpers';

export function makeWave(pos, count = 8, options) {
    const bullets = [];
    const offset = Math.random() * 30;
    const plusAngle = 360 / count;

    for (let i = 0; i < count; i++) {
        const angle = (offset + i * plusAngle) * Math.PI / 180;
        bullets.push(new Bullet({
            pos: createOffsetByAngle(new Vector(pos.x, pos.y), angle, options.offset),
            color: options.color,
            size: new Vector(.35, .35),
            name: 'enemyBullet',
            angle,
            alpha: 1,
            speed: getSpeedByAngle(options.speed, angle),
            damage: options.damage,
            states: []
        }))
    }

    return bullets;
}
