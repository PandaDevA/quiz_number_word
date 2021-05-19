/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

var userData = {};
var oppoData = {};
var gameData = {};

var tournament_list = [];
var rank_list = [];
var rule_content = "";
var method_content = "";
var policy_content = "";

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
    scene: [LoginScreen, HomeScreen, TournamentScreen, NumberGameScreen, 
        EndScreen, WordGameScreen, BattleScreen, PassionScreen, 
        RegisterScreen, BattleWaitScreen, TournamentWaitScreen,
        MenuScreen, RankScreen, RuleScreen, MethodScreen, PolicyScreen, ProfileScreen ],
    dom: {
        createContainer: true
    },
};

var game = new Phaser.Game(config);

game.scene.start('LoginScreen');
document.addEventListener('deviceready',
    function(){
        document.addEventListener("backbutton", onBackKeyDown, false);
    },
    false
);

function onBackKeyDown() {
    let activeScene = game.scene.getScenes(true)[0];
    let activeName = activeScene.scene.key
    switch(activeName){
        case "LoginScreen":
            navigator.app.exitApp();
            break;
        case "EndScreen":
            game.scene.stop(activeName);
            game.scale.start("HomeScreen");
            break;
        case "TournamentScreen":
            game.scene.stop(activeName);
            game.scale.start("HomeScreen");
            break;
        case "BattleScreen":
            game.scene.stop(activeName);
            game.scale.start("HomeScreen");
            break;
        case "MenuScreen":
            game.scene.stop(activeName);
            game.scale.start("HomeScreen");
            break;
        case "RankScreen":
            game.scene.stop(activeName);
            game.scale.start("HomeScreen");
            break;
        case "RuleScreen":
            game.scene.stop(activeName);
            game.scale.start("HomeScreen");
            break;
        case "PolicyScreen":
            game.scene.stop(activeName);
            game.scale.start("HomeScreen");
            break;
        case "ProfileScreen":
            game.scene.stop(activeName);
            game.scale.start("HomeScreen");
            break;
        case "RegisterScreen":
            game.scene.stop(activeName);
            game.scale.start("LoginScreen");
            break;
    }
}

const getDateTimeString = (date) => {

    const pad = (s) => (s < 10 ? '0' + s : s);
    const dateString = [
        pad(date.getDate()),
        pad(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
    const timeString = [pad(date.getHours()), pad(date.getMinutes())].join(':');

    return dateString + ' ' + timeString;
}
