/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Login = {};

Login.init = function(){
    game.stage.disableVisibilityChange = true;
};

Login.preload = function() {
    Login.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
};

Login.create = function(){
    var usernameText = scene.add.rexInputText(100, 100, 100, 50, config);
    var password = scene.add.rexInputText(100, 200, 100, 50, config);

    const helloButton = this.add.text(100, 300, 'Hello Phaser!', Login.onLogin, this, 2, 1, 0);
    helloButton.setInteractive();
};

Login.onLogin = function(){
    client.login()
};
