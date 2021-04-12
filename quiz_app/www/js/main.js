/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

var userData = {};
var tournamentData = {};
var tournamentTime = "";
var gameData = {};

var game_type = "";
var cur_number = 0;
var cur_word = 0;
var cur_point = 0;

var is_timeout = false;

var winner_name = "";

var invite_name = "";
var room_id = "";

const config = {
    type: Phaser.AUTO,
    scale: {
        parent: '#phaser-area',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 1680,
    },
    transparent: true,
    scene: [LoginScreen, HomeScreen,TournamentScreen, NumberGameScreen, EndScreen, WordGameScreen, BattleScreen, PassionScreen, RegisterScreen ],
    dom: {
        createContainer: true
    },
};

var game = new Phaser.Game(config);

game.scene.start('LoginScreen');

