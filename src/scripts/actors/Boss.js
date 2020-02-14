import {Colors, Shapes} from "../helpers"
import Actor from "./Actor"

export default class extends Actor {
    constructor(params) {
        super(params);
        this.shape = Shapes.circle;
        this.color = Colors.aqua;
    }
}
