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
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });

        // this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
    }

    create() {
        this.userAvatar = this.add.image(150,100,'UserAvatar').setScale(0.3);
        this.userName = this.add.text(150,160, userData.username, { fixedWidth: 150, fixedHeight: 36 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
            });
        this.circle = this.add.image(230,100,'Circle').setScale(0.3);
        this.heart = this.add.image(70,100,'Heart').setScale(0.3);
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
        this.battle = this.add.image(150,330,'Battle').setScale(0.3);
        this.tournament = this.add.image(150,400,'Tournament').setScale(0.3);
        this.tournament.setInteractive().on('pointerdown', () => {
            game.scene.stop('HomeScreen');
            game.scene.start('ListScreen');
        });
        this.dailyGame = this.add.image(80,500,'DailyGame').setScale(0.3);
        this.passionFlower = this.add.image(220,500,'PassionFlower').setScale(0.3);
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
    }
}
