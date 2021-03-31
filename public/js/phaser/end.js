/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: "EndScreen"});
    }

    preload() {
        this.load.image("Home", "./images/Home.png");
    }

    create() {
        this.homeButton = this.add.image(150,400,'Home').setScale(0.3);
        this.homeButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('EndScreen');
            game.scene.start('HomeScreen');
        });
        if(winner_name != "")
        {
            this.resultText = this.add.text(50, 200, "Winner is " + winner_name + "!!!\nCongratulation....", { fixedWidth: 200, fixedHeight: 36 });
        }
        else{
            this.resultText = this.add.text(50, 200, is_timeout ? "Time out!!!" : "Game Ended!!!", { fixedWidth: 200, fixedHeight: 36 });
            this.waitingText = this.add.text(100, 300, "Waiting for result...", { fixedWidth: 100, fixedHeight: 36 });
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
