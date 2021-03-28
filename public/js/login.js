/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Login = {};

Login.init = function(){
    game.stage.disableVisibilityChange = true;
};

Login.preload = function() {
};

Login.create = function(){
    const helloButton = this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    helloButton.setInteractive();
    helloButton.on('pointerover', Login.onLogin);
};

Login.onLogin = function(){

};
