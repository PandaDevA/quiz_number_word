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
        this.homeButton = this.add.text(150, 400, "Home", { fixedWidth: 100, fixedHeight: 36 });
        this.homeButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('EndScreen');
            game.scene.start('HomeScreen');
        });
        if(winner_name != "")
        {
            this.resultText = this.add.text(150, 200, "Winner is " + winner_name + "!!!\nCongratulation....", { fixedWidth: 100, fixedHeight: 36 });
        }
        else{
            this.resultText = this.add.text(150, 200, is_timeout ? "Time out!!!" : "Game Ended!!!", { fixedWidth: 100, fixedHeight: 36 });
            this.waitingText = this.add.text(150, 300, "Waiting for result...", { fixedWidth: 100, fixedHeight: 36 });
        }
    }
    update(){
    }

    updateResult(){
        this.waitingText.destroy();
        if(winner_name != "")
        {
            this.resultText.setText("Winner is " + winner_name + "!!!\nCongratulation....");
        }
        else{
            this.resultText.setText("Everybody Timed out!!!\n Nobody Win...");
        }
    }
}
