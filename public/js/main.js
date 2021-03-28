/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

const config = {
    type: Phaser.AUTO,
    scale: {
        parent: '#phaser-area',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 300,
        height: 600
    },
    backgroundColor: "#4488AA"
};

var game = new Phaser.Game(config);

game.state.add('login',Login);
game.state.add('home',Home);
game.state.add('game',Game);

game.state.start('login');
