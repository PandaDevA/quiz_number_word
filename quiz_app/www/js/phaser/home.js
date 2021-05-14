/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class HomeScreen extends Phaser.Scene{
    constructor(){
        super({key: "HomeScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        if(userData.avatar != "")
        {
            if(this.textures.exists('user_avatar'))
                this.textures.remove('user_avatar');
            this.textures.addBase64('user_avatar', userData.avatar);
        }
    }

    create() {
        oppoData = "";

        this.logo = this.add.image(540,120,'Logo');

        this.coin = this.add.image(820,120,'Coin');
        this.coinText = this.add.text(820,140, userData.coin, { fixedWidth: 80, fixedHeight: 50 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '48px',
                fontFamily: 'RR',
                color: '#106eac',
                align: 'center',
            });
        this.life = this.add.image(260,120,'Life');
        this.lifeText = this.add.text(260,140, userData.heart, { fixedWidth: 80, fixedHeight: 50 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '48px',
                fontFamily: 'RR',
                color: '#106eac',
                align: 'center',
            });

        // this.userName = this.add.text(150,160, userData.userName, { fixedWidth: 150, fixedHeight: 36 })
        //     .setOrigin(0.5,0.5)
        //     .setStyle({
        //         fontSize: '24px',
        //         fontFamily: 'Arial',
        //         color: '#ffffff',
        //         align: 'center',
        //     });
        this.info_panel = this.add.image(735,520,'InfoPanel');
        this.pointText = this.add.text(720,570,'Point', { fixedWidth: 180, fixedHeight: 50 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '46px',
            fontFamily: 'RR',
            color: '#ffffff',
            align: 'center',
        });
        this.points = this.add.text(720,645, userData.point, { fixedWidth: 300, fixedHeight: 64 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '60px',
            fontFamily: 'RR',
            color: '#ffffff',
            align: 'center',
        });

        this.rankingText = this.add.text(720,390,'Ranking', { fixedWidth: 180, fixedHeight: 50 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '46px',
            fontFamily: 'RR',
            color: '#ffffff',
            align: 'center',
        });
        this.rank = this.add.text(720,465, userData.rank, { fixedWidth: 300, fixedHeight: 64 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '60px',
            fontFamily: 'RR',
            color: '#ffffff',
            align: 'center',
        });


        if(userData.avatar == ""){
            this.userAvatar = this.add.image(345,520,'UserAvatar');   
        }
        else{
            this.userAvatar = this.add.image(345,520,'user_avatar');
            this.userAvatar.setDisplaySize(390,398);
            this.userAvatar_cover = this.add.image(345,520,'avatar_cover').setDepth(5);
        }

        this.stage = this.add.image(540,850,'Stage');
        this.stage.setInteractive().on('pointerdown', () => {
            Client.stage_start();
        });
        this.battle = this.add.image(540,1030,'Battle');
        this.battle.setInteractive().on('pointerdown', () => {
            game.scene.stop('HomeScreen');
            game.scene.start('BattleScreen');
        });
        this.tournament = this.add.image(540,1210,'Tournament');
        this.tournament.setInteractive().on('pointerdown', () => {
            Client.tournament_list();
        });
        this.daily_game = this.add.image(540,1390,'DailyGame');
        this.daily_game.setInteractive().on('pointerdown', () => {
            Client.daily_start();
        });

        this.turn_earn = this.add.image(540,1570,'TurnEarn');
        this.turn_earn.setInteractive().on('pointerdown', () => {
            Client.passion_start();
        });

        this.menu = this.add.image(960,1570,'Menu');
        this.menu.setInteractive().on('pointerdown', () => {
            game.scene.stop('HomeScreen');
            game.scene.start('MenuScreen');
        });
    }
    update_userData(){
        this.coinText.setText(userData.coin);
        this.lifeText.setText(userData.heart);
        this.points.setText(userData.point);
    }
}
