/**
 * @return {boolean}
 */
export function intersectCircleLine(center, radius, p1, p2) {
    const x01 = p1.x - center.x;
    const y01 = p1.y - center.y;
    const x02 = p2.x - center.x;
    const y02 = p2.y - center.y;

    const dx = x02 - x01;
    const dy = y02 - y01;

    const a = dx * dx + dy * dy;
    const b = 2.0 * (x01 * dx + y01 * dy);
    const c = x01 * x01 + y01 * y01 - radius * radius;

    if (-b < 0) return c < 0;
    if (-b < (2.0 * a)) return (4.0 * a * c - b * b < 0);
    return a + b + c < 0;
}

export function intersectLines(ax, ay, bx, by, cx, cy, dx, dy, obj, otherObj) {
    var v1x = bx - ax; // вектор AB
    var v1y = by - ay;
    var v2x = cx - ax; // вектор AC
    var v2y = cy - ay;
    var v3x = dx - ax; // вектор AD
    var v3y = dy - ay;
    var v4x = dx - cx; // вектор CD
    var v4y = dy - cy;
    var v5x = bx - cx; // вектор CB
    var v5y = by - cy;
    var v6x = ax - cx; // вектор CA
    var v6y = ay - cy;
    var coord1 = v1x * v2y - v1y * v2x; // [AB, AC]
    var coord2 = v1x * v3y - v1y * v3x; // [AB, AD]
    var coord3 = v4x * v5y - v4y * v5x; // [CD, CB]
    var coord4 = v4x * v6y - v4y * v6x; // [CD, CA]
    const result = coord1 * coord2 <= 0 && coord3 * coord4 <= 0;
    if (coord1 * coord2  + coord3 * coord4 === 0) {
        if (obj.pos.x * this.cellSize + obj.size.x * this.cellSize < otherObj.pos.x * this.cellSize
            || obj.pos.x * this.cellSize > otherObj.pos.x * this.cellSize + otherObj.size.x * this.cellSize) {
            return false;
        }
    }
    return result;
};
