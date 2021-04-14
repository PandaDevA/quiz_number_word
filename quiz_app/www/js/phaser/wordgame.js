/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class WordGameScreen extends Phaser.Scene{
    constructor(){
        super({key: "WordGameScreen"});
    }

    preload() {
        this.load.image("Logo", "./images/logo.png");
        this.load.image("Time", "./images/time.png");
        this.load.image("Letter", "./images/letter.png");
        this.load.spritesheet("Number", "./images/number.png", { frameWidth: 211, frameHeight: 199 });
        this.load.spritesheet("Refresh", "./images/refresh.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Check", "./images/check.png", { frameWidth: 190, frameHeight: 178 });
    }

    create() {
        this.logo = this.add.image(540,120,'Logo');

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(4, '#000000', 1);
        this.graphics.strokeRoundedRect(35,190,1010,1300, 10);

        this.timeImage = this.add.image(540,350,'Time');
        this.timeText = this.add.text(540,390, '30', { fixedWidth: 350, fixedHeight: 110 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '78px',
            fontFamily: 'RR',
            color: '#ffffff',
            align: 'center',
        });

        this.characterTexts = [];
        this.characterImages = [];
        this.resultTexts = [];
        this.result = "";

        let quiz_word = gameData.wordData[cur_word].word.split('');
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
            let resultImage = this.add.image(135 + i*115, 700,'Letter');
            let resultText = this.add.text(135 + i*115, 700, '', { fixedWidth: 90, fixedHeight: 90 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '90px',
                fontFamily: 'RR',
                color: '#1d3d59',
                align: 'center',
            });

            let characterImage = this.add.image(175 + (i%4)*240, 925 + Math.floor(i/4) * 230,'Number', 0);
            let characterText = this.add.text(175 + (i%4)*240, 925 + Math.floor(i/4) * 230, mix_word[i], { fixedWidth: 150, fixedHeight: 150 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '150px',
                fontFamily: 'RR',
                color: '#1d3d59',
                align: 'center',
            });
            this.characterTexts.push(characterText);
            this.characterImages.push(characterImage);
            this.resultTexts.push(resultText);

            characterImage.setInteractive().on('pointerdown', () => {
                this.result = this.result + this.characterTexts[i].text;
                this.resultTexts[this.result.length-1].setText(this.characterTexts[i].text);
            });
        }

        this.refreshButton = this.add.image(640,1380,'Refresh', 1);
        this.refreshButton.setInteractive().on('pointerdown', () => {
            this.result = '';
            for(var i=0; i<this.resultTexts.length; i++)
                this.resultTexts[i].setText('');
        });

        this.checkButton = this.add.image(440,1380,'Check', 1);
        this.checkButton.setInteractive().on('pointerdown', () => {
            this.checkResult();
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

    checkResult(){
        let bPass = false;
        let match_index = gameData.wordData[cur_word].matchArray.indexOf(this.result);
        if(match_index != -1)
        {
            bPass = true;
            let word_length = gameData.wordData[cur_word].matchArray[match_index].length;
            if(word_length == 8){
                cur_point += 10 + Number.parseInt(this.timeText.text);
            }
            else if(word_length == 7){
                cur_point += 5;
            }
            else if(word_length == 6){
                cur_point += 2;
            }
        }
        
        this.timer.remove();
        this.time.removeEvent(this.timer);
        if(!bPass){
            if(game_type == "stage")
            {
                Client.stage_end(false);
                game_state = "failed";
            }
            else if(game_type == "tournament")
                Client.tournament_end(false);
            else if(game_type == "battle")
                Client.battle_end(false);
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
        }
        else if(cur_word == gameData.wordData.length-1)
        {
            if(game_type == "stage")
            {
                Client.stage_end(true);
                game_state = "word";
            }
            else if(game_type == "tournament")
                Client.tournament_end(true);
            else if(game_type == "battle")
                Client.battle_end(true);
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
        }
        else{
            cur_word++;
            this.scene.restart();
        }
    }

    updateTimer(scene){
        let current_time = Number.parseInt(scene.timeText.text) - 1;
        if(current_time < 0)
        {
            if(game_type == "stage")
            {
                Client.stage_end(false);
                game_state = "failed";
            }
            else if(game_type == "tournament")
                Client.tournament_end(false);
            else if(game_type == "battle")
                Client.battle_end(false);

            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
        }
        else{
            scene.timeText.setText(current_time);
        }
    }
}
