/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class WordGameScreen extends Phaser.Scene{
    constructor(){
        super({key: "WordGameScreen"});
    }

    preload() {
        this.load.image("Result", "./images/result.png");
        this.load.image("Time", "./images/time.png");
        this.load.image("Circle2", "./images/circle2.png");
        this.load.image("Heart2", "./images/heart2.png");
        this.load.spritesheet("Number", "./images/number.png", { frameWidth: 188, frameHeight: 176 });
        this.load.image("Refresh", "./images/refresh.png");
        this.load.image("Check", "./images/check.png");
    }

    create() {
        this.characterTexts = [];
        this.characterImages = [];

        this.circleImage = this.add.image(56,30,'Circle2').setScale(0.3);
        this.coinText = this.add.text(70,32, userData.coin, { fixedWidth: 22, fixedHeight: 22 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
            align: 'center',
        });

        this.heartImage = this.add.image(242,30,'Heart2').setScale(0.3);
        this.heartText = this.add.text(250,30, userData.heart, { fixedWidth: 20, fixedHeight: 20 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#000000',
                align: 'center',
            });

        this.resultImage = this.add.image(150,150,'Result').setScale(0.3);
        this.resultWord = this.add.text(150,160, '', { fixedWidth: 150, fixedHeight: 36 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#000000',
            align: 'center',
        });

        this.timeImage = this.add.image(150,80,'Time').setScale(0.3);
        this.timeText = this.add.text(150,90, '10', { fixedWidth: 150, fixedHeight: 36 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#000000',
            align: 'center',
        });

        let quiz_word = gameData.wordData[cur_word].split('');
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
            let characterImage = this.add.image(60 + (i%4)*60, 270 + Math.floor(i/4) * 60,'Number', 0).setScale(0.3);
            let characterText = this.add.text(60 + (i%4)*60, 270 + Math.floor(i/4) * 60, mix_word[i], { fixedWidth: 60, fixedHeight: 60 })
            .setOrigin(0.5,0.2)
            .setStyle({
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#000000',
                align: 'center',
            });
            this.characterTexts.push(characterText);
            this.characterImages.push(characterImage);

            characterImage.setInteractive().on('pointerdown', () => {
                if(this.characterImages[i].alpha == 0.5)
                    return;
                this.resultWord.setText(this.resultWord.text + this.characterTexts[i].text);
                this.characterImages[i].setAlpha(0.5);
            });
        }

        this.refreshButton = this.add.image(200,500,'Refresh').setScale(0.3);
        this.refreshButton.setInteractive().on('pointerdown', () => {
            this.resultWord.setText('');
            for(let i=0; i<this.characterImages.length; i++)
                this.characterImages[i].setAlpha(1);
        });

        this.checkButton = this.add.image(100,500,'Check').setScale(0.3);
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
        if(this.resultWord.text == gameData.wordData[cur_word])
        {
            bPass = true;
            cur_point += 15 + Number.parseInt(this.timeText.text);
        }
        
        this.timer.remove();
        this.time.removeEvent(this.timer);
        if(!bPass){
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
            if(game_type == "stage")
                Client.stage_end(false);
            else if(game_type == "tournament")
                Client.tournament_end(false);
            else if(game_type == "battle")
                Client.battle_end(false);
        }
        else if(cur_word == gameData.wordData.length-1)
        {
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
            if(game_type == "stage")
                Client.stage_end(true);
            else if(game_type == "tournament")
                Client.tournament_end(true);
            else if(game_type == "battle")
                Client.battle_end(true);
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
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
            if(game_type == "stage")
                Client.stage_end(false);
            else if(game_type == "tournament")
                Client.tournament_end(false);
            else if(game_type == "battle")
                Client.battle_end(false);
        }
        else{
            scene.timeText.setText(current_time);
        }
    }
}
