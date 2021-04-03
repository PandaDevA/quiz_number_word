/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class BattleScreen extends Phaser.Scene{
    constructor(){
        super({key: "BattleScreen"});
    } 

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        this.load.spritesheet("Invite", "./images/invite.png", { frameWidth: 493, frameHeight: 146 });
        this.load.spritesheet("Cancel", "./images/cancel.png", { frameWidth: 493, frameHeight: 146 });
        this.load.image("Random", "./images/random.png");
        this.load.image("UserName", "./images/username.png");
    }

    create() {
        this.invite_battle = this.add.text(150, 50, 'Invite Battle', { fixedHeight: 32 })
        .setStyle({
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#fdb63a',
        }).setOrigin(0.5,0);

        this.userNameImage = this.add.image(150,150,'UserName').setScale(0.3);
        this.userName = this.add.text(155, 150, 'testuser', { fixedWidth: 100, fixedHeight: 18 })
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
        })
        .setOrigin(0,0.5);
        this.userName.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.userName)
        });

        this.inviteButton = this.add.image(100,230,'Invite', 0).setScale(0.2);
        this.inviteButton.setInteractive().on('pointerdown', () => {
            Client.invite_request(this.userName.text);
        });

        this.invite_cancel_Button = this.add.image(200,230,'Cancel', 0).setScale(0.2);
        this.invite_cancel_Button.setInteractive().on('pointerdown', () => {
            Client.invite_cancel();
        });


        this.random_battle = this.add.text(150, 300, 'Random Battle', { fixedHeight: 32 })
        .setStyle({
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#fdb63a',
        }).setOrigin(0.5,0);

        this.randomButton = this.add.image(100,400,'Random').setScale(0.2);
        this.randomButton.setInteractive().on('pointerdown', () => {
            Client.random_request();
        });

        this.random_cancel_Button = this.add.image(200,400,'Cancel', 0).setScale(0.2);
        this.random_cancel_Button.setInteractive(false);
    }
    update(){
    }

    invite_request(){
        this.userName.setText(invite_name);
        this.inviteButton.setFrame(1);
        this.inviteButton.setInteractive().on('pointerdown', () => {
            Client.invite_accept();
        });
        this.invite_cancel_Button.setFrame(1);
        this.invite_cancel_Button.setInteractive().on('pointerdown', () => {
            Client.invite_reject();
        });
    }

    invite_request_failed(){
        this.inviteButton.setFrame(0);
        this.inviteButton.setInteractive().on('pointerdown', () => {
            Client.invite_request(this.userName.text);
        });
        this.invite_cancel_Button.setFrame(0);
        this.invite_cancel_Button.setInteractive().on('pointerdown', () => {
            Client.invite_cancel();
        });
    }

    random_request(){
        this.randomButton.setFrame(1);
        this.randomButton.setInteractive(false);
        this.random_cancel_Button.setInteractive().on('pointerdown', () => {
            Client.random_cancel();
            this.randomButton.setFrame(0);
            this.randomButton.setInteractive().on('pointerdown', () => {
                Client.random_request();
            });
        });
    }
}
