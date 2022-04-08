import Phaser from "../lib/phaser.js";

export default class GameEnd extends Phaser.Scene{
    constructor(){
        super('game-end');
    }

    preload(){
        this.load.image('ribbon-window', 'assets/ribbon-window.png');
        this.load.image('reload-button', 'assets/reload-button.png');
    }
    
    create(){
        this.gameScene = this.scene.get('game');
        this.gameConfig = this.game.config;
        this.add.rectangle(0, 0, this.gameConfig.width, this.gameConfig.height, 0x2153a3).setOrigin(0);

        const dialog = this.add.image(this.gameConfig.width / 2, this.gameConfig.height / 2, 'ribbon-window').setOrigin(0.5);
        dialog.displayWidth = Math.max(this.gameConfig.width / 1.1, this.gameConfig.width/2);
        dialog.scaleY = dialog.scaleX;

        const resultTxt = `Correct: ${ this.gameScene.correctMouses } \nWrong: ${ this.gameScene.wrongMouses } \nMiss: ${ this.gameScene.missedMouses } \n`;

        this.add.text(
            this.gameConfig.width / 2, 
            this.gameConfig.height / 2, 
            resultTxt, 
            {fontSize: 20, color: 'black ', fontFamily: 'JosefinSans'}
        ).setOrigin(0.5);

        this.add.image(this.gameConfig.width / 2, 
        this.gameConfig.height / 2 + 70, 
        'reload-button').setOrigin(0.5).setScale(0.4).setInteractive().on('pointerdown', () => {
            this.scene.start('game');
        });
    }
}