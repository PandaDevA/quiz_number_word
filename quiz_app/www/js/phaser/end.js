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

        if((gameData.wordData != undefined && cur_word == gameData.wordData.length) || game_type == "passion" || game_state == "remain_alone")
            this.bEnd = true;
        else
            this.bEnd = false;

        if(this.bEnd && game_type == "battle"){
            cur_point = 100;
        } else if(this.bEnd && game_type == "tournament"){
            cur_point = 1000;
        }
    }

    create() {
        this.button_audio = this.sound.add('button');
        if(game_state == "failed"){
            this.lose = this.add.image(540,480,'Lose');
            this.main_page = this.add.image(540,1140,'MainPage');
            this.main_page.setInteractive().on('pointerdown', () => {
                if(sound_enable)
                    this.button_audio.play();
                game.scene.stop('EndScreen');
                game.scene.start('HomeScreen');
            });
    
            if(game_type == "stage")
            {
                this.play_again = this.add.image(540,1320,'PlayAgain');
                this.play_again.setInteractive().on('pointerdown', () => {
                    if(sound_enable)
                        this.button_audio.play();
                    Client.stage_start();
                });
            }

            if(game_type == "stage")
            {
                this.lostText = this.add.text(540, 850, 'ETABI\nGEÇEMEDİNİZ', { fixedWidth: 700, fixedHeight: 200, align:'center' })
                .setStyle({
                    fontSize: '80px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                })
                .setOrigin(0.5,0.5);
            }
            else{ 
                this.lostText = this.add.text(540, 850, 'KAYBETTİN!', { fixedWidth: 700, align:'center' })
                .setStyle({
                    fontSize: '80px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    align: 'center'
                })
                .setOrigin(0.5,0.5);
            }
        } else if(game_state == "pass" || game_state == "remain_alone"){
            if(!this.bEnd){
                if(game_type == "stage" || game_type == "daily")
                {
                    this.win = this.add.image(540,480,'Win');
                    if(game_type == "stage"){
                        this.earnedPointText = this.add.text(380, 860, 'Kazandığınız\npuan', { fixedHeight: 120, align:'center' })
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
                    } else {
                        this.earnedPointText = this.add.text(540, 860, 'You have passed', { align:'center' })
                        .setStyle({
                            fontSize: '50px',
                            fontFamily: 'RR',
                            fontWeight: 'bold',
                            color: '#ffffff',
                        })
                        .setOrigin(0.5,0.5);
                    }
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
                    this.point1Back = this.add.image(540,520,'Orange');
                    this.point1Text = this.add.text(540,520, winner_point_list[0], { fixedWidth: 160, fixedHeight: 60, align:'center' })
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
                    this.point2Back = this.add.image(540,820,'Orange');
                    this.point2Text = this.add.text(540,820, winner_point_list[1], { fixedWidth: 160, fixedHeight: 60, align:'center' })
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
                this.gameStartText = this.add.text(540,1130, 'Sonraki bölüm geliyor', { fixedWidth: 780, align:'center' })
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
                        showText = 'Etabı bitirdiniz';
                    else if(game_type == "daily")
                        showText = 'Tebrikler oyunu bitirdiniz';
                    else if(game_type == "passion")
                        showText = 'Kazandığınız jeton';
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
                    if(game_state != 'remain_alone'){
                        let bWin = winner_name_list[0] == userData.userName;
                        this.gameFinishText = this.add.text(540,game_type == "battle" ? 700 : 890, bWin ? 'KAZANDIN!' : 'KAYBETTİN!', { fixedWidth: 700, fixedHeight: 120, align:'center' })
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
                    } else {
                        this.gameFinishText = this.add.text(540, 500, game_type == 'battle' ? 'Opponent quit\ngame and\nyou have win.' : 'Everybody quit\ngame and\nyou have win.', { fixedWidth: 700, fixedHeight: 300, align:'center' })
                        .setStyle({
                            fontSize: '80px',
                            fontFamily: 'RR',
                            fontWeight: 'bold',
                            color: '#ffffff',
                        })
                        .setOrigin(0.5,0.5);
                    }
                }
                
                let getText = 'GET ×2';
                let coinText = cur_point;
                let adsPos = 1015;
                if( game_type == 'stage' ){
                    getText = 'GET ×3';
                }
                else if( game_type == 'daily'){
                    getText = 'GET ×4';
                }
                else if( game_type == 'battle'){
                    if(game_state == 'remain_alone' || winner_name_list[0] == userData.userName)
                        getText = 'GET ×5';
                    else
                        getText = 'GET\nBACK';
                } else if (game_type == "tournament"){
                    adsPos = 1080;
                    if(game_state == 'remain_alone' || winner_name_list[0] != userData.userName){
                        getText = 'GET\nBACK';
                    }
                } else if (game_type == "passion") {
                    coinText = cur_prize;
                    if(cur_prize == 0)
                        getText2 = 'GET\n1 COIN';
                }

                if(game_type != "passion" && game_type != "daily"){
                    this.pointAds = this.add.image(540,adsPos,'PointAds');
                    this.pointAds.setInteractive().on('pointerdown', () => {
                        if(sound_enable)
                            this.button_audio.play();
                        console.log('Point Interstitial');
                        AdMob.showInterstitial();
                        AdMob.prepareInterstitial({
                            adId: admobid.interstitial,
                            autoShow:false,
                            isTesting: true,
                        });
                        this.pointAds.destroy();
                        this.pointText.destroy();
                        this.getPointText.destroy();
                        let multiplier = 1;
                        if( game_type == 'stage' ){
                            multiplier = 2;
                        }
                        else if( game_type == 'daily'){
                            multiplier = 5;
                        }
                        else if( game_type == 'battle'){
                            multiplier = 4;
                        }        
                        Client.prize(0, coinText * multiplier, 0);
                    });
            
                    this.pointText = this.add.text(400,adsPos, coinText, { fixedWidth: 160, fixedHeight: 60, align:'center' })
                    .setStyle({
                        fontSize: '60px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
    
                    this.getPointText = this.add.text(800,adsPos, getText)
                    .setStyle({
                        fontSize: '45px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#fa5c00',
                        align: 'center'
                    })
                    .setOrigin(0.5,0.5);
                }
    

                if(game_type == "daily")
                {
                    this.coinAds = this.add.image(540,adsPos,'CoinAds');
                    this.coinAds.setInteractive().on('pointerdown', () => {
                        if(sound_enable)
                            this.button_audio.play();
                        console.log('Coin Interstitial');
                        AdMob.showInterstitial();
                        AdMob.prepareInterstitial({
                            adId: admobid.interstitial,
                            autoShow:false,
                            isTesting: true,
                        });
                        this.coinAds.destroy();
                        this.coinText.destroy();
                        this.getCoinText.destroy();
                        multiplier = 3;
                        Client.prize(0, 0, coinText * multiplier);
                    });
        
                    this.coinText = this.add.text(400,adsPos, coinText, { fixedWidth: 160, fixedHeight: 60, align:'center' })
                    .setStyle({
                        fontSize: '60px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    })
                    .setOrigin(0.5,0.5);
                    this.getCoinText = this.add.text(800,adsPos, getText)
                    .setStyle({
                        fontSize: '45px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        color: '#fa5c00',
                        align: 'center'
                    })
                    .setOrigin(0.5,0.5);
                }
                this.main_page = this.add.image(540,1310,'MainPage');
                this.main_page.setInteractive().on('pointerdown', () => {
                    if(sound_enable)
                        this.button_audio.play();
                    game.scene.stop('EndScreen');
                    game.scene.start('HomeScreen');
                });
        
                if(game_type == "stage")
                {
                    this.next_stage = this.add.image(540,1495,'NextStage');
                    this.next_stage.setInteractive().on('pointerdown', () => {
                        if(sound_enable)
                            this.button_audio.play();
                        Client.stage_start();
                    });
                }
            }
        }

        if(game_type == "tournament" && game_state != 'remain_alone'){
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
