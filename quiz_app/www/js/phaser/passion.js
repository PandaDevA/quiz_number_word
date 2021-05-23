/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class PassionScreen extends Phaser.Scene{
    constructor(){
        super({key: "PassionScreen"});
    } 

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.angle_speed = 0.05;
        this.angle = 0.0;
        this.bStop = false;
        this.bTurn = false;
    }

    create() {
        this.button_audio = this.sound.add('button');
        this.passion_flower = this.add.image(540,600,'Passion');
        let angle = Number.parseInt(Math.random()*360);
        this.angle = angle;
        this.passion_flower.setAngle(angle);
        this.indicator = this.add.image(540,1090,'Indicator');

        this.turnButton = this.add.image(280,1350,'Turn', 0);
        this.turnButton.setInteractive().on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            this.turn();
        });

        this.stopButton = this.add.image(800,1350,'Stop', 0).setAlpha(0.5);
        this.stopButton.disableInteractive();        

        this.mainPageButton = this.add.image(540,1550,'MainPage');
        this.mainPageButton.setInteractive().on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            game.scene.stop('PassionScreen');
            game.scene.start('HomeScreen');
        });

    }
    update(){
    }

    turn(){
        this.turnButton.disableInteractive().setAlpha(0.5);
        this.mainPageButton.disableInteractive().setAlpha(0.5);
        this.bTurn = true;
        this.timer = this.time.addEvent({
            delay: 100,
            callback: this.updateTimer,
            args: [this],
            loop: true
        });
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
            if(scene.bStop == false && scene.stopButton.alpha == 0.5)
            {
                scene.stopButton.setInteractive().setAlpha(1.0).on('pointerdown', () => {
                    if(sound_enable){
                        scene.button_audio.play();
                    }
                    scene.bStop = true;
                    scene.stopButton.disableInteractive().setAlpha(0.5);
                });
            }
        }

        if(scene.angle_speed < 0.05)
        {
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            let prize_list = [2,-1,-1,0,-1,1,-1,-1,0,-1,1,-1];
            cur_prize = prize_list[Number.parseInt((scene.angle+345)/30)%12];

            if(cur_prize == -1){
                AdMob.showInterstitial();
                AdMob.prepareInterstitial({
                    adId: admobid.interstitial,
                    autoShow:false,
                    isTesting: true,
                });
            } else if(cur_prize == 0){
                Client.prize(1,0,0);
                toast_error(scene, "1 can kazandınız.");
            } else{
                Client.prize(0,0,cur_prize);
                toast_error(scene, cur_prize + " jeton kazandınız.");
            }
            scene.angle_speed = 0.05;
            scene.bStop = false;
            scene.bTurn = false;
            scene.turnButton.setInteractive().setAlpha(1.0);
            scene.mainPageButton.setInteractive().setAlpha(1.0);
            scene.stopButton.disableInteractive().setAlpha(0.5);
        }
        scene.angle = scene.angle + scene.angle_speed;
        if(scene.angle>360)
            scene.angle -= 360;
        scene.passion_flower.setAngle(Number.parseInt(scene.angle));
    }

}
