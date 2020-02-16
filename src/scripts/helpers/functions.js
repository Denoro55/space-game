import Vector from "./Vector"

function getAngleBetween (obj1, obj2) {
    const xDiff = obj1.x - obj2.x;
    const yDiff = obj1.y - obj2.y;
    return Math.atan2(yDiff, xDiff);
}

function getRandomPoint (width, height) {
    return new Vector(Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1)))
}

function angleToDegrees (angle) {
    return angle / Math.PI * 180;
}

function angleToRadians (angle) {
    return angle * Math.PI / 180;
}

export {getAngleBetween, getRandomPoint, angleToDegrees, angleToRadians};
