/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class TournamentScreen extends Phaser.Scene{
    constructor(){
        super({key: "TournamentScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.image("MainPage", "./images/main_page.png");
        this.load.image("TournamentDetailOrange", "./images/tournament_detail_orange_back.png");
        this.load.image("TournamentDetailBlack", "./images/tournament_detail_black_back.png");
        this.load.image("Join", "./images/join.png");
        this.load.image("Cancel", "./images/cancel.png");
    }

    create() {
        this.main_page = this.add.image(540,1500,'MainPage');
        this.main_page.setInteractive().on('pointerdown', () => {
            game.scene.stop('TournamentScreen');
            game.scene.start('HomeScreen');
        });

        this.back_list = [];
        this.info_list = [];
        this.button_list = [];
        this.room_id_list = [];

        this.updateRoom();
    }

    updateRoom(){
        for(let i=0; i<this.back_list.length; i++)
        {
            this.back_list[i].destroy();
        }
        for(let i=0; i<this.info_list.length; i++)
        {
            this.info_list[i].destroy();
        }
        for(let i=0; i<this.button_list.length; i++)
        {
            this.button_list[i].destroy();
        }

        this.back_list = [];
        this.info_list = [];
        this.button_list = [];
        this.room_id_list = [];

        var isJoined = function(joinList){
            for(let i=0; i<joinList.length; i++){
                if(joinList[i].userName == userData.userName)
                    return true;
            }
            return false;
        }
        for(let i=0; i<tournament_list.length; i++){
            let bJoin = isJoined(tournament_list[i].joinUsers);
            let time = new Date(tournament_list[i].startDateTime);
            let back = this.add.image(540, 300 + i*400, bJoin ? 'TournamentDetailBlack' : 'TournamentDetailOrange');
            let text = this.add.text(540,320 + i*400, "START TIME: " + getDateTimeString(time) + "\n" + "JOINING FEE: " + tournament_list[i].joiningFee + " COIN\nPRIZE: " + tournament_list[i].prize + " COIN", { fixedWidth: 800, fixedHeight: 200, align:'center' })
            .setStyle({
                fontSize: '48px',
                fontFamily: 'RR',
                fontWeight: 'bold',
                color: '#ffffff',
            })
            .setOrigin(0.5,0.5);
            let button = this.add.image(540, 500 + i*400, bJoin? 'Cancel' : 'Join');
            button.setData('isJoin', bJoin);
            button.setInteractive().on('pointerdown', () => {
                if(bJoin)
                    Client.tournament_out(tournament_list[i].id);
                else
                    Client.tournament_in(tournament_list[i].id);
            });
            
            this.room_id_list.push(tournament_list[i].id);
            this.back_list.push(back);
            this.info_list.push(text);
            this.button_list.push(button);
        }
    }
    
    update(){
    }

    updateJoin(roomId, bJoin){
        for(let i=0; i<this.room_id_list.length; i++){
            if(this.room_id_list[i] != roomId)
                continue;
            this.button_list[i].setData('isJoin', bJoin);
            this.button_list[i].removeListener('pointerdown');
            this.button_list[i].on('pointerdown', () => {
                if(bJoin)
                    Client.tournament_out(roomId);
                else
                    Client.tournament_in(roomId);
            });
            if(bJoin){
                this.back_list[i].setTexture('TournamentDetailBlack');
                this.button_list[i].setTexture('Cancel');
                }
            else{
                this.back_list[i].setTexture('TournamentDetailOrange');
                this.button_list[i].setTexture('Join');
            }
        }
    }
}
