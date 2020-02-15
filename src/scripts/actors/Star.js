import Actor from "./Actor"
import {Shapes, Vector} from "../helpers"
import {getRandomPoint} from "../helpers/functions"

export default class extends Actor {
    constructor(params) {
        super(params);
        this.shape = Shapes.square;
        this.alpha = 0;
        this.sign = 0;
        this.rotation = params.rotation || 0;
        this.startPos = this.pos
    }

    update(level) {
        this.rotation += 4;
        const sin = Math.sin(this.rotation / 100);
        this.alpha = Math.abs(sin);
        const newSign = Math.sign(sin);
        this.size = new Vector(this.alpha * .16, this.alpha * .16);
        this.pos = new Vector(this.startPos.x - this.alpha * .08, this.startPos.y - this.alpha * .08)
        if (Math.sign(sin) !== this.sign) {
            this.startPos = getRandomPoint(level.screenWidth, level.screenHeight);
        }
        this.sign = newSign;
    }
}
