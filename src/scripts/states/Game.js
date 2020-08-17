import Level from "../engine/Level"
import Display from "../engine/Display"

export default class Game {
    create(game, params) {
        this.level = new Level(game, game.maps[game.currentLevel], game.currentLevel, game.config, params);
        this.display = new Display(this.level)
    }

    update(game) {
        this.level.animate(game);
    }

    render(game) {
        this.display.draw(game);
    }
}
