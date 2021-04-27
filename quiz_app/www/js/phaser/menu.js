/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class MenuScreen extends Phaser.Scene{
    constructor(){
        super({key: "MenuScreen"});
    }

    preload() {
    }

    create() {
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xfa5c00, 1);
        this.graphics.fillRoundedRect(90,90,900,1550, 10);

        this.profileText = this.add.text(540,175, 'PROFILE')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.profileText.setInteractive()
        .on('pointerdown', () => {
            
        });
        let line = this.add.line(540, 270, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.rankingText = this.add.text(540,355, 'RANKING')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.rankingText.setInteractive()
        .on('pointerdown', () => {
            
        });
        line = this.add.line(540, 450, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.ruleText = this.add.text(540,535, 'RULE')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.ruleText.setInteractive()
        .on('pointerdown', () => {
            
        });
        line = this.add.line(540, 630, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.methodText = this.add.text(540,715, 'HOW TO PLAY?')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.methodText.setInteractive()
        .on('pointerdown', () => {
            
        });
        line = this.add.line(540, 810, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.policyText = this.add.text(540,895, 'PRIVACY POLICY')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.policyText.setInteractive()
        .on('pointerdown', () => {
            
        });
        line = this.add.line(540, 990, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.logoutText = this.add.text(540,1075, 'LOGOUT')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.logoutText.setInteractive()
        .on('pointerdown', () => {
            
        });
        line = this.add.line(540, 1170, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.backText = this.add.text(540,1255, 'BACK')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.backText.setInteractive()
        .on('pointerdown', () => {
            game.scene.stop('MenuScreen');
            game.scene.start('HomeScreen');
        });
        line = this.add.line(540, 1350, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);


        this.soundText = this.add.text(380,1550, 'SOUND')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);

        this.soundOnText = this.add.text(600,1550, 'ON')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.soundOnText.disableInteractive()
        .on('pointerdown', () => {
            this.soundOffText.setInteractive().setAlpha(0.5);
            this.soundOnText.disableInteractive().setAlpha(1);
        });

        this.soundOffText = this.add.text(760,1550, 'OFF')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.soundOffText.setInteractive()
        .on('pointerdown', () => {
            this.soundOnText.setInteractive().setAlpha(0.5);
            this.soundOffText.disableInteractive().setAlpha(1);
        }).setAlpha(0.5);
    }

    update(){
    }
}
