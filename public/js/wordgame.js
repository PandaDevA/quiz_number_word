/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class WordGameScreen extends Phaser.Scene{
    constructor(){
        super({key: "WordGameScreen"});
        this.characterTexts = [];
    }

    preload() {
    }

    create() {
        this.resultText = this.add.text(50, 100, 'Result:', { fixedWidth: 50, fixedHeight: 36 });
        this.resultWord = this.add.text(100, 100, '', { fixedWidth: 200, fixedHeight: 36 });
        this.remainTime = this.add.text(150, 100, 'RemainTime:', { fixedWidth: 100, fixedHeight: 36 });
        this.timeText = this.add.text(250, 100, '30', { fixedWidth: 100, fixedHeight: 36 });

        let quiz_word = gameData.wordData.split('');
        let mix_word = [];
        while (quiz_word.length > 0) {
            let character = '';
            if(Math.random() >= 0.5)
                character = quiz_word.pop();
            else
                character = quiz_word.shift();

            if(Math.random() >= 0.5)
                mix_word.push(character);
            else
                mix_word.unshift(character);
        }

        for(let i=0; i<mix_word.length; i++)
        {
            let characterText = this.add.text(50 + (i%5)*30, 200 + Math.floor(i/5) * 100, mix_word[i], { fixedWidth: 30, fixedHeight: 36 });
            this.characterTexts.push(characterText);
            characterText.setInteractive().on('pointerdown', () => {
                if(this.characterTexts[i].style.color == '#aaaaaa')
                    return;
                this.resultWord.setText(this.resultWord.text + this.characterTexts[i].text);
                this.characterTexts[i].setColor('#aaaaaa');
            });
        }

        this.checkButton = this.add.text(100, 500, 'check');
        this.checkButton.setInteractive().on('pointerdown', () => {
            if(this.resultWord.text == gameData.wordData)
            {
                this.timer.remove();
                this.time.removeEvent(this.timer);
                game.scene.stop('WordGameScreen');
                game.scene.start('EndScreen');
                Client.end(false);
            }
        });

        this.refreshButton = this.add.text(200, 500, 'refresh');
        this.refreshButton.setInteractive().on('pointerdown', () => {
            this.resultWord.setText('');
            for(let i=0; i<this.characterTexts.length; i++)
                this.characterTexts[i].setColor('#ffffff');
        });
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            args: [this],
            loop: true
        });
    }
    update(){
    }

    updateTimer(scene){
        let current_time = Number.parseInt(scene.timeText.text) - 1;
        if(current_time < 0)
        {
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            is_timeout = true;
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
            Client.end(true);
        }
        else{
            scene.timeText.setText(current_time);
        }
    }
}
