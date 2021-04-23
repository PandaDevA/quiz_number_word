/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class TournamentScreen extends Phaser.Scene{
    constructor(){
        super({key: "TournamentScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
    }
    
    update(){
    }
}
