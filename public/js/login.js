/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class LoginScreen extends Phaser.Scene{
    constructor(){
        super({key: "LoginScreen"});
    }

    preload() {
        // this.load.plugin({
        //     key: 'rexuiplugin',
        //     url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });
    }

    create() {
        this.usernameText = this.rexUI.add.rexInputText(100, 100, 100, 50, config);
        this.password = this.rexUI.add.rexInputText(100, 200, 100, 50, config);
    
        this.helloButton = this.scene.add.text(100, 300, 'Hello Phaser!', this.onLogin, this, 2, 1, 0);
        helloButton.setInteractive();
    }
    update(){
    }

    onLogin(){
        client.login(this.usernameText.text, this.password.text);
    }
}
