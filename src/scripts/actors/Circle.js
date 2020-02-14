import {Shapes} from "../helpers"
import Actor from "./Actor"

class Circle extends Actor {
    constructor(params) {
        super(params);
        this.shape = Shapes.circle;
    }
}

export default Circle;
