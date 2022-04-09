import {
    MouseContainer
} from "../gameObjects/MouseContainer.js";
import Phaser from "../lib/phaser.js";

export default class Game extends Phaser.Scene {

    constructor() {
        super('game');
        this.mouseCount = 9;
    }

    init() {
        this.timeLimit = 60;
        this.timeRemain = this.timeLimit;

        this.missedMouses = 0;
        this.correctMouses = 0;
        this.wrongMouses = 0;

        this.randomQuestion = [...Phaser.Utils.Array.GetRandom(this.questions)];
        this.randomQuestion[1] = this.randomQuestion[1].split(';');
        this.randomQuestion[2] = this.randomQuestion[2].split(';');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('mouse-sprites', 'assets/sprites.png', {
            frameWidth: 190,
            frameHeight: 144
        });
        this.load.image('hammer', 'assets/hammer.png');
        this.load.image('cloud', 'assets/cloud.png');
        this.load.image('window', 'assets/window.png');

        this.load.audio('punch', 'assets/punch.wav');
        this.load.audio('up', 'assets/highUp.ogg');
        this.load.audio('down', 'assets/highDown.ogg');
        this.load.audio('dizzy', 'assets/dizzy.mp3');
        this.load.audio('angry', 'assets/angry.mp3');
        this.load.audio('whistle', 'assets/whistle.mp3');
        this.load.audio('bg-music', 'assets/bg-music.mp3');
    }

    create() {
        this.gameConfig = this.game.config;
        this.scale.scaleMode = Phaser.Scale.ScaleModes.FIT;

        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.gameConfig.width, this.gameConfig.height);

        this.anims.create({
            key: 'mouse-up',
            frames: this.anims.generateFrameNumbers('mouse-sprites', {
                start: 0,
                end: 5
            }),
            frameRate: 5,
        });
        this.anims.create({
            key: 'mouse-down',
            frames: this.anims.generateFrameNumbers('mouse-sprites', {
                start: 5,
                end: 0
            }),
            frameRate: 5
        });
        this.anims.create({
            key: 'mouse-angry',
            frames: this.anims.generateFrameNumbers('mouse-sprites', {
                frames: [11, 10, 9, 8, 7, 1, 0]
            }),
            frameRate: 5
        });
        this.anims.create({
            key: 'mouse-dizzy',
            frames: this.anims.generateFrameNumbers('mouse-sprites', {
                frames: [36, 37, 38, 1, 0]
            }),
            frameRate: 5,
        });

        const halfHeight = this.gameConfig.height / 2;
        const size = halfHeight / 3;
        const left = (this.gameConfig.width - size * 3) / 2;

        for (let i = 0; i < this.mouseCount; ++i) {
            const rIndex = parseInt(i / 3);
            const cIndex = i % 3;
            const mouse = new MouseContainer(
                this,
                cIndex * size + left,
                rIndex * (size + size / 3) + halfHeight - size,
                size);
            this.add.existing(mouse);
        }

        this.hammer = this.add.image(0, 0, 'hammer')
            .setOrigin(1)
            .setAngle(40)
            .setScale(0.5);

        this.hammerTween = this.tweens.create({
            targets: this.hammer,
            props: {
                angle: -10
            },
            duration: 100,
            ease: 'Power2',
            onComplete: () => {
                this.hammer.angle = 40;
            }
        });

        this.input.on('pointermove', (event) => {
            this.moveHammer(event);
        });

        this.input.on('pointerdown', (event) => {

            if(event.isDown){
                this.moveHammer(event);
            }

            this.hammerTween.play();
            this.sound.play('punch');
        });

        const board = this.add.image(0, 0, 'window')
            .setOrigin(0, 0);
        const boardWidth = Math.max(this.gameConfig.width / 2, 250);
        board.displayWidth = boardWidth;
        board.scaleY = board.scaleX;

        const boardLeft = (this.gameConfig.width - boardWidth) / 2;
        const text = this.add.text(20, 20,
                this.randomQuestion[0], {
                    color: 'black',
                    fontFamily: 'JosefinSans',
                    fontSize: 20,
                    wordWrap: {
                        width: boardWidth - 30
                    }
                })
            .setOrigin(0);
        this.add.container(boardLeft, 30, [board, text]);
        this.timeText = this.add.text(0, 0, 'Time: 60s', {
            fontFamily: 'JosefinSans',
            color: 'black',
            fontSize: 35
        });
        this.timeStart();
    }

    timeEnd = () => {
        if (this.timeRemain === 0) {
            this.timeEvent.destroy();
            this.scene.start('game-end');
            this.sound.stopAll();
            this.sound.play('whistle');
            return;
        }
        this.timeText.text = 'Time: ' + --this.timeRemain + 's';
    }

    moveHammer(event) {
        const {
            x, y
        } = event.position;
        this.hammer.x = x + 50;
        this.hammer.y = y + 80;
    }

    timeStart() {
        this.sound.play('bg-music', { volume: 0.3, loop: true });
        this.timeEvent = this.time.addEvent({
            callback: this.timeEnd,
            delay: 1000,
            loop: true
        });
    }

    setQuestions(data) {
        this.questions = data;
    }
}
