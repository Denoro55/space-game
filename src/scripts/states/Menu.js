const digitsToLevel = {
    'Digit1': {
        levelIndex: 0,
        params: {
            text: 'Призрак',
            color: 'aqua'
        }
    },
    'Digit2': {
        levelIndex: 1,
        params: {
            text: 'Иллюзионист',
            color: '#e91e63'
        }
    },
};

export default class Menu {
    create(game) {
        this.initListeners(game);
    }

    update() {

    }

    initListeners(game) {
        this.onKeyUp = this.onKeyUp.bind(this, game);
        addEventListener('keyup', this.onKeyUp);
    }

    onKeyUp(game, event) {
        if (digitsToLevel[event.code] !== undefined) {
            const levelOptions = digitsToLevel[event.code];
            game.setCurrentLevel(levelOptions.levelIndex);
            if (game.config.development) {
                game.changeState('game');
            } else {
                game.changeState('preview', levelOptions.params);
            }
            this.removeListeners();
        }
    }

    removeListeners() {
        removeEventListener('keyup', this.onKeyUp)
    }

    render(game) {
        const textDistance = 40;
        const ctx = game.ctx;
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Нажмите \"1\" чтобы сразиться с Призраком", game.canvas.width / 2, game.canvas.height / 2 - (textDistance / 2));
        ctx.fillText("Нажмите \"2\" чтобы сразиться с Иллюзионистом", game.canvas.width / 2, game.canvas.height / 2 + (textDistance / 2));
    }
}
