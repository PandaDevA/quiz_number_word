/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: "EndScreen"});
    }

    preload() {
        this.load.image("Back", "./images/back.png");
    }

    create() {
        this.homeButton = this.add.image(150,400,'Back').setScale(0.3);
        this.homeButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('EndScreen');
            game.scene.start('HomeScreen');
        });
        if(winner_name != "")
        {
            this.resultText = this.add.text(50, 200, "Winner is " + winner_name + "!!!\nCongratulation....", { fixedWidth: 200, fixedHeight: 36 });
        }
        else if(game_type == "stage")
        {
            this.resultText = this.add.text(50, 200, "Game Ended!!!", { fixedWidth: 200, fixedHeight: 36 });
        }
        else{
            this.resultText = this.add.text(50, 200, is_timeout ? "Time out!!!" : "Game Ended!!!", { fixedWidth: 200, fixedHeight: 36 });
            this.waitingText = this.add.text(50, 300, "Waiting for result...", { fixedWidth: 200, fixedHeight: 36 });
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
