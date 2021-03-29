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
    }

    create() {
        this.userName = this.add.text(100, 100, 'testuser', { fixedWidth: 150, fixedHeight: 36 });
        this.password = this.add.text(100, 200, '123', { fixedWidth: 150, fixedHeight: 36 });
    
        this.userName.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.userName)
        });

        this.password.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.password)
        });

        this.loginButton = this.add.text(100, 300, 'Log In');
        this.loginButton.setInteractive().on('pointerdown', () => {
            Client.login(this.userName.text, this.password.text);
        });
    }
    update(){
    }
}
