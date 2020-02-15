import Circle from "../actors/Circle"

export default class extends Circle {
    constructor(params) {
        super(params);
        this.damage = params.damage;
    }
}
