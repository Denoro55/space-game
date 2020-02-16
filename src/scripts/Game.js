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
            if (e.keyCode === 83 && this.activeState === 'menu') {
                if (this.config.development) {
                    this.changeState('game');
                } else {
                    this.changeState('preview');
                }
            }
        });
    }

    addState(name, handler, params = {}) {
        this.states[name] = new handler(params);
    }

    runState(name) {
        this.activeState = name;
        this.run();
    }

    changeState(name, params = {}) {
        this.activeState = name;
        this.states[this.activeState].create(this, params);
    }

    run() {
        const frame = () => {
            this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
            var time = performance.now();
            this.states[this.activeState].update(this);
            this.states[this.activeState].render(this);
            time = performance.now() - time;
            if (this.config.scriptTime) {
                console.log('Время выполнения = ', time);
            }
            window.requestAnimationFrame(frame);
        }
        frame();
    }
}
