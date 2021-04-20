/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class HomeScreen extends Phaser.Scene{
    constructor(){
        super({key: "HomeScreen"});
    }

    preload() {
        this.load.image("Logo", "./images/logo.png");
        this.load.image("UserAvatar", "./images/avatar.png");
        this.load.image("Life", "./images/life.png");
        this.load.image("Coin", "./images/coin.png");
        this.load.image("InfoPanel", "./images/user_detail.png");
        this.load.image("Stage", "./images/stage.png");
        this.load.image("Battle", "./images/battle.png");
        this.load.image("Tournament", "./images/tournament.png");
        this.load.image("DailyGame", "./images/daily_game.png");
        this.load.image("TurnEarn", "./images/turn_earn.png");
        this.load.image("Menu", "./images/menu.png");
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });

        // this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        if(userData.avatar != "")
        {
            if(this.textures.exists('user_avatar'))
                this.textures.remove('user_avatar');
            this.textures.addBase64('user_avatar', userData.avatar);
        }
    }

    create() {
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
        this.info_panel = this.add.image(540,520,'InfoPanel');
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

        if(userData.avatar == ""){
            this.userAvatar = this.add.image(380,520,'UserAvatar');   
        }
        else{
            this.userAvatar = this.add.image(380,520,'user_avatar');
            this.userAvatar.setDisplaySize(330,340);
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
            Client.tournament_in();
        });
        this.daily_game = this.add.image(540,1390,'DailyGame');

        this.turn_earn = this.add.image(540,1570,'TurnEarn');
        this.turn_earn.setInteractive().on('pointerdown', () => {
            game.scene.stop('HomeScreen');
            game.scene.start('PassionScreen');
        });

        this.menu = this.add.image(960,1570,'Menu');

        // this.userName = this.add.text(100, 100, 'testuser', { fixedWidth: 150, fixedHeight: 36 });
        // this.password = this.add.text(100, 200, '123', { fixedWidth: 150, fixedHeight: 36 });
    
        // this.userName.setInteractive().on('pointerdown', () => {
        //     this.rexUI.edit(this.userName)
        // });

        // this.password.setInteractive().on('pointerdown', () => {
        //     this.rexUI.edit(this.password)
        // });
    }
    update_userData(){
        this.coinText.setText(userData.coin);
        this.lifeText.setText(userData.heart);
        this.points.setText(userData.point);
    }

    toast_tournament_failed(){
        var toast = this.rexUI.add.toast({
            x: 150,
            y: 550,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xcc4040),
            text: this.add.text(0, 0, '', {
                fontSize: '18px'
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },

            duration: {
                in: 250,
                hold: 1000,
                out: 250,
            },
        })
        .show('Can not take part in tournament...')
    }

    toast_stage_failed(){
        var toast = this.rexUI.add.toast({
            x: 150,
            y: 550,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xcc4040),
            text: this.add.text(0, 0, '', {
                fontSize: '18px'
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },

            duration: {
                in: 250,
                hold: 1000,
                out: 250,
            },
        })
        .show('Can not play stage...')
    }
}
