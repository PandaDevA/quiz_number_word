/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class PassionScreen extends Phaser.Scene{
    constructor(){
        super({key: "PassionScreen"});
    } 

    preload() {
        this.load.image("Passion", "./images/passion_board.png");
        this.load.image("Turn", "./images/turn.png");
        this.load.image("Stop", "./images/stop.png");
        this.load.image("Indicator", "./images/passion_picker.png");
        this.load.image("Back", "./images/back.png");
        this.angle_speed = 0.05;
        this.angle = 0.0;
        this.bStop = false;
        this.bTurn = false;
    }

    create() {
        this.BackButton = this.add.image(50,50,'Back').setScale(0.2);
        this.BackButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('PassionScreen');
            game.scene.start('HomeScreen');
        });

        this.result = this.add.text(150,20,'');

        this.passion_flower = this.add.image(150,200,'Passion');
        let angle = Number.parseInt(Math.random()*360);
        this.angle = angle;
        this.passion_flower.setAngle(angle);
        this.indicator = this.add.image(150,300,'Indicator');

        this.turnButton = this.add.image(100,500,'Turn', 0).setScale(0.2);
        this.turnButton.setInteractive().on('pointerdown', () => {
            this.turn();
        });

        this.stopButton = this.add.image(200,500,'Stop', 0).setScale(0.2).setAlpha(0.5);
        this.stopButton.disableInteractive();        
    }
    update(){
    }

    turn(){
        this.turnButton.disableInteractive().setAlpha(0.5);
        this.bTurn = true;
        this.timer = this.time.addEvent({
            delay: 100,
            callback: this.updateTimer,
            args: [this],
            loop: true
        });
    }

    stop(){
        this.bStop = true;
    }
    updateTimer(scene){
        if(scene.bTurn)
        {
            scene.angle_speed *= 1.05;
        }
        if(scene.bStop)
            scene.angle_speed /= 1.05;

        if(scene.angle_speed >= 20)
        {
            scene.bTurn = false;
            scene.stopButton.setInteractive().setAlpha(1.0).on('pointerdown', () => {
                scene.stop();
                scene.stopButton.disableInteractive().setAlpha(0.5);
            });
        }

        if(scene.angle_speed <= 0.05)
        {
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            scene.result.setText((12-Number.parseInt(scene.angle/45))%8);
        }
        scene.angle = scene.angle + scene.angle_speed;
        if(scene.angle>360)
            scene.angle -= 360;
        scene.passion_flower.setAngle(Number.parseInt(scene.angle));
    }

}
