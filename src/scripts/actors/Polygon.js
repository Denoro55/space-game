import {Shapes} from "../helpers"
import Actor from "./Actor"

class Polygon extends Actor {
    constructor(params) {
        super(params);
        this.points = params.points || [[0, 0], [40, 40], [0, 40], [0, 0]];
        this.shape = Shapes.polygon;
    }
}

export default Polygon;
