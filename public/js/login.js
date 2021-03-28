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
        this.userName = this.add.text(100, 300, 'UserName', { fixedWidth: 150, fixedHeight: 36 });
        // this.usernameText = this.rexUI.add.rexInputText(100, 200, 100, 50);
        // this.password = this.rexUI.add.rexInputText(100, 200, 100, 50);
    
        this.userName.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(text)
        });

        this.helloButton = this.add.text(100, 300, 'Hello Phaser!', this.onLogin, this, 2, 1, 0);
        helloButton.setInteractive();
    }
    update(){
    }

    onLogin(){
        client.login(this.usernameText.text, this.password.text);
    }
}
