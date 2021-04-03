/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class PassionScreen extends Phaser.Scene{
    constructor(){
        super({key: "PassionScreen"});
        this.angle_speed = 20;
        this.angle = 0.0;
        this.bStop = false;
    } 

    preload() {
        this.load.image("Passion", "./images/passion_board.png");
        this.load.image("Create", "./images/create.png");
        this.load.image("Indicator", "./images/passion_picker.png");
    }

    create() {
        this.result = this.add.text(150,20,'');

        this.passion_flower = this.add.image(150,200,'Passion');
        let angle = Number.parseInt(Math.random()*360);
        this.angle = angle;
        this.passion_flower.setAngle(angle);
        this.indicator = this.add.image(150,300,'Indicator');

        this.stopButton = this.add.image(100,500,'Create', 0).setScale(0.2);
        this.stopButton.setInteractive().on('pointerdown', () => {
            this.stop();
        });

        this.timer = this.time.addEvent({
            delay: 50,
            callback: this.updateTimer,
            args: [this],
            loop: true
        });

    }
    update(){
    }

    stop(){
        this.bStop = true;
    }
    updateTimer(scene){
        if(scene.bStop)
            scene.angle_speed /= 1.05;
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
