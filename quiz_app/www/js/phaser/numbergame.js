/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class NumberGameScreen extends Phaser.Scene{
    constructor(){
        super({key: "NumberGameScreen"});
    }

    preload() {
        this.load.image("Logo", "./images/logo.png");
        this.load.image("Target", "./images/target.png");
        this.load.image("Time", "./images/time.png");
        this.load.spritesheet("Number", "./images/number.png", { frameWidth: 211, frameHeight: 199 });
        this.load.spritesheet("Multi", "./images/sign_multi.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Plus", "./images/sign_plus.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Minus", "./images/sign_minus.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Divi", "./images/sign_div.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Refresh", "./images/refresh.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Check", "./images/check.png", { frameWidth: 190, frameHeight: 178 });
    }

    create() {
        this.logo = this.add.image(540,120,'Logo');

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(4, '#000000', 1);
        this.graphics.strokeRoundedRect(35,190,1010,1300, 10);

        this.targetImage = this.add.image(320,350,'Target');
        this.targetNumber = this.add.text(320,390, gameData.numData[cur_number].result, { fixedWidth: 350, fixedHeight: 110 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '78px',
            fontFamily: 'RR',
            color: '#ffffff',
            align: 'center',
        });

        this.timeImage = this.add.image(760,350,'Time');
        this.timeText = this.add.text(760,390, '30', { fixedWidth: 350, fixedHeight: 110 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '78px',
            fontFamily: 'RR',
            color: '#ffffff',
            align: 'center',
        });

        this.numberTexts = [];
        this.numberImages = [];
        this.selected_index = -1;
        this.selected_operator = -1;

        for(let i=0; i<6; i++)
        {
            let numberImage = this.add.image(300 + (i%3)*240, 720 + Math.floor(i/3) * 250, 'Number', 0);
            let numberText = this.add.text(300 + (i%3)*240, 720 + Math.floor(i/3) * 250, gameData.numData[cur_number].array[i], { fixedWidth: 180, fixedHeight: 100 })
            .setOrigin(0.5,0.5)
            .setStyle({
                fontSize: '100px',
                fontFamily: 'RR',
                fontWeight:'bold',
                color: '#1d3d59',
                align: 'center',
            });
            this.numberTexts.push(numberText);
            this.numberImages.push(numberImage);
            numberImage.setInteractive().on('pointerdown', () => {
                if(this.numberImages[i].alpha == 0.5)
                    return;
                if(this.selected_index == i)
                {
                    this.selected_index = -1;
                    this.numberImages[i].setFrame(0);
                    return;
                }
                if(this.selected_index == -1)
                {
                    this.selected_index = i;
                    this.numberImages[i].setFrame(1);
                    return;
                }
                if(this.selected_operator == -1)
                {
                    this.numberImages[this.selected_index].setFrame(0);
                    this.selected_index = i;
                    this.numberImages[i].setFrame(1);
                }
                else{
                    if(this.selected_operator == 1)
                    {
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[i].text) + Number.parseInt(this.numberTexts[this.selected_index].text));
                        this.numberImages[this.selected_index].setAlpha(0.5).setFrame(0);
                        this.numberImages[i].setFrame(0);
                        this.selected_index = -1;
                    }
                    else if(this.selected_operator == 2)
                    {
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) - Number.parseInt(this.numberTexts[i].text));
                        this.numberImages[this.selected_index].setAlpha(0.5).setFrame(0);
                        this.numberImages[i].setFrame(0);
                        this.selected_index = -1;
                    }
                    else if(this.selected_operator == 3)
                    {
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) * Number.parseInt(this.numberTexts[i].text));
                        this.numberImages[this.selected_index].setAlpha(0.5).setFrame(0);
                        this.numberImages[i].setFrame(0);
                        this.selected_index = -1;
                    }
                    else if(this.selected_operator == 4)
                    {
                        let remainder = Number.parseInt(this.numberTexts[this.selected_index].text) % Number.parseInt(this.numberTexts[i].text);
                        if(remainder != 0)
                            return;
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) / Number.parseInt(this.numberTexts[i].text));
                        this.numberImages[this.selected_index].setAlpha(0.5).setFrame(0);
                        this.numberImages[i].setFrame(0);
                        this.selected_index = -1;
                    }
                }
            });
        }

        this.plusOperator = this.add.image(225, 1170,'Plus', 1);
        this.plusOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 1)
            {
                this.selected_operator = -1;
                this.plusOperator.setFrame(1);
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 1;
                this.plusOperator.setFrame(0);
            }
        });

        this.minusOperator = this.add.image(430,1170,'Minus', 1);
        this.minusOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 2)
            {
                this.selected_operator = -1;
                this.minusOperator.setFrame(1);
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 2;
                this.minusOperator.setFrame(0);
            }
        });

        this.multiOperator = this.add.image(635,1170,'Multi', 1);
        this.multiOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 3)
            {
                this.selected_operator = -1;
                this.multiOperator.setFrame(1);
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 3;
                this.multiOperator.setFrame(0);
            }
        });

        this.diviOperator = this.add.image(840,1170, 'Divi', 1);
        this.diviOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 4)
            {
                this.selected_operator = -1;
                this.diviOperator.setFrame(1);
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 4;
                this.diviOperator.setFrame(0);
            }
        });

        this.refreshButton = this.add.image(640,1380,'Refresh', 1);
        this.refreshButton.setInteractive().on('pointerdown', () => {
            this.refreshNumbers();
            this.refreshOperators();
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
        if(this.selected_index == -1)
            return;
        let bPass = false;
        let target = Number.parseInt(this.targetNumber.text);
        let result = Number.parseInt(this.numberTexts[this.selected_index].text);
        if(target == result)
        {
            bPass = true;
            cur_point += 10 + Number.parseInt(this.timeText.text);
        }
        else if(Math.abs(target-result) == 1)
        {
            bPass = true;
            cur_point += 5;
        }

        this.timer.remove();
        this.time.removeEvent(this.timer);
        if(!bPass)
        {
            game.scene.stop('NumberGameScreen');
            game.scene.start('EndScreen');
            if(game_type == "stage")
                Client.stage_end(false);
            else if(game_type == "tournament")
                Client.tournament_end(false);
            else if(game_type == "battle")
                Client.battle_end(false);
        }
        else if(cur_number == gameData.numData.length-1){
            game.scene.stop('NumberGameScreen');
            game.scene.start('WordGameScreen');
        }
        else{
            cur_number++;
            this.scene.restart();
        }
    }
    updateTimer(scene){
        let current_time = Number.parseInt(scene.timeText.text) - 1;
        if(current_time < 0)
        {
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            game.scene.stop('NumberGameScreen');
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

    refreshNumbers(){
        this.selected_index = -1;
        for(let i=0; i<6; i++)
        {
            this.numberTexts[i].setText(gameData.numData[cur_number].array[i]);
            this.numberImages[i].setAlpha(1.0);
            this.numberImages[i].setFrame(0);
        }
    }

    refreshOperators(){
        this.selected_operator = -1;
        this.plusOperator.setFrame(1);
        this.minusOperator.setFrame(1);
        this.multiOperator.setFrame(1);
        this.diviOperator.setFrame(1);
    }
}
