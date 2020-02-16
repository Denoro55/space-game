import Actor from "../Actor"
import {Shapes} from "../../helpers"

export default class extends Actor {
    constructor(params) {
        super(params);
        this.shape = params.shape || Shapes.circle
        this.updateFunc = params.updateFunc || null
    }

    update() {
        if (this.updateFunc) {
            this.updateFunc();
        }
    }
}
