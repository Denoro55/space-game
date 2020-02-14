import '../styles/styles.css'
// components
import Level from "./components/Level"
import Display from "./components/Display"

const maps = [
    [
        "                      ",
        "                      ",
        "  x          B     x  ",
        "  x   o     o o    x  ",
        "  x   c  @ xxxxx   x  ",
        "  xxxxx    p       x  ",
        "      x     s      x  ",
        "      x  x    c    x  ",
        "            p      x  ",
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
        "  x   c  @ xxxxx   x  ",
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

function runLevel(level) {
    const display = new Display(level);
    const frame = () => {
        var time = performance.now();

        level.animate();
        display.draw();

        time = performance.now() - time;
        // console.log('Время выполнения = ', time);

        window.requestAnimationFrame(frame);
    }
    frame();
}

function runGame(maps, levelIndex) {
    const currentMap = maps[levelIndex];
    runLevel(new Level(currentMap, levelIndex));
}

runGame(maps, 0);
