/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

const config = {
    type: Phaser.AUTO,
    scale: {
        parent: '#phaser-area',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 300,
        height: 600,
    },
    dom: {
        createContainer: true
    },        
    backgroundColor: "#4488AA",
    scene: [LoginScreen, HomeScreen, GameListScreen]
};

var game = new Phaser.Game(config);
var username = '';

if (!game.device.desktop) {
     game.input.mspointer.stop();
      game.input.touch.start();
    }
game.scene.start('LoginScreen');
