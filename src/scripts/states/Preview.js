export default class Preview {
    constructor(params) {
        this.params = params;
    }

    create(game, params) {
        this.time = this.params.time || 100;
        this.text = params.text || this.params.text || "Призрак";
        this.color = params.color || this.params.color;
        this.pause = 50;
        this.state = 'fadeIn'
    }

    update(game) {
        switch (this.state) {
            case 'fadeIn':
                if (this.time > 0) {
                    this.time -= 1;
                } else {
                    this.state = 'pause';
                }
                break;
            case 'pause':
                if (this.pause > 0) {
                    this.pause -= 1;
                } else {
                    this.state = 'fadeOut';
                }
                break;
            case 'fadeOut':
                if (this.time < 100) {
                    this.time += 1;
                } else {
                    game.changeState('game');
                    game.ctx.globalAlpha = 1
                }
                break;
        }
    }

    render(game) {
        const ctx = game.ctx;
        ctx.globalAlpha = (100 - this.time) / 100;
        ctx.font = "18px Arial";
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        ctx.fillText(this.text, game.canvas.width / 2, game.canvas.height / 2);
    }
}
