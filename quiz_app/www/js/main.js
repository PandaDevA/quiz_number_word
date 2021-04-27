/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

var userData = {};
var oppoData = {};
var gameData = {};

var tournament_list = [];

var game_type = "";
var game_state = "";
var is_timeout = false;

var cur_number = 0;
var cur_word = 0;

var cur_point = 0;
var cur_prize = 0;

var winner_name_list = [];
var winner_point_list = [];
var invite_name = "";
var room_id = "";

const config = {
    type: Phaser.AUTO,
    scale: {
        parent: '#phaser-area',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 1680
    },
    transparent: true,
    scene: [LoginScreen, HomeScreen,TournamentScreen, NumberGameScreen, 
        EndScreen, WordGameScreen, BattleScreen, PassionScreen, 
        RegisterScreen, BattleWaitScreen, TournamentWaitScreen,
        MenuScreen ],
    dom: {
        createContainer: true
    },
};

var game = new Phaser.Game(config);

game.scene.start('LoginScreen');

