/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class MethodScreen extends Phaser.Scene{
    constructor(){
        super({key: "MethodScreen"});
    }

    preload() {
        this.load.image("MainPage", "./images/main_page.png");

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });;
    }

    create() {
        this.method = this.rexUI.add.scrollablePanel({
            x: 540,
            y: 800,
            width: 1000,
            height: 1200,

            scrollMode: 0,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 30, 0xffffff),

            panel: {
                child: this.rexUI.add.fixWidthSizer({
                    space: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                        item: 16,
                        line: 16,
                    }
                }),

                mask: {
                    padding: 1
                },
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x106ead),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0xfa5c00),
                input: 'drag',
                position: 0,
            },

            scroller:{
                threshold: 0,
            },

            clamplChildOY : true,

            space: {
                left: 30,
                right: 30,
                top: 30,
                bottom: 30,

                panel: 30,

                header: 10,
            },

            header: this.add.text(0, 0, 'How to Play', { fixedWidth: 1000, fixedHeight: 100 })
            .setStyle({
                fontSize: '64px',
                fontFamily: 'RR',
                fontWeight: 'bold',
                fill: '#000000',
            })
            .setOrigin(0.5,0.5),
            
            expand: {
                header: true,
            },

            align: {
                header: 'center',
            },
        });
        var sizer = this.method.getElement('panel');
        sizer.add(this.add.text(0, 0, method_content, { fixedWidth: 900})
        .setStyle({
            fontSize: '48px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#000000',
            wordWrap: { width: 900}
        }));
        this.method.layout();
        this.method.setSliderEnable(true);
        this.method.setScrollerEnable(true);

        this.mainPage = this.add.image(540,1500,'MainPage');
        this.mainPage.setInteractive().on('pointerdown', () => {
            game.domContainer.style.display = 'block';
            game.scene.stop('MethodScreen');
            game.scene.start('HomeScreen');
        });
        game.domContainer.style.display = 'none';
    }
    
    update(){
    }
    
    updateRanking(my_rank, rank_list){
        if(this.waitingText)
        {
            this.waitingText.destroy();
            this.rank_list = this.rexUI.add.scrollablePanel({
                x: 540,
                y: 1200,
                width: 1000,
                height: 1300,
    
                scrollMode: 0,
    
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x4e342e),
    
                panel: {
                    child: this.rexUI.add.fixWidthSizer({
                        space: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10,
                            item: 16,
                            line: 16,
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
                    left: 30,
                    right: 30,
                    top: 30,
                    bottom: 30,
    
                    panel: 30,

                    header: 10,
                },

                header: this.add.text(0, 0, 'Live Ranking', { fixedWidth: 1000, fixedHeight: 100 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    align: "center",
                    fill: '#fa5c00',
                })
                .setOrigin(0.5,0.5),
                
                expand: {
                    header: true,
                },

                align: {
                    header: 'center',
                },
            });
        }
        var sizer = this.rank_list.getElement('panel');
        sizer.clear(true);

        let bInRanking = false;
        for(let i=0; i<rank_list.length; i++){
            if(rank_list[i].username == userData.username)
            {
                sizer.add(this.add.text(0, 0, (i+1) + '   -   ' + rank_list[i].username + ' : ' + rank_list[i].point, { fixedWidth: 900, fixedHeight: 80 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#1fbae1',
                }));
                bInRanking = true;
            }
            else{
                sizer.add(this.add.text(0, 0, (i+1) + '   -   ' + rank_list[i].username + ' : ' + rank_list[i].point, { fixedWidth: 900, fixedHeight: 80 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                }));
            }
        }
        if(!bInRanking){
            if(my_rank < 10){
                sizer.add(this.add.text(0, 0, '   ...   ', { fixedWidth: 900, fixedHeight: 80 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                }));
            }
            sizer.add(this.add.text(0, 0, (my_rank+1) + '   -   ' + userData.username + ' : ' + userData.point, { fixedWidth: 900, fixedHeight: 80 })
            .setStyle({
                fontSize: '64px',
                fontFamily: 'RR',
                fontWeight: 'bold',
                color: '#ffffff',
            }));
        }
        this.rank_list.layout();
        this.rank_list.setSliderEnable(true);
        this.rank_list.setScrollerEnable(true);
        game.domContainer.style.display = 'none';
    }
}
