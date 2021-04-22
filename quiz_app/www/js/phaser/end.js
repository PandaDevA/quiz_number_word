/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: "EndScreen"});
    }

    preload() {
        if(cur_word == gameData.wordData.length)
            this.bEnd = true;
        else
            this.bEnd = false;
        if(game_state == "failed"){
            this.load.image("Lose", "./images/lose.png");
            this.load.image("MainPage", "./images/main_page.png");
            this.load.image("PlayAgain", "./images/play_again.png");
        } else if(game_state == "pass"){
            if(!this.bEnd){
                this.load.image("Win", "./images/win.png");
                this.load.image("Orange", "./images/orange_back.png");
            }
            else{
                this.load.image("Win", "./images/win.png");
                this.load.image("Orange", "./images/orange_back.png");
                this.load.image("MainPage", "./images/main_page.png");
                this.load.image("NextStage", "./images/next_stage.png");
                this.load.image("PointAds", "./images/win_earn_point_ads.png");
                this.load.image("CoinAds", "./images/win_earn_coin_ads.png");
            }
        }
    }

    create() {
        if(game_state == "failed"){
            this.lose = this.add.image(540,480,'Lose');
            this.main_page = this.add.image(540,1140,'MainPage');
            this.main_page.setInteractive().on('pointerdown', () => {
                game.scene.stop('EndScreen');
                game.scene.start('HomeScreen');
            });
    
            if(game_type == "stage")
            {
                this.play_again = this.add.image(540,1320,'PlayAgain');
                this.play_again.setInteractive().on('pointerdown', () => {
                    Client.stage_start();
                });
            }

            if(game_type == "stage")
            {
                this.lostText = this.add.text(540, 850, 'YOU CAN"T PASS\nTHE STAGE', { fixedWidth: 700, fixedHeight: 200, align:'center' })
                .setStyle({
                    fontSize: '80px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);
            }
            else{
                this.lostText = this.add.text(540, 850, 'YOU LOSE!\n\nTRY TOMORROW AGAIN!', { fixedWidth: 700, fixedHeight: 300, align:'center' })
                .setStyle({
                    fontSize: '80px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);
            }
        } else if(game_state == "pass"){
            if(!this.bEnd){
                if(game_type == "stage" || game_type == "daily")
                {
                    this.win = this.add.image(540,480,'Win');
                    this.earnedPointText = this.add.text(420, 840, 'YOU\nEARNED\nPOINT', { fixedWidth: 150, fixedHeight: 120, align:'center' })
                    .setStyle({
                        fontSize: '36px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    this.pointBack = this.add.image(590,840,'Orange');
                    this.pointText = this.add.text(590,840, cur_point, { fixedWidth: 160, fixedHeight: 60, align:'center' })
                    .setStyle({
                        fontSize: '60px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                }
                else if(game_type == "battle")
                {
                    this.user1name = this.add.text(540, 400, winner_name_list[0], { fixedWidth: 700, fixedHeight: 100, align:'center' })
                    .setStyle({
                        fontSize: '80px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    this.point1Back = this.add.image(540,570,'Orange');
                    this.point1Text = this.add.text(540,570, winner_point_list[0], { fixedWidth: 160, fixedHeight: 60, align:'center' })
                    .setStyle({
                        fontSize: '60px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);



                    this.user2name = this.add.text(540, 700, winner_name_list[1], { fixedWidth: 700, fixedHeight: 100, align:'center' })
                    .setStyle({
                        fontSize: '80px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    this.point2Back = this.add.image(540,870,'Orange');
                    this.point2Text = this.add.text(540,870, winner_point_list[1], { fixedWidth: 160, fixedHeight: 60, align:'center' })
                    .setStyle({
                        fontSize: '60px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                }
    
                this.graphics = this.add.graphics();
                // this.graphics.lineStyle(4, '#ffffff', 1);
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRoundedRect(100,1050,880,490, 10);
                this.gameStartText = this.add.text(540,1130, 'NEXT PART WILL START', { fixedWidth: 780, fixedHeight: 60, align:'center' })
                .setStyle({
                    fontSize: '60px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#106ead',
                })
                .setOrigin(0.5,0.5);
                this.graphics.fillStyle(0xfa5c00, 1);
                this.graphics.fillRoundedRect(410,1200,260,260, 10);
                this.timeText = this.add.text(540,1330, '5', { fixedWidth: 170, fixedHeight: 170, align:'center' })
                .setStyle({
                    fontSize: '160px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);
    
                this.timer = this.time.addEvent({
                    delay: 1000,
                    callback: this.updateTimer,
                    args: [this],
                    loop: true
                });
            } else {
                if(game_type == "stage" || game_type == "daily")
                {
                    this.win = this.add.image(540,400,'Win');
                    this.gameFinishText = this.add.text(540,700, 'YOU FINISHED STAGE!', { fixedWidth: 700, fixedHeight: 50, align:'center' })
                    .setStyle({
                        fontSize: '50px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                }
                else{
                    let bWin = winner_name_list[0] == userData.userName;
                    this.gameFinishText = this.add.text(540,700, bWin ? 'YOU WIN!' : 'YOU LOSE!', { fixedWidth: 700, fixedHeight: 120, align:'center' })
                    .setStyle({
                        fontSize: '120px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    this.yourPointText = this.add.text(370,280, 'YOU', { fixedWidth: 700, fixedHeight: 120, align:'center' })
                    .setStyle({
                        fontSize: '120px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    this.yourPointBack = this.add.image(370,400,'Orange');
                    this.yourPointText = this.add.text(370,400, bWin? winner_point_list[0] : winner_point_list[1], { fixedWidth: 160, fixedHeight: 110, align:'center' })
                    .setStyle({
                        fontSize: '110px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    this.oppoPointText = this.add.text(710,280, 'OPP', { fixedWidth: 700, fixedHeight: 120, align:'center' })
                    .setStyle({
                        fontSize: '120px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    this.oppoPointBack = this.add.image(710,400,'Orange');
                    this.oppoPointText = this.add.text(710,400, bWin? winner_point_list[1] : winner_point_list[0], { fixedWidth: 160, fixedHeight: 110, align:'center' })
                    .setStyle({
                        fontSize: '110px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                }
                this.pointAds = this.add.image(540,890,'PointAds');
                this.pointAds.setInteractive().on('pointerdown', () => {
                    console.log('Point Interstitial');
                    // AdMob.showInterstitial();
                    // AdMob.prepareInterstitial({
                    //     adId: admobid.interstitial,
                    //     autoShow:false,
                    //     isTesting: true,
                    // });
                
                });
        
                this.pointText = this.add.text(410,890, cur_point, { fixedWidth: 160, fixedHeight: 60, align:'center' })
                .setStyle({
                    fontSize: '60px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);

                let getText1 = '';
                let getText2 = 'GET ×2';
                let coinText = 1;
                if( game_type == 'stage' ){
                    getText1 = 'GET ×3';
                }
                else if( game_type == 'daily'){
                    getText1 = 'GET ×8';
                    coinText = 3;
                }
                else if( game_type == 'battle'){
                    coinText = 3;
                    if(winner_name_list[0] == userData.userName)
                        getText1 = 'GET ×5';
                    else
                    {
                        getText1 = 'GET\nBACK';
                        getText2 = 'GET\nBACK';
                    }
                }

                this.getPointText = this.add.text(800,890, getText1, { fixedWidth: 150, fixedHeight: 45, align:'center' })
                .setStyle({
                    fontSize: '45px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#fa5c00',
                })
                .setOrigin(0.5,0.5);
    
                this.coinAds = this.add.image(540,1080,'CoinAds');
                this.coinAds.setInteractive().on('pointerdown', () => {
                    console.log('Coin Interstitial');
                    // AdMob.showInterstitial();
                    // AdMob.prepareInterstitial({
                    //     adId: admobid.interstitial,
                    //     autoShow:false,
                    //     isTesting: true,
                    // });
                });
    
                this.coinText = this.add.text(410,1080, coinText, { fixedWidth: 160, fixedHeight: 60, align:'center' })
                .setStyle({
                    fontSize: '60px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);
                this.getCoinText = this.add.text(800,1080, getText2, { fixedWidth: 150, fixedHeight: 45, align:'center' })
                .setStyle({
                    fontSize: '45px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#fa5c00',
                })
                .setOrigin(0.5,0.5);
    
                this.main_page = this.add.image(540,1310,'MainPage');
                this.main_page.setInteractive().on('pointerdown', () => {
                    game.scene.stop('EndScreen');
                    game.scene.start('HomeScreen');
                });
        
                if(game_type == "stage")
                {
                    this.next_stage = this.add.image(540,1495,'NextStage');
                    this.next_stage.setInteractive().on('pointerdown', () => {
                        Client.stage_start();
                    });
                }
            }
        }
    }
    update(){
    }

    updateTimer(scene){
        let current_time = Number.parseInt(scene.timeText.text) - 1;
        if(current_time < 0)
        {
            if(game_state == "pass")
            {
                scene.timer.remove();
                scene.time.removeEvent(scene.timer);
                game.scene.stop('EndScreen');
                game.scene.start('WordGameScreen');
            }
        }
        else{
            scene.timeText.setText(current_time);
        }
    }

    updateResult(){
    }
}
