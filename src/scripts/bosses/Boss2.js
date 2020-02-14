import {Colors, Shapes, Vector} from "../helpers"
import {Boss} from "../actors"

export default class extends Boss {
    constructor(params) {
        super(params);
        this.size = new Vector(2, 2);
        this.color =Colors.red
    }

    act() {

    }
}
