/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class HomeScreen extends Phaser.Scene{
    constructor(){
        super({key: "HomeScreen"});
    }

    preload() {
        this.load.image("UserAvatar", "./images/avatar.png");
        this.load.image("Circle", "./images/circle1.png");
        this.load.image("Heart", "./images/heart1.png");
        this.load.image("Point", "./images/point1.png");
        this.load.image("Ranking", "./images/ranking1.png");
        this.load.image("Stage", "./images/button1.png");
        this.load.image("Battle", "./images/button2.png");
        this.load.image("Tournament", "./images/button3.png");
        this.load.image("DailyGame", "./images/link1.png");
        this.load.image("PassionFlower", "./images/link2.png");
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        // this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        if(userData.avatar != "")
        {
            if(this.textures.exists('user_avatar'))
                this.textures.remove('user_avatar');
            this.textures.addBase64('user_avatar', userData.avatar);
        }
    }

    create() {
        if(userData.avatar == ""){
            this.userAvatar = this.add.image(150,100,'UserAvatar').setScale(0.3);   
        }
        else{
            this.userAvatar = this.add.image(150,100,'user_avatar');
            this.userAvatar.setDisplaySize(75,75);
        }
        this.userName = this.add.text(150,160, userData.username, { fixedWidth: 150, fixedHeight: 36 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
            });
        this.circle = this.add.image(230,100,'Circle').setScale(0.3);
        this.coinText = this.add.text(230,100, userData.coin, { fixedWidth: 22, fixedHeight: 22 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#eae9d7',
                align: 'center',
            });
        this.heart = this.add.image(70,100,'Heart').setScale(0.3);
        this.heartText = this.add.text(70,100, userData.heart, { fixedWidth: 20, fixedHeight: 20 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#fe7042',
                align: 'center',
            });
        this.point = this.add.image(150,180,'Point').setScale(0.3);
        this.points = this.add.text(205,187, userData.point, { fixedWidth: 80, fixedHeight: 36 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#000000',
            });
        this.ranking = this.add.image(150,210,'Ranking').setScale(0.3);
        this.stage = this.add.image(150,260,'Stage').setScale(0.3);
        this.stage.setInteractive().on('pointerdown', () => {
            Client.stage_start();
        });
        this.battle = this.add.image(150,330,'Battle').setScale(0.3);
        this.battle.setInteractive().on('pointerdown', () => {
            game.scene.stop('HomeScreen');
            game.scene.start('BattleScreen');
        });
        this.tournament = this.add.image(150,400,'Tournament').setScale(0.3);
        this.tournament.setInteractive().on('pointerdown', () => {
            Client.tournament_in();
        });
        this.dailyGame = this.add.image(80,500,'DailyGame').setScale(0.3);
        this.passionFlower = this.add.image(220,500,'PassionFlower').setScale(0.3);
        this.passionFlower.setInteractive().on('pointerdown', () => {
            game.scene.stop('HomeScreen');
            game.scene.start('PassionScreen');
        });
        // this.userName = this.add.text(100, 100, 'testuser', { fixedWidth: 150, fixedHeight: 36 });
        // this.password = this.add.text(100, 200, '123', { fixedWidth: 150, fixedHeight: 36 });
    
        // this.userName.setInteractive().on('pointerdown', () => {
        //     this.rexUI.edit(this.userName)
        // });

        // this.password.setInteractive().on('pointerdown', () => {
        //     this.rexUI.edit(this.password)
        // });
    }
    update(){
        this.coinText.setText(userData.coin);
        this.heartText.setText(userData.heart);
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
