/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class NumberGameScreen extends Phaser.Scene{
    constructor(){
        super({key: "NumberGameScreen"});
        this.numberTexts = [];
        this.selected_index = -1;
        this.selected_operator = -1;
    }

    preload() {
    }

    create() {
        this.targetText = this.add.text(50, 100, 'Target:', { fixedWidth: 50, fixedHeight: 36 });
        this.targetNumber = this.add.text(100, 100, gameData.numData.result, { fixedWidth: 50, fixedHeight: 36 });
        this.remainTime = this.add.text(150, 100, 'RemainTime:', { fixedWidth: 100, fixedHeight: 36 });
        this.timeText = this.add.text(250, 100, '100', { fixedWidth: 100, fixedHeight: 36 });

        for(let i=0; i<6; i++)
        {
            let numberText = this.add.text(50 + (i%3)*50, 200 + Math.floor(i/3) * 100, gameData.numData.array[i], { fixedWidth: 30, fixedHeight: 36 });
            this.numberTexts.push(numberText);
            numberText.setInteractive().on('pointerdown', () => {
                if(this.numberTexts[i].style.color == '#aaaaaa')
                    return;
                if(this.selected_index == i)
                {
                    this.selected_index = -1;
                    this.numberTexts[i].setColor('#ffffff');
                    return;
                }
                if(this.selected_index == -1)
                {
                    this.selected_index = i;
                    this.numberTexts[i].setColor('#00ffff');
                    return;
                }
                if(this.selected_operator == -1)
                {
                    this.numberTexts[this.selected_index].setColor('#ffffff');
                    this.selected_index = i;
                    this.numberTexts[i].setColor('#00ffff');
                }
                else{
                    if(this.selected_operator == 1)
                    {
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[i].text) + Number.parseInt(this.numberTexts[this.selected_index].text));
                        this.numberTexts[this.selected_index].setColor('#aaaaaa');
                        this.numberTexts[i].setColor('#00ffff');
                        this.selected_index = i;
                    }
                    else if(this.selected_operator == 2)
                    {
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) - Number.parseInt(this.numberTexts[i].text));
                        this.numberTexts[this.selected_index].setColor('#aaaaaa');
                        this.numberTexts[i].setColor('#00ffff');
                        this.selected_index = i;
                    }
                    else if(this.selected_operator == 3)
                    {
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) * Number.parseInt(this.numberTexts[i].text));
                        this.numberTexts[this.selected_index].setColor('#aaaaaa');
                        this.numberTexts[i].setColor('#00ffff');
                        this.selected_index = i;
                    }
                    else if(this.selected_operator == 4)
                    {
                        let remainder = Number.parseInt(this.numberTexts[this.selected_index].text) % Number.parseInt(this.numberTexts[i].text);
                        if(remainder != 0)
                            return;
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) / Number.parseInt(this.numberTexts[i].text));
                        this.numberTexts[this.selected_index].setColor('#aaaaaa');
                        this.numberTexts[i].setColor('#00ffff');
                        this.selected_index = i;
                    }
                }
            });
        }

        this.plusOperator = this.add.text(50, 400, '+', { fixedWidth: 30, fixedHeight: 36 });
        this.plusOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 1)
            {
                this.selected_operator = -1;
                this.plusOperator.setColor('#ffffff');
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 1;
                this.plusOperator.setColor('#00ffff');
            }
        });

        this.minusOperator = this.add.text(100, 400, '-', { fixedWidth: 30, fixedHeight: 36 });
        this.minusOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 2)
            {
                this.selected_operator = -1;
                this.minusOperator.setColor('#ffffff');
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 2;
                this.minusOperator.setColor('#00ffff');
            }
        });

        this.multiOperator = this.add.text(150, 400, '*', { fixedWidth: 30, fixedHeight: 36 });
        this.multiOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 3)
            {
                this.selected_operator = -1;
                this.multiOperator.setColor('#ffffff');
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 3;
                this.multiOperator.setColor('#00ffff');
            }
        });

        this.diviOperator = this.add.text(200, 400, '/', { fixedWidth: 30, fixedHeight: 36 });
        this.diviOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 4)
            {
                this.selected_operator = -1;
                this.diviOperator.setColor('#ffffff');
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 4;
                this.diviOperator.setColor('#00ffff');
            }
        });

        this.checkButton = this.add.text(100, 500, 'check');
        this.checkButton.setInteractive().on('pointerdown', () => {
            if(this.selected_index == -1)
                return;
            if(this.numberTexts[this.selected_index].text == this.targetNumber.text)
            {
                game.scene.remove('NumberGameScreen');
                game.scene.start('WordGameScreen');
            }
        });

        this.refreshButton = this.add.text(200, 500, 'refresh');
        this.refreshButton.setInteractive().on('pointerdown', () => {
            this.refreshNumbers();
            this.refreshOperators();
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
            game.scene.remove('NumberGameScreen');
            game.scene.start('WordGameScreen');
        }
        else{
            scene.timeText.setText(current_time);
        }
    }

    refreshNumbers(){
        this.selected_index = -1;
        for(let i=0; i<6; i++)
        {
            this.numberTexts[i].setText(gameData.numData.array[i]);
            this.numberTexts[i].setColor('#ffffff');
        }
    }

    refreshOperators(){
        this.selected_operator = -1;
        this.plusOperator.setColor('#ffffff');
        this.minusOperator.setColor('#ffffff');
        this.multiOperator.setColor('#ffffff');
        this.diviOperator.setColor('#ffffff');
    }
}
