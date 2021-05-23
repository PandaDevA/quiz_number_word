/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class TournamentWaitScreen extends Phaser.Scene{
    constructor(){
        super({key: "TournamentWaitScreen"});
    } 

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        this.waiting_audio = this.sound.add('waiting');
        if(sound_enable)
            this.waiting_audio.play();
        this.startText = this.add.text(540, 400, 'TOURNAMENT START', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '80px',
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5, 0.5);

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.fillRoundedRect(410,500,260,200, 10);
        this.timeText = this.add.text(540,600, '10', { fixedWidth: 170, fixedHeight: 170, align:'center' })
        .setStyle({
            fontSize: '160px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#000000',
        })
        .setOrigin(0.5,0.5);

        this.detailText = this.add.text(540, 960, 'TOURNAMENT DETAILS', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '80px',
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5, 0.5);
        this.back = this.add.image(540, 1150, 'TournamentDetailBlack');

        for(let i=0; i<tournament_list.length; i++){
            if(tournament_list[i].id == room_id){
                let time = new Date(tournament_list[i].startDateTime);
                this.text = this.add.text(540,1170, "START TIME: " + getDateTimeString(time) + "\n" + "JOINING FEE: " + tournament_list[i].joiningFee + " COIN\nPRIZE: " + tournament_list[i].prize + " COIN", { fixedWidth: 800, fixedHeight: 200, align:'center' })
                .setStyle({
                    fontSize: '48px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);
            }
        }

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            args: [this],
            loop: true
        });
    }
    update(){
    }
    updateTimer(scene){
        let current_time = Number.parseInt(scene.timeText.text) - 1;
        if(current_time < 0)
        {
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            game.scene.stop('TournamentWaitScreen');
            game.scene.start('NumberGameScreen');
        }
        else{
            scene.timeText.setText(current_time);
        }
    }
}
