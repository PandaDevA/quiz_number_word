/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: "EndScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        if((gameData.wordData != undefined && cur_word == gameData.wordData.length) || game_type == "passion")
            this.bEnd = true;
        else
            this.bEnd = false;
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
                this.lostText = this.add.text(540, 850, 'YOU CAN\'T PASS\nTHE STAGE', { fixedWidth: 700, fixedHeight: 200, align:'center' })
                .setStyle({
                    fontSize: '80px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);
            }
            else{ 
                this.lostText = this.add.text(540, 850, 'YOU LOSE!\n\nTRY TOMORROW\nAGAIN!', { fixedWidth: 700, align:'center' })
                .setStyle({
                    fontSize: '80px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    align: 'center'
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
                if(game_type == "stage" || game_type == "daily" || game_type == "passion")
                {
                    let showText = "";
                    if(game_type == "stage")
                        showText = 'YOU FINISHED STAGE';
                    else if(game_type == "daily")
                        showText = 'YOU FINISHED BONUS GAME';
                    else if(game_type == "passion")
                        showText = 'YOU EARN COIN';
                    this.win = this.add.image(540,400,'Win');
                    this.gameFinishText = this.add.text(540,700, showText, { fixedWidth: 700, fixedHeight: 50, align:'center' })
                    .setStyle({
                        fontSize: '50px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                }
                else if( game_type == "battle" || game_type == "tournament"){
                    let bWin = winner_name_list[0] == userData.userName;
                    this.gameFinishText = this.add.text(540,game_type == "battle" ? 700 : 990, bWin ? 'YOU WIN!' : 'YOU LOSE!', { fixedWidth: 700, fixedHeight: 120, align:'center' })
                    .setStyle({
                        fontSize: '120px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    if( game_type == "battle"){
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
                }
                
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
                } else if (game_type == "tournament"){
                    coinText = gameData.prize;
                    if(winner_name_list[0] != userData.userName){
                        getText2 = 'GET\nBACK';
                    }
                } else if (game_type == "passion") {
                    coinText = cur_prize;
                    if(cur_prize == 0)
                        getText2 = 'GET\n1 COIN';
                }

                if(game_type != "tournament" && game_type != "passion"){
                    this.pointAds = this.add.image(540,890,'PointAds');
                    this.pointAds.setInteractive().on('pointerdown', () => {
                        console.log('Point Interstitial');
                        AdMob.showInterstitial();
                        AdMob.prepareInterstitial({
                            adId: admobid.interstitial,
                            autoShow:false,
                            isTesting: true,
                        });
                    
                    });
            
                    this.pointText = this.add.text(410,890, cur_point, { fixedWidth: 160, fixedHeight: 60, align:'center' })
                    .setStyle({
                        fontSize: '60px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
    
                    this.getPointText = this.add.text(800,890, getText1)
                    .setStyle({
                        fontSize: '45px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#fa5c00',
                        align: 'center'
                    })
                    .setOrigin(0.5,0.5);
                }
    
                this.coinAds = this.add.image(540,game_type == "tournament" ? 1140 : 1080,'CoinAds');
                this.coinAds.setInteractive().on('pointerdown', () => {
                    console.log('Coin Interstitial');
                    AdMob.showInterstitial();
                    AdMob.prepareInterstitial({
                        adId: admobid.interstitial,
                        autoShow:false,
                        isTesting: true,
                    });
                });
    
                this.coinText = this.add.text(410,game_type == "tournament" ? 1140 : 1080, coinText, { fixedWidth: 160, fixedHeight: 60, align:'center' })
                .setStyle({
                    fontSize: '60px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);
                this.getCoinText = this.add.text(800,game_type == "tournament" ? 1140 : 1080, getText2)
                .setStyle({
                    fontSize: '45px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#fa5c00',
                    align: 'center'
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

        if(game_type == "tournament"){
            this.fieldUsernameText = this.add.text(190, 280, 'Username', {
                fontFamily: 'RR',
                fontWeight: 'bold',
                fontSize: '80px',
                color: "#ffffff",
            }).setOrigin(0, 0.5);
            this.fieldPointText = this.add.text(890, 280, 'Point', {
                fontFamily: 'RR',
                fontWeight: 'bold',
                fontSize: '80px',
                color: "#ffffff",
            }).setOrigin(1, 0.5);
            let bInRank = false;
            for(var i=0; i<winner_name_list.length; i++){
                let bEqual = false;
                if(winner_name_list[i] == userData.userName)
                {
                    bEqual = true;
                }
                this.graphics = this.add.graphics();
                this.graphics.fillStyle(bEqual ? 0xfa5c00 : 0xffffff, 1);
                this.graphics.fillRoundedRect(180,334 + 132*i,760,128, 10);
                this.rankNameText = this.add.text(190, 400 + 132*i, winner_name_list[i], {
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    fontSize: '80px',
                    color: bEqual ? "#ffffff" : "#106ead",
                }).setOrigin(0, 0.5);
                this.rankPointText = this.add.text(890, 400 + 132*i, winner_point_list[i], {
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    fontSize: '80px',
                    color: bEqual ? "#ffffff" : "#106ead",
                }).setOrigin(1, 0.5);
                if(bEqual)
                    bInRank = true;
            }
            if(!bInRank){
                this.graphics = this.add.graphics();
                this.graphics.fillStyle(0xfa5c00, 1);
                this.graphics.fillRoundedRect(180,334 + 132*i,760,128, 10);
                this.rankNameText = this.add.text(190, 400 + 132*i, winner_name_list[i], {
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    fontSize: '80px',
                    color: "#106ead",
                }).setOrigin(0, 0.5);
                this.rankPointText = this.add.text(890, 400 + 132*i, winner_point_list[i], {
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    fontSize: '80px',
                    color: "#106ead",
                }).setOrigin(1, 0.5);
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
                if(cur_number == cur_word)
                    game.scene.start('NumberGameScreen');
                else
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
