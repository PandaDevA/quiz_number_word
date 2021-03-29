/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class RoomScreen extends Phaser.Scene{
    constructor(){
        super({key: "RoomScreen"});
        this.userList = [];
        this.stateList = [];
    }

    preload() {
    }

    create() {
        this.userName = this.add.text(50, 100, userData.username, { fixedWidth: 100, fixedHeight: 36 });
        
        if(userData.username == roomData.userName)
        {
            this.startButton = this.add.text(150, 100, 'start');
            this.startButton.setInteractive().on('pointerdown', () => {
                Client.start();
            });
        }
        else{
            this.readyButton = this.add.text(150, 100, 'ready');
            this.readyButton.setInteractive().on('pointerdown', () => {
                Client.ready();
            });
        }

        var plus=0;
        if(userData.username != roomData.userName)
        {
            plus=1;
            this.userList.push(this.add.text(50, 150, roomData.userName, { fixedWidth: 100, fixedHeight: 36 }));
            this.stateList.push(this.add.text(150, 150, 'Creator', { fixedWidth: 100, fixedHeight: 36 }));
        }
        for(let i = 0; i<roomData.joinUsers.length; i++)
        {
            this.userList.push(this.add.text(50, 100 + (i+1+plus)*50, roomData.joinUsers[i].username, { fixedWidth: 100, fixedHeight: 36 }));
            this.stateList.push(this.add.text(150, 100 + (i+1+plus)*50, roomData.joinUsers[i].isReady?'Ready' : 'unReady', { fixedWidth: 100, fixedHeight: 36 }));
        }
    }
    update(){
    }
}
