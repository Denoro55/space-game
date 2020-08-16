export function getAngleBetween (obj1, obj2) {
    const xDiff = obj1.x - obj2.x;
    const yDiff = obj1.y - obj2.y;
    return Math.atan2(yDiff, xDiff);
}

export function angleToDegrees (angle) {
    return angle / Math.PI * 180;
}

export function angleToRadians (angle) {
    return angle * Math.PI / 180;
}

export function spreadAngle (angle, deg) {
    const spreadAngle = -deg + (Math.random() * (deg * 2));
    return angle + angleToRadians(spreadAngle);
}

export function getRotationDirection(currentAngle, targetAngle, speed) {
    if (currentAngle - targetAngle === 0) return currentAngle % 360;

    if (Math.abs(currentAngle - targetAngle) < 180) {
        if (currentAngle < targetAngle) {
            currentAngle+=speed;
        }
        else {
            currentAngle-=speed;
        }
    } else {
        if (currentAngle < targetAngle) {
            currentAngle-=speed;
        }
        else {
            currentAngle+=speed;
        }
    }

    return currentAngle % 360;
    // return ((currentAngle % 360) + 360) % 360;
}
