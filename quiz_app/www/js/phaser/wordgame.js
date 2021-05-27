/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class WordGameScreen extends Phaser.Scene{
    constructor(){
        super({key: "WordGameScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        this.action_audio = this.sound.add('action');
        this.start_audio = this.sound.add('start');
        if(sound_enable)
            this.start_audio.play();
        this.lose_audio = this.sound.add('lose');
        this.success_audio = this.sound.add('success');

        this.point = undefined;
        this.logo = this.add.image(540,120,'Logo');

        this.outline = this.add.image(540,840,'Outline');

        this.timeImage = this.add.image(540,350,'Time');
        this.timeText = this.add.text(540,390, '60', { fixedWidth: 350, fixedHeight: 110 })
        .setOrigin(0.5,0.5)
        .setStyle({
            fontSize: '78px',
            fontFamily: 'RR',
            color: '#ffffff',
            align: 'center',
        });
        let curTime = new Date();
        this.timeStamp = curTime.getTime();

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

        for (let i=0; i<mix_word.length; i++)
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
                if(sound_enable)
                    this.action_audio.play();
                if(this.characterImages[i].alpha == 0.5)
                    return;
                this.result = this.result + this.characterTexts[i].text;
                this.resultTexts[this.result.length-1].setText(this.characterTexts[i].text);
                this.characterImages[i].setAlpha(0.5);
            });
        }

        this.refreshButton = this.add.image(640,1380,'Refresh', 1);
        this.refreshButton.setInteractive().on('pointerdown', () => {
            if(sound_enable)
                this.action_audio.play();
            this.result = '';
            for (var i=0; i<this.resultTexts.length; i++)
                this.resultTexts[i].setText('');
            for (var i=0; i<this.characterImages.length; i++)
                this.characterImages[i].setAlpha(1);
            });

        this.checkButton = this.add.image(440,1380,'Check', 1);
        this.checkButton.setInteractive().on('pointerdown', () => {
            if(sound_enable)
                this.action_audio.play();
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
        if(this.result == '')
        {
            if(sound_enable)
                this.lose_audio.play();
            toast_error(this, 'You must find a word\nwith at least 5 letters\nto pass stage!');
            return;
        }
        let match_index = gameData.wordData[cur_word].matchArray.indexOf(this.result);
        this.point = 0;
        if(match_index != -1)
        {
            bPass = true;
            let word_length = gameData.wordData[cur_word].matchArray[match_index].length;
            if(word_length == 8){
                this.point = 10 + Math.floor(Number.parseInt(this.timeText.text)/10);
            }
            else if(word_length == 7){
                this.point = 8;
            }
            else if(word_length == 6){
                this.point = 6;
            }
            else if(word_length == 5){
                this.point = 4;
            }
        } else{
            if(sound_enable)
                this.lose_audio.play();
            if(this.result.length >=5)
                toast_error(this, 'There is no Word on\ndictionary as you write!');
            else 
                toast_error(this, 'You must find a word\nwith at least 5 letters\nto pass stage!');
            return;
        }
        
        if(!bPass && (game_type == "stage" || game_type == "daily"))
            game_state = "failed";
        else
            game_state = "pass";

        if(sound_enable)
            this.success_audio.play();

        if(game_type == "stage" || game_type == "daily")
        {
            this.timer.remove();
            this.time.removeEvent(this.timer);
            if(game_type == "stage")
                cur_point += this.point;
            else
                cur_point = cur_point>=10?1:0 + this.point>=10?1:0 + 1;
            if(game_type == "stage"){
                if(bPass)
                    Client.stage_end();
            }
            else if(game_type == "daily"){
                if(bPass)
                    Client.daily_end();
            }
            cur_word++;
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
        }
        else if(game_type == "battle" || game_type == "tournament")
        {
            Client.online_end(this.point);
            if(this.point >= 10)
            {
                this.convertToWaitng();
            }
        }
    }

    convertToWaitng(){
        this.checkButton.setVisible(false);
        this.refreshButton.setVisible(false);
        for(let i=0; i<this.characterImages.length; i++){
            this.characterImages[i].disableInteractive().setAlpha(0.5);
        }
        this.waitingText = this.add.text(540, 1380, 'Waiting for server...', { fixedWidth: 700, fixedHeight: 120, align:'center' })
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);
    }

    updateTimer(scene){
        let curTime = new Date();
        let current_time = 60 - Number.parseInt((curTime.getTime() - scene.timeStamp)/1000);
        if(current_time < 0)
        {
            scene.timer.remove();
            scene.time.removeEvent(scene.timer);
            if(sound_enable)
                scene.lose_audio.play();
            scene.timeText.setText('0');
            if(game_type == "stage" || game_type == "daily")
                game_state = "failed";
            else
                game_state = "pass";

            if(game_type == "stage" || game_type == "daily")
            {
                cur_point += scene.point;
                // if(game_type == "stage"){
                //     Client.stage_end(false);
                // }
                // else if(game_type == "daily"){
                //     Client.daily_end(false);
                // }
                cur_word++;
                game.scene.stop('WordGameScreen');
                game.scene.start('EndScreen');
            }
            else if(game_type == "battle" || game_type == "tournament")
            {
                if(scene.point == undefined)
                {
                    scene.point = 0;
                }
                if(scene.point == 0)
                    Client.online_end(scene.point);
                scene.convertToWaitng();
            }
        }
        else{
            scene.timeText.setText(current_time);
        }
    }
}
