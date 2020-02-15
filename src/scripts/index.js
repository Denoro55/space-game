import '../styles/styles.css'

import Game from "./Game"
import GameState from './states/Game'
import Menu from "./states/Menu"
import Preview from "./states/Preview"

const canvas = document.querySelector('canvas');

const config = {
    debug: false,
    scriptTime: true
}

const maps = [
    [
        "                      ",
        "                      ",
        "  x          B     x  ",
        "  x                x  ",
        "  x                x  ",
        "  xxxxx            x  ",
        "      x            x  ",
        "      x  x         x  ",
        "             @     x  ",
        "      xxxxxxxxxxxxxx  ",
        "                      ",
        "                      ",
        "                      "
    ],
    [
        "                      ",
        "                      ",
        "  x                x  ",
        "  x   o     o o    x  ",
        "  x   c    xxxxx   x  ",
        "  xxxxx    p       x  ",
        "      x     s   B  x  ",
        "      x  x    c    x  ",
        "            p      x  ",
        "      xxxxxxxxxxxxxx  ",
        "                      ",
        "                      ",
        "                      "
    ]
];

// function runLevel(level) {
//     const display = new Display(level);
//     const frame = () => {
//         var time = performance.now();
//         level.animate();
//         display.draw();
//         time = performance.now() - time;
//         if (config.scriptTime) {
//             console.log('Время выполнения = ', time);
//         }
//         window.requestAnimationFrame(frame);
//     }
//     frame();
// }
//
// function runGame(maps, levelIndex) {
//     const currentMap = maps[levelIndex];
//     runLevel(new Level(currentMap, levelIndex, config));
// }

// runGame(maps, 0);

const game = new Game(canvas, maps, config);
game.addState('menu', Menu);
game.addState('preview', Preview);
game.addState('game', GameState);
game.runState('menu');
