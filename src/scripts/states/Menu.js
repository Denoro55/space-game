export default class Menu {
    update() {
        console.log('update menu')
    }

    render(game) {
        const ctx = game.ctx;
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Нажмите \"S\", чтобы начать игру.", game.canvas.width / 2, game.canvas.height / 2);
    }
}
