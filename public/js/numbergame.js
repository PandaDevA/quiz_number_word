/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class NumberGameScreen extends Phaser.Scene{
    constructor(){
        super({key: "NumberGameScreen"});
        this.numberTexts = [];
        this.numberImages = [];
        this.selected_index = -1;
        this.selected_operator = -1;
    }

    preload() {
        this.load.image("Target", "./images/target.png");
        this.load.image("Time", "./images/time.png");
        this.load.image("Circle2", "./images/circle2.png");
        this.load.image("Heart2", "./images/heart2.png");
        this.load.spritesheet("Number", "./images/number.png", { frameWidth: 188, frameHeight: 176 });
        this.load.spritesheet("Multi", "./images/sign1.png", { frameWidth: 169, frameHeight: 158 });
        this.load.spritesheet("Plus", "./images/sign2.png", { frameWidth: 168, frameHeight: 158 });
        this.load.spritesheet("Minus", "./images/sign3.png", { frameWidth: 168, frameHeight: 158 });
        this.load.spritesheet("Divi", "./images/sign4.png", { frameWidth: 169, frameHeight: 158 });
        this.load.image("Refresh", "./images/refresh.png");
    }

    create() {
        this.circleImage = this.add.image(56,30,'Circle2').setScale(0.3);
        this.heartImage = this.add.image(242,30,'Heart2').setScale(0.3);

        this.targetImage = this.add.image(80,80,'Target').setScale(0.3);
        this.targetNumber = this.add.text(80,90, gameData.numData.result, { fixedWidth: 150, fixedHeight: 36 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#000000',
            align: 'center',
        });
        this.timeImage = this.add.image(220,80,'Time').setScale(0.3);
        this.timeText = this.add.text(220,90, '1', { fixedWidth: 150, fixedHeight: 36 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#000000',
            align: 'center',
        });

        for(let i=0; i<6; i++)
        {
            let numberImage = this.add.image(90 + (i%3)*60, 270 + Math.floor(i/3) * 60,'Number', 0).setScale(0.3);
            let numberText = this.add.text(90 + (i%3)*60, 270 + Math.floor(i/3) * 60, gameData.numData.array[i], { fixedWidth: 60, fixedHeight: 60 })
            .setOrigin(0.5,0.2)
            .setStyle({
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#000000',
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
                        this.numberImages[i].setFrame(1);;
                        this.selected_index = i;
                        this.checkResult();
                    }
                    else if(this.selected_operator == 2)
                    {
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) - Number.parseInt(this.numberTexts[i].text));
                        this.numberImages[this.selected_index].setAlpha(0.5).setFrame(0);
                        this.numberImages[i].setFrame(1);;
                        this.selected_index = i;
                        this.checkResult();
                    }
                    else if(this.selected_operator == 3)
                    {
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) * Number.parseInt(this.numberTexts[i].text));
                        this.numberImages[this.selected_index].setAlpha(0.5).setFrame(0);
                        this.numberImages[i].setFrame(1);;
                        this.selected_index = i;
                        this.checkResult();
                    }
                    else if(this.selected_operator == 4)
                    {
                        let remainder = Number.parseInt(this.numberTexts[this.selected_index].text) % Number.parseInt(this.numberTexts[i].text);
                        if(remainder != 0)
                            return;
                        this.numberTexts[i].setText(Number.parseInt(this.numberTexts[this.selected_index].text) / Number.parseInt(this.numberTexts[i].text));
                        this.numberImages[this.selected_index].setAlpha(0.5).setFrame(0);
                        this.numberImages[i].setFrame(1);
                        this.selected_index = i;
                        this.checkResult();
                    }
                }
            });
        }

        this.plusOperator = this.add.image(60,400,'Plus', 0).setScale(0.3);
        this.plusOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 1)
            {
                this.selected_operator = -1;
                this.plusOperator.setFrame(0);
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 1;
                this.plusOperator.setFrame(1);
            }
        });

        this.minusOperator = this.add.image(120,400,'Minus', 0).setScale(0.3);
        this.minusOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 2)
            {
                this.selected_operator = -1;
                this.minusOperator.setFrame(0);
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 2;
                this.minusOperator.setFrame(1);
            }
        });

        this.multiOperator = this.add.image(180,400,'Multi', 0).setScale(0.3);
        this.multiOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 3)
            {
                this.selected_operator = -1;
                this.multiOperator.setFrame(0);
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 3;
                this.multiOperator.setFrame(1);
            }
        });

        this.diviOperator = this.add.image(240,400, 'Divi', 0).setScale(0.3);
        this.diviOperator.setInteractive().on('pointerdown', () => {
            if(this.selected_operator == 4)
            {
                this.selected_operator = -1;
                this.diviOperator.setFrame(0);
            }
            else
            {
                this.refreshOperators();
                this.selected_operator = 4;
                this.diviOperator.setFrame(1);
            }
        });

        this.refreshButton = this.add.image(150,500,'Refresh').setScale(0.3);
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

    checkResult(){
        if(this.numberTexts[this.selected_index].text == this.targetNumber.text)
        {
            this.timer.remove();
            this.time.removeEvent(this.timer);
            game.scene.stop('NumberGameScreen');
            game.scene.start('WordGameScreen');
        }
    }
    updateTimer(scene){
        let current_time = Number.parseInt(scene.timeText.text) - 1;
        if(current_time < 0)
        {
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            game.scene.stop('NumberGameScreen');
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
            this.numberImages[i].setAlpha(1.0);
            this.numberImages[i].setFrame(0);
        }
    }

    refreshOperators(){
        this.selected_operator = -1;
        this.plusOperator.setFrame(0);
        this.minusOperator.setFrame(0);
        this.multiOperator.setFrame(0);
        this.diviOperator.setFrame(0);
    }
}
