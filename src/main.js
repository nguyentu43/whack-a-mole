import Phaser from './lib/phaser.js';
import Game from './scenes/Game.js';
import GameEnd from './scenes/GameEnd.js';
import GameLoading from './scenes/GameLoading.js';

const width = Math.min(window.innerWidth, 600);
const height = Math.max(600, window.innerHeight);

export default new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    scene: [GameLoading, Game, GameEnd],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    }
});