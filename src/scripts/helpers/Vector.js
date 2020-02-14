function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
}

Vector.prototype.down = function(value) {
    return new Vector(this.x - (Math.sign(this.x) * value), this.y - (Math.sign(this.y) * value));
}

export default Vector
