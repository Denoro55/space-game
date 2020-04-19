import '../styles/styles.css'
import Game from "./Game"
import GameState from './states/Game'
import Menu from "./states/Menu"
import Preview from "./states/Preview"
import maps from './maps';

const canvas = document.querySelector('canvas');

const config = {
    development: false,
    debug: false,
    scriptTime: false
};

const game = new Game(canvas, maps, config);
game.addState('menu', Menu);
game.addState('preview', Preview);
game.addState('fail', Preview, { text: 'Вы проиграли', color: 'white'});
game.addState('win', Preview, { color: 'white'});
game.addState('game', GameState);
game.runState('menu');
