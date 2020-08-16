import Colors from "./types/Colors"
import Shapes from "./types/Shapes"
import Vector from "./Vector"

export function getRandomPoint (width, height) {
    return new Vector(Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1)))
}

export function getSpeedByAngle (speed, angle) {
    return new Vector(speed * Math.cos(angle), speed * Math.sin(angle));
}

export function getRandom (number, value) {
    return number + Math.random() * value
}

export function getDistanceBetweenPoints (p1, p2) {
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}

export function createOffsetByAngle (pos, angle, offset) {
    return new Vector(pos.x + (offset * Math.cos(angle)), pos.y + (offset * Math.sin(angle)))
}

export {Colors, Shapes, Vector}

export * from './angle';
export * from './polygon';
export * from './collision';
export * from './shapes';
