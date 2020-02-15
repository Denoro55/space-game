export default class Preview {
    create() {
        this.time = 100
        this.pause = 50
        this.state = 'fadeIn'
    }

    update(game) {
        console.log('update preview')
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
                    game.changeState('game')
                }
                break;
        }
    }

    render(game) {
        const ctx = game.ctx;
        ctx.globalAlpha = (100 - this.time) / 100;
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Призрак", game.canvas.width / 2, game.canvas.height / 2);
    }
}
