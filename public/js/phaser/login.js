/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class LoginScreen extends Phaser.Scene{
    constructor(){
        super({key: "LoginScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        this.load.image("Logo", "./images/logo.png");
        this.load.image("Login", "./images/login.png");
        this.load.image("Register", "./images/register.png");
        this.load.image("UserName", "./images/username.png");
        this.load.image("Password", "./images/password.png");
    }

    create() {
        this.logo = this.add.image(150,100,'Logo').setScale(0.3);

        this.userNameImage = this.add.image(150,200,'UserName').setScale(0.3);
        this.userName = this.add.text(155, 200, 'testuser', { fixedWidth: 150, fixedHeight: 18 })
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
        })
        .setOrigin(0,0.5);

        this.passwordImage = this.add.image(150,250,'Password').setScale(0.3);
        this.password = this.add.text(155, 250, '1234', { fixedWidth: 150, fixedHeight: 18 })
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
        })
        .setOrigin(0,0.5);
    
        this.userName.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.userName)
        });

        this.password.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.password)
        });

        this.loginButton = this.add.image(150,350,'Login').setScale(0.3);
        this.loginButton.setInteractive().on('pointerdown', () => {
            console.log('login_request');
            Client.login(this.userName.text, this.password.text);
        });

        this.registerButton = this.add.image(150,450,'Register').setScale(0.3);
        this.registerButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('LoginScreen');
            game.scene.start('RegisterScreen');
        });
    }
    update(){
    }

    toast_failed(){
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
        .show('Login failed...')
        .show('Correct infomation...')
    }

    toast_register_succeed(){
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
        .show('Register succeed...')
    }
}
