export default class Game {
    constructor(canvas, maps, config) {
        this.states = {}
        this.activeState = null
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.gameWidth = this.canvas.width
        this.gameHeight = this.canvas.height
        this.maps = maps
        this.currentLevel = 0
        this.config = config

        addEventListener('keyup', (e) => {
            if (e.keyCode === 83) {
                this.changeState('preview')
            }
        });
    }

    addState(name, handler) {
        this.states[name] = new handler;
    }

    runState(name) {
        this.activeState = name;
        this.run();
    }

    changeState(name) {
        this.activeState = name;
        this.states[this.activeState].create(this);
    }

    run() {
        const frame = () => {
            this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
            this.states[this.activeState].update(this);
            this.states[this.activeState].render(this);
            window.requestAnimationFrame(frame);
        }
        frame();
    }
}
