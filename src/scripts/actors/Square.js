import {Shapes} from "../helpers"
import Actor from "./Actor"

class Square extends Actor {
    constructor(params) {
        super(params);
        this.shape = Shapes.square;
    }
}

export default Square;
