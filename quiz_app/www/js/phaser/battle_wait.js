/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class BattleWaitScreen extends Phaser.Scene{
    constructor(){
        super({key: "BattleWaitScreen"});
    } 

    preload() {
        this.load.image("Cancel", "./images/cancel.png");
        this.load.image("UserName", "./images/username.png");
        this.load.image("EmptyUser", "./images/avatar_empty.png");
    }

    create() {
        if(userData.avatar == ""){
            this.userAvatar = this.add.image(540,400,'UserAvatar');   
        }
        else{
            this.userAvatar = this.add.image(540,400,'user_avatar');
            this.userAvatar.setDisplaySize(390,398);
            this.userAvatar_cover = this.add.image(540,400,'avatar_cover').setDepth(5);
        }
        this.userNameBack = this.add.image(540,660,'UserName');
        this.userName = this.add.text(540, 660, userData.userName, {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            aligh: "center"
        }).setOrigin(0.5, 0.5);

        this.vs = this.add.text(540, 790, 'VS', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '120px',
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5, 0.5);

        this.oppoAvatar = this.add.image(540,1080,'EmptyUser');   
        this.oppoWaiting = this.add.text(540, 1080, 'WAITING\nOPPONENT', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            align: "center"
        }).setOrigin(0.5, 0.5);

        this.oppoNameBack = this.add.image(540,1340,'UserName');
        this.oppoName = this.add.text(540, 660, '', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            align: "center"
        }).setOrigin(0.5, 0.5);

        this.cancelButton = this.add.image(540,1550,'Cancel');
        this.cancelButton.setInteractive().on('pointerdown', () => {
            Client.invite_cancel();
            game.scene.stop('BattleWaitScreen');
            game.scene.start('BattleScreen');
        });

        // this.BackButton = this.add.image(50,50,'Back').setScale(0.2);
        // this.BackButton.setInteractive().on('pointerdown', () => {
        //     game.scene.stop('BattleScreen');
        //     game.scene.start('HomeScreen');
        // });

        // this.invite_battle = this.add.text(150, 100, 'Invite Battle', { fixedHeight: 32 })
        // .setStyle({
        //     fontSize: '32px',
        //     fontFamily: 'Arial',
        //     color: '#fdb63a',
        // }).setOrigin(0.5,0);

        // this.userNameImage = this.add.image(150,200,'UserName').setScale(0.3);
        // this.userName = this.add.text(155, 200, 'testuser', { fixedWidth: 100, fixedHeight: 18 })
        // .setStyle({
        //     fontSize: '18px',
        //     fontFamily: 'Arial',
        //     color: '#000000',
        // })
        // .setOrigin(0,0.5);
        // this.userName.setInteractive().on('pointerdown', () => {
        //     this.rexUI.edit(this.userName)
        // });

        // this.inviteButton = this.add.image(100,280,'Invite', 0).setScale(0.2);
        // this.inviteButton.setInteractive().on('pointerdown', () => {
        //     Client.invite_request(this.userName.text);
        //     this.BackButton.disableInteractive();
        //     this.BackButton.setAlpha(0.5);
        //     this.randomButton.disableInteractive();
        //     this.randomButton.setAlpha(0.5);
        //     this.inviteButton.disableInteractive();
        //     this.inviteButton.setAlpha(0.5);
        //     this.invite_cancel_Button.setInteractive();
        //     this.invite_cancel_Button.setAlpha(1.0);
        // });

        // this.invite_cancel_Button = this.add.image(200,280,'Cancel', 0).setScale(0.2);
        // this.invite_cancel_Button.on('pointerdown', () => {
        //     Client.invite_cancel();
        //     this.invite_request_failed();
        // });
        // this.invite_cancel_Button.disableInteractive();
        // this.invite_cancel_Button.setAlpha(0.5);


        // this.random_battle = this.add.text(150, 350, 'Random Battle', { fixedHeight: 32 })
        // .setStyle({
        //     fontSize: '32px',
        //     fontFamily: 'Arial',
        //     color: '#fdb63a',
        // }).setOrigin(0.5,0);

        // this.randomButton = this.add.image(100,450,'Random').setScale(0.2);
        // this.randomButton.setInteractive().on('pointerdown', () => {
        //     Client.random_request();
        // });

        // this.random_cancel_Button = this.add.image(200,450,'Cancel', 0).setScale(0.2);
        // this.random_cancel_Button.disableInteractive();
        // this.random_cancel_Button.setAlpha(0.5);
    }
    update(){
    }

    // invite_request(){
    //     this.userName.setText(invite_name);
    //     this.inviteButton.setFrame(1);
    //     this.inviteButton.setInteractive().on('pointerdown', () => {
    //         Client.invite_accept();
    //     });
    //     this.invite_cancel_Button.setFrame(1);
    //     this.invite_cancel_Button.setInteractive().on('pointerdown', () => {
    //         Client.invite_reject();
    //         this.invite_request_failed();
    //     });
    //     this.BackButton.disableInteractive();
    //     this.BackButton.setAlpha(0.5);
    //     this.randomButton.disableInteractive();
    //     this.randomButton.setAlpha(0.5);
    //     this.inviteButton.setInteractive();
    //     this.inviteButton.setAlpha(1.0);
    //     this.invite_cancel_Button.setInteractive();
    //     this.invite_cancel_Button.setAlpha(1.0);
    //     toast_inviting();
    // }
    // random_request(){
    //     this.randomButton.disableInteractive();
    //     this.random_cancel_Button.setInteractive().on('pointerdown', () => {
    //         Client.random_cancel();
    //         this.BackButton.setInteractive();
    //         this.BackButton.setAlpha(1.0);
    //         this.randomButton.setInteractive();
    //         this.randomButton.setAlpha(1.0);
    //         this.inviteButton.setInteractive();
    //         this.inviteButton.setAlpha(1.0);
    //         this.random_cancel_Button.disableInteractive();
    //         this.random_cancel_Button.setAlpha(0.5);
    //     });

    //     this.BackButton.disableInteractive();
    //     this.BackButton.setAlpha(0.5);
    //     this.randomButton.disableInteractive();
    //     this.randomButton.setAlpha(0.5);
    //     this.inviteButton.disableInteractive();
    //     this.inviteButton.setAlpha(0.5);
    //     this.random_cancel_Button.setInteractive();
    //     this.random_cancel_Button.setAlpha(1.0);
    // }

    // toast_inviting(){
    //     var toast = this.rexUI.add.toast({
    //         x: 150,
    //         y: 550,

    //         background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xcc4040),
    //         text: this.add.text(0, 0, '', {
    //             fontSize: '18px'
    //         }),
    //         space: {
    //             left: 20,
    //             right: 20,
    //             top: 20,
    //             bottom: 20,
    //         },

    //         duration: {
    //             in: 250,
    //             hold: 1000,
    //             out: 250,
    //         },
    //     })
    //     .show(invite_name + ' is inviting you...')
    // }
}
