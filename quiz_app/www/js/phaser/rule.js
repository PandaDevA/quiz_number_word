/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class RuleScreen extends Phaser.Scene{
    constructor(){
        super({key: "RuleScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });;
    }

    create() {
        this.rule = this.rexUI.add.scrollablePanel({
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

            header: this.add.text(0, 0, 'Rule', { fixedWidth: 1000, fixedHeight: 100 })
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
        var sizer = this.rule.getElement('panel');
        sizer.add(this.add.text(0, 0, rule_content, { fixedWidth: 900})
        .setStyle({
            fontSize: '48px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#000000',
            wordWrap: { width: 900}
        }));
        this.rule.layout();
        this.rule.setSliderEnable(true);
        this.rule.setScrollerEnable(true);

        this.mainPage = this.add.image(540,1500,'MainPage');
        this.mainPage.setInteractive().on('pointerdown', () => {
            game.domContainer.style.display = 'block';
            game.scene.stop('RuleScreen');
            game.scene.start('HomeScreen');
        });
        game.domContainer.style.display = 'none';
    }
    
    update(){
    }
    
}
