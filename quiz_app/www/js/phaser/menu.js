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
        this.button_audio = this.sound.add('button');
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xfa5c00, 1);
        this.graphics.fillRoundedRect(90,90,900,1550, 10);

        this.profileText = this.add.text(540,175, 'PROFİL')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.profileText.setInteractive()
        .on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            game.scene.stop('MenuScreen');
            game.scene.start('ProfileScreen');
        });
        let line = this.add.line(540, 270, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.rankingText = this.add.text(540,355, 'SIRALAMA')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.rankingText.setInteractive()
        .on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            Client.rank_list();
        });
        line = this.add.line(540, 450, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.ruleText = this.add.text(540,535, 'KURALLAR')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.ruleText.setInteractive()
        .on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            Client.rule_content();
        });
        line = this.add.line(540, 630, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.methodText = this.add.text(540,715, 'NASIL OYNANIR?')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.methodText.setInteractive()
        .on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            Client.method_content();
        });
        line = this.add.line(540, 810, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.policyText = this.add.text(540,895, 'GİZLİLİK SÖZLEŞMESİ')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.policyText.setInteractive()
        .on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            Client.policy_content();
        });
        line = this.add.line(540, 990, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.logoutText = this.add.text(540,1075, 'ÇIKIŞ')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.logoutText.setInteractive()
        .on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            Client.logout();
            window.localStorage.removeItem("UserName");
            window.localStorage.removeItem("Password");
            game.scene.stop('MenuScreen');
            game.scene.start('LoginScreen');
        });
        line = this.add.line(540, 1170, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);

        this.backText = this.add.text(540,1255, 'GERİ DÖN')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.backText.setInteractive()
        .on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            game.scene.stop('MenuScreen');
            game.scene.start('HomeScreen');
        });
        line = this.add.line(540, 1350, 0, 0, 800, 0, 0xffffff, 1);
        line.setLineWidth(6,6);


        this.soundText = this.add.text(280,1550, 'SES')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);

        this.soundOnText = this.add.text(500,1550, 'AÇIK')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.soundOnText
        .on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            sound_enable = true;
            this.soundOffText.setInteractive().setAlpha(0.5);
            this.soundOnText.disableInteractive().setAlpha(1);
        });

        this.soundOffText = this.add.text(760,1550, 'KAPALI')
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
        this.soundOffText
        .on('pointerdown', () => {
            sound_enable = false;
            this.soundOnText.setInteractive().setAlpha(0.5);
            this.soundOffText.disableInteractive().setAlpha(1);
        });
        if(sound_enable){
            this.soundOffText.setInteractive().setAlpha(0.5);
            this.soundOnText.disableInteractive().setAlpha(1.0);
        } else {
            this.soundOffText.disableInteractive().setAlpha(1.0);
            this.soundOnText.setInteractive().setAlpha(0.5);
        }
    }

    update(){
    }
}
