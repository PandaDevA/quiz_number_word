/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

var userData = {};
var roomData = {};
var gameData = {};

var game_type = "";
var cur_number = 0;
var cur_word = 0;
var cur_point = 0;

var is_timeout = false;

var winner_name = "";


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
    scene: [LoginScreen, HomeScreen, ListScreen, RoomScreen, NumberGameScreen, EndScreen, WordGameScreen, BattleScreen ]
};

var game = new Phaser.Game(config);
// if (!game.device.os.desktop) {
//     game.input.mousePointer.stop();
//     // game.input.touch.startListeners();
// }
game.scene.start('LoginScreen');

