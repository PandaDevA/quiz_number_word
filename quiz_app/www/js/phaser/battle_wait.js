/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class BattleWaitScreen extends Phaser.Scene{
    constructor(){
        super({key: "BattleWaitScreen"});
    } 

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.image("Cancel", "./images/cancel.png");
        this.load.image("UserName", "./images/username.png");
        this.load.image("EmptyUser", "./images/avatar_empty.png");
    }

    create() {
        if(userData.avatar == ""){
            this.userAvatar = this.add.image(540,400,'UserAvatar');   
        }
        else{
            this.userAvatar = this.add.image(540,400,'user_avatar');
            this.userAvatar.setDisplaySize(390,398);
            this.userAvatar_cover = this.add.image(540,400,'avatar_cover').setDepth(5);
        }
        this.userNameBack = this.add.image(540,660,'UserName');
        this.userName = this.add.text(540, 660, userData.userName, {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            aligh: "center"
        }).setOrigin(0.5, 0.5);

        this.vs = this.add.text(540, 790, 'VS', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '120px',
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5, 0.5);

        this.oppoAvatar = this.add.image(540,1080,'EmptyUser');   
        this.oppoWaiting = this.add.text(540, 1080, 'WAITING\nOPPONENT', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            align: "center"
        }).setOrigin(0.5, 0.5);

        this.oppoNameBack = this.add.image(540,1340,'UserName');
        this.oppoName = this.add.text(540, 1340, '', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            align: "center"
        }).setOrigin(0.5, 0.5);

        this.cancelButton = this.add.image(540,1550,'Cancel');
        this.cancelButton.setInteractive().on('pointerdown', () => {
            Client.invite_cancel();
            game.scene.stop('BattleWaitScreen');
            game.scene.start('BattleScreen');
        });

        if(oppoData != "")
        {
            this.startGame();
        }
    }
    update(){
    }

    startGame(){
        this.oppoWaiting.destroy();

        if(oppoData.avatar)
        {
            if(this.textures.exists('oppo_avatar'))
                this.textures.remove('oppo_avatar');
            var scene = this;
            this.textures.on('onload', function(key, texture){
                if(key == "oppo_avatar")
                {
                    scene.oppoAvatar.setTexture('oppo_avatar');
                    scene.oppoAvatar.setDisplaySize(390,398);
                    scene.oppoAvatar_cover = scene.add.image(540,1080,'avatar_cover').setDepth(5);
                }
            });
            this.textures.addBase64('oppo_avatar', oppoData.avatar);
        }
        else{
            this.oppoAvatar.setTexture('UserAvatar');
        }

        this.oppoName.setText(oppoData.userName);
        this.cancelButton.destroy();

        this.graphics = this.add.graphics();
        // // this.graphics.lineStyle(4, '#ffffff', 1);
        // this.graphics.fillStyle(0xffffff, 1);
        // this.graphics.fillRoundedRect(100,1050,880,490, 10);
        // this.gameStartText = this.add.text(540,1130, 'WORD GAME WILL START', { fixedWidth: 780, fixedHeight: 60, align:'center' })
        // .setStyle({
        //     fontSize: '60px',
        //     fontFamily: 'RR',
        //     fontWeight: 'bold',
        //     color: '#106ead',
        // })
        // .setOrigin(0.5,0.5);
        this.graphics.fillStyle(0xfa5c00, 1);
        this.graphics.fillRoundedRect(410,1400,260,200, 10);
        this.timeText = this.add.text(540,1500, '5', { fixedWidth: 170, fixedHeight: 170, align:'center' })
        .setStyle({
            fontSize: '160px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            args: [this],
            loop: true
        });
    }

    updateTimer(scene){
        let current_time = Number.parseInt(scene.timeText.text) - 1;
        if(current_time < 0)
        {
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            game.scene.stop('BattleWaitScreen');
            game.scene.start('NumberGameScreen');
        }
        else{
            scene.timeText.setText(current_time);
        }
    }
}
