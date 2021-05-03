/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class PassionScreen extends Phaser.Scene{
    constructor(){
        super({key: "PassionScreen"});
    } 

    preload() {
        this.angle_speed = 0.05;
        this.angle = 0.0;
        this.bStop = false;
        this.bTurn = false;
    }

    create() {
        this.cameras.main.fadeIn(1000, 16, 110, 173);
        this.passion_flower = this.add.image(540,690,'Passion');
        let angle = Number.parseInt(Math.random()*360);
        this.angle = angle;
        this.passion_flower.setAngle(angle);
        this.indicator = this.add.image(540,1180,'Indicator');

        this.turnButton = this.add.image(280,1440,'Turn', 0);
        this.turnButton.setInteractive().on('pointerdown', () => {
            this.turn();
        });

        this.stopButton = this.add.image(800,1440,'Stop', 0).setAlpha(0.5);
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

        if(scene.angle_speed >= 40)
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
            let prize_list = [1,50,5,0,1,2,5,0,1,2,5,0];
            cur_prize = prize_list[Number.parseInt((scene.angle+345)/30)%12];
            Client.passion_end();
            game_type = "passion";
            game_state = "pass";
            scene.cameras.main.fadeOut(1000, 16, 110, 173);
            scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                game.scene.stop("PassionScreen");
                game.scene.start("EndScreen");
            });
        }
        scene.angle = scene.angle + scene.angle_speed;
        if(scene.angle>360)
            scene.angle -= 360;
        scene.passion_flower.setAngle(Number.parseInt(scene.angle));
    }

}
