import {Circle, Player, Polygon, Square, Sparkle, Star} from "../actors"
import {Boss1, Boss2} from "../bosses"
import {Colors, Shapes, Vector} from "../helpers"
import trackKeys from "../components/keys"
import {getRandomPoint} from "../helpers"
import {intersectCircleLine, intersectLines} from '../helpers';

const mapsObjects = {
    'x': 'wall',
    'o': 'coin'
};

const bosses = {
    0: Boss1,
    1: Boss2
};

const mapsActors = {
    '@': (w, h, level) => new Player({pos: new Vector(w, h)}, level),
    's': (w, h, level) => new Square({pos: new Vector(w, h)}, level),
    'c': (w, h, level)=> new Circle({pos: new Vector(w, h)}, level),
    'p': (w, h, level) => new Polygon({pos: new Vector(w, h)}, level),
    'B': (w, h, level) => new bosses[level.levelIndex]({pos: new Vector(w, h)}, level)
};

// клавиши
const keys = trackKeys();

// function rotate(rect, deg) {
//     const alpha = deg * Math.PI / 180; // radians
//     const width = rect[2]
//     const height = rect[3]
//     const centerX = rect[0] + width / 2;
//     const centerY = rect[1] + height / 2;
//     const newCoords = [[rect[0], rect[1]], [rect[0] + width, rect[1]], [rect[0] + width, rect[1] + height], [rect[0], rect[1] + height]].map(point => {
//         const x = point[0]
//         const y = point[1];
//         const x2 = centerX + (x - centerX) * Math.cos(alpha) - (y - centerY) * Math.sin(alpha)
//         const y2 = centerY + (x - centerX) * Math.sin(alpha) + (y - centerY) * Math.cos(alpha)
//         return [x2, y2];
//     })
//     return newCoords;
// }

// circle
function clamp (x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

function Level(game, currentMap, levelIndex, config, params) {
    this.game = game;
    this.cellSize = 40;
    this.width = currentMap[0].length;
    this.height = currentMap.length;
    this.screenWidth = 1000 / this.cellSize;
    this.screenHeight = 600 / this.cellSize;
    this.grid = [];
    this.actors = [];
    this.effects = [];
    this.levelIndex = levelIndex;
    this.config = config;
    this.player = {};
    this.boss = {};
    this.params = params;

    for (let h = 0; h < this.height; h++ ) {
        let gridLine = [];
        for (let w = 0; w < this.width; w++ ) {
            const object = currentMap[h][w];
            const actor = mapsActors[object];
            if (actor) this.actors.push(mapsActors[object](w, h, this));
            gridLine[w] = mapsObjects[object] || null;
        }
        this.grid.push(gridLine);
    }

    // stars
    for (let i = 0; i < 20; i++) {
        this.effects.push(new Star({
            pos: getRandomPoint(this.screenWidth, this.screenHeight),
            size: new Vector(0, 0),
            color: Colors.white,
            strokeWidth: 1,
            rotation: 0,
            delay: Math.random() * 60,
            style: 'fill'
        }))
    }
}

Level.prototype.animate = function() {
    if (this.config.debug) {
        console.log('Actors count: ', this.actors.length, '| Effects count: ', this.effects.length);
    }
    this.updateActors();
};

Level.prototype.fail = function() {
    this.game.changeState('fail', {
        color: this.boss.color
    });
};

Level.prototype.win = function(params) {
    const newParams = {
        ...params,
        color: this.params.boss.color
    };
    this.game.changeState('win', newParams);
};

Level.prototype.updateActors = function() {
    this.actors.forEach(actor => {
        actor.act(this, keys);
    });

    this.effects.forEach(effect => {
        effect.act(this);
        effect.update(this);
    })
};

Level.prototype.actorAt = function(actor, filter) {
    for (let i = 0; i < this.actors.length; i++) {
        const other = this.actors[i];
        if (filter && filter.name !== other.name) {
            continue;
        }
        if (other !== actor) {
            switch (other.shape) {
                case 'square':
                    if (actor.pos.x + actor.size.x > other.pos.x &&
                        actor.pos.x < other.size.x + other.pos.x &&
                        actor.pos.y + actor.size.y > other.pos.y &&
                        actor.pos.y < other.size.y + other.pos.y) {
                        return other;
                    }
                    break;
                case 'circle':
                    const distance = (actor.pos.x - other.pos.x)**2 + (actor.pos.y - other.pos.y)**2;
                    const sumRadius = (actor.size.x / 2 + other.size.x / 2)**2;
                    if (distance < sumRadius) return other;

                    // квадрат и круг
                    // var centerX = (other.pos.x + 0.5) * this.cellSize;
                    // var centerY = (other.pos.y + 0.5) * this.cellSize;

                    // var clampedX = clamp(centerX, actor.pos.x * this.cellSize, actor.pos.x * this.cellSize + actor.size.x * this.cellSize);
                    // var clampedY = clamp(centerY, actor.pos.y * this.cellSize, actor.pos.y * this.cellSize + actor.size.y * this.cellSize);

                    // if ((clampedX - centerX)**2 + (clampedY - centerY)**2 <= (other.size.x * 0.5 * this.cellSize)**2 ){
                    //     return other;
                    // }
                    break;
                case 'polygon':
                    // square collision
                    // const point = other.shapeOptions.points;
                    // let collision = false;
                    // for (let i = 0; i < other.shapeOptions.points.length - 1; i++) {
                    //     var ax = other.pos.x * this.cellSize + point[i][0];
                    //     var ay = other.pos.y * this.cellSize + point[i][1];
                    //     var bx = other.pos.x * this.cellSize + point[i + 1][0];
                    //     var by = other.pos.y * this.cellSize + point[i + 1][1];
                    //
                    //     const actorX = actor.pos.x * this.cellSize;
                    //     const actorY = actor.pos.y * this.cellSize;
                    //
                    //     const actorLines = [[actorX, actorY, actorX + actor.size.x * this.cellSize, actorY],
                    //         [actorX + actor.size.x * this.cellSize, actorY, actorX + actor.size.x * this.cellSize, actorY + actor.size.y * this.cellSize],
                    //         [actorX + actor.size.x * this.cellSize, actorY + actor.size.y * this.cellSize, actorX, actorY + actor.size.y * this.cellSize],
                    //         [actorX, actorY, actorX, actorY + actor.size.y * this.cellSize]];
                    //
                    //     actorLines.forEach(line => {
                    //         var cx = line[0];
                    //         var cy = line[1];
                    //         var dx = line[2];
                    //         var dy = line[3];
                    //
                    //         if (intersectLines(ax, ay, bx, by, cx, cy, dx, dy, actor, other)){
                    //             collision = true;
                    //         }
                    //     })
                    // }
                    // if (collision) return other;

                    // circle collision
                    const points = other.shapeOptions.points;
                    let collision = false;
                    const center = {
                        x: actor.pos.x + .5,
                        y: actor.pos.y + .5
                    };
                    for (let i = 1; i < points.length - 1; i++) {
                        if (intersectCircleLine(
                            center,
                            actor.size.x * .5,
                            {x: other.pos.x + points[i - 1][0], y: other.pos.y + points[i - 1][1]},
                            {x: other.pos.x + points[i][0], y: other.pos.y + points[i][1]}
                            )) {
                            collision = true;
                            break;
                        }
                    }
                    if (collision) return other;
                    break;
            }
        }
    }
};

Level.prototype.createSparkles = function(params) {
    const count = params.count + Math.floor(Math.random() * (params.spread + 1));
    for (let i = 0; i < count; i++) {
        this.effects.push(new Sparkle({
            pos: new Vector(params.pos.x, params.pos.y),
            size: new Vector(.07 + Math.random() * .07, .07 + Math.random() * .07),
            speed: new Vector(-.1 + Math.random() * .2, -.1 + Math.random() * .2),
            color: params.color,
            strokeWidth: 1,
            shape: Shapes.circle
        }))
    }
};

Level.prototype.createActor = function(actor) {
    this.actors.push(actor)
};

Level.prototype.destroyActor = function(actor) {
    this.actors = this.actors.filter(a => a !== actor);
};

export default Level;
