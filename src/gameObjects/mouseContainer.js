import Phaser from '../lib/phaser.js';

export class MouseContainer extends Phaser.GameObjects.Container {

    constructor(scene, x, y, size) {
        super(scene, x, y);

        this.width = size;
        this.height = size;

        this.sprite = this.scene.add
            .sprite(0, 0, 'mouse-sprites', 0)
            .setOrigin(0, 0)
            .setInteractive();
        this.sprite.displayWidth = size;
        this.sprite.displayHeight = size;

        const cloud = this.scene.add.image(
                0,
                0,
                'cloud'
            )
            .setOrigin(0, 0);
        cloud.displayWidth = size;
        cloud.scaleY = cloud.scaleX;

        const text = this.scene.add.text(size / 2, cloud.displayHeight / 2,
            '', {
                color: 'black',
                fontFamily: 'JosefinSans',
                fontSize: 15,
                align: 'center',
                wordWrap: {
                    width: size
                }
            }).setOrigin(0.5);

        this.textBox = this.scene.add.container(0, size - 20, [cloud, text]).setAlpha(0);

        this.textBoxTween = this.scene.tweens.create({
            targets: this.textBox,
            props: {
                alpha: 1
            },
            duration: 100,
            ease: 'Linear'
        });
        this.textBoxHideTween = this.scene.tweens.create({
            targets: this.textBox,
            props: {
                alpha: 0
            },
            duration: 500,
            ease: 'Power2'
        });

        this.add(this.sprite);
        this.add(this.textBox);

        this.sprite.on('pointerdown', (event) => {
            this.clickSprite();
        });

        this.sprite.on('animationcomplete', (event) => {
            if (event.key === 'mouse-up') {
                this.scene.time.addEvent({
                    callback: () => {
                        this.sprite.anims.play('mouse-down');
                    },
                    loop: false,
                    callbackScope: this,
                    delay: Phaser.Utils.Array.GetRandom([5, 10]) * 1000
                });
            } else if (event.key === 'mouse-down') {
                this.textBoxHideTween.startDelay = 0;
                this.textBoxHideTween.play();
                this.scene.sound.play('down');

                if (this.isCorrect) {
                    this.scene.missedMouses++;
                }
                this.mouseUp();
            }
        });
    }

    clickSprite() {
        const {
            currentAnim
        } = this.sprite.anims;
        if (currentAnim && ['mouse-up'].indexOf(currentAnim.key) !== -1) {

            if (this.isCorrect) {
                this.sprite.anims.play('mouse-dizzy');
                this.scene.sound.play('dizzy');
                this.scene.correctMouses++;
            } else {
                this.scene.sound.play('angry', {
                    rate: 1.2
                });
                this.sprite.anims.play('mouse-angry');
                this.scene.wrongMouses++;
            }
            this.textBoxHideTween.play();
            this.mouseUp();
        }
    }

    mouseUp() {
        this.isCorrect = Phaser.Math.Between(0, 1);

        const options = this.scene.randomQuestion[this.isCorrect ? 1 : 2];

        this.textBox.getAt(1).text = Phaser.Utils.Array.GetRandom(options);

        if (this.scene.timeRemain === 0) return;

        this.scene.time.addEvent({
            callback: () => {
                this.textBoxTween.play();
                this.scene.sound.play('up');
                this.sprite.anims.play('mouse-up');
            },
            loop: false,
            delay: Phaser.Utils.Array.GetRandom([2, 5, 10, 15]) * 1000,
            callbackScope: this
        });
    }
}