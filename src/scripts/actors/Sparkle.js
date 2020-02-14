import Actor from "./Actor"

export default class extends Actor {
    constructor(params) {
        super(params);
        this.shape = params.shape;
        this.maxTime = 20;
        this.time = this.maxTime;
    }

    update(level) {
        if (this.time > 0) {
            this.time -= 1;
            this.speed = this.speed.down(.004);
        } else {
            level.effects = level.effects.filter(effect => effect !== this);
        }
    }
}
