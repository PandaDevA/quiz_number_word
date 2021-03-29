/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class ListScreen extends Phaser.Scene{

    constructor(){
        super({key: "ListScreen"});
        this.roomList = [];
    }

    preload() {
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });

        // this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
    }

    create() {
        // this.userName = this.add.text(100, 100, 'testuser', { fixedWidth: 150, fixedHeight: 36 });
        // this.password = this.add.text(100, 200, '123', { fixedWidth: 150, fixedHeight: 36 });
    
        // this.userName.setInteractive().on('pointerdown', () => {
        //     this.rexUI.edit(this.userName)
        // });

        // this.password.setInteractive().on('pointerdown', () => {
        //     this.rexUI.edit(this.password)
        // });

        this.roomcreateButton = this.add.text(100, 100, 'Create Room');
        this.roomcreateButton.setInteractive().on('pointerdown', () => {
            Client.create_room();
        });
    }
    
    update(){
        
    }

    add_item(roomData){
        this.roomList.push(this.add.text(100, 100 + (this.roomList.length+1)*50, roomData.userName));
        this.roomList[this.roomList.length-1].setInteractive().on('pointerdown', () => {
            Client.join_room(roomData.id);
        });
    }
}
