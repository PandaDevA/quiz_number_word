/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: "EndScreen"});
    }

    preload() {
    }

    create() {
        this.resultText = this.add.text(300, 300, "Game Ended!!!", { fixedWidth: 100, fixedHeight: 36 });
    }
    update(){
    }
}
