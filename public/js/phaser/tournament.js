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
    }

    create() {
        this.tournament = this.add.text(150, 50, 'Tournament', { fixedHeight: 32 })
        .setStyle({
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#fdb63a',
        }).setOrigin(0.5,0);

        this.user_list = this.rexUI.add.scrollablePanel({
            x: 150,
            y: 400,
            width: 200,
            height: 150,

            scrollMode: 0,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x4e342e),

            panel: {
                child: this.rexUI.add.fixWidthSizer({
                    space: {
                        left: 3,
                        right: 3,
                        top: 3,
                        bottom: 3,
                        item: 8,
                        line: 8,
                    }
                }),

                mask: {
                    padding: 1
                },
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x260e04),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x7b5e57),
                input: 'drag',
                position: 0,
            },

            scroller:{
                threshold: 0,
            },

            clamplChildOY : true,

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
            }
        });

        var sizer = this.user_list.getElement('panel');
        sizer.clear(true);

        for(let i=0; i<tournamentData.length; i++){
            sizer.add( this.add.text(0, 0, tournamentData[i].userName + ":" + tournamentData[i].point, { fontSize: 18 }));
        }
        this.user_list.layout();
        this.user_list.setSliderEnable(true);
        this.user_list.setScrollerEnable(true);
        game.domContainer.style.display = 'none'
    }
    update(){
    }

    add_user(added_user){
        var sizer = this.user_list.getElement('panel');
        sizer.add( this.add.text(0, 0, added_user.userName + ":" + added_user.point, { fontSize: 18 }));
        this.user_list.layout();
    }
}
