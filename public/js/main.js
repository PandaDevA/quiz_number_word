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
    dom: {
        createContainer: true
    },        
    backgroundColor: "#4488AA",
    scene: [LoginScreen]
};

var game = new Phaser.Game(config);

game.scene.start('LoginScreen');
