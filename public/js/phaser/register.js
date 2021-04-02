/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class RegisterScreen extends Phaser.Scene{
    constructor(){
        super({key: "RegisterScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        this.load.plugin('rexcanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcanvasplugin.min.js', true);
        this.load.plugin('rexfilechooserplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfilechooserplugin.min.js', true);


        this.load.image("Create", "./images/create.png");
        this.load.image("UserName", "./images/username.png");
        this.load.image("Password", "./images/password.png");
        this.load.image("UserAvatar", "./images/avatar.png");
    }

    create() {
        this.userAvatar = this.add.image(150,100,'UserAvatar').setScale(0.3);

        // Create button
        var button = this.add.rectangle(400, 300, 500, 500, 0x4e342e).setStrokeStyle(2, 0x7b5e57);
        // Create canvas   
        var canvas = this.add.rexCanvas(400, 300, 300, 300).fill('black');
        canvas.fitTo = (function (parent) {
            var newSize = FitTo(this, parent, true);
            this.setDisplaySize(newSize.width, newSize.height);
        }).bind(canvas)

        // Create a transparent file chooser
        this.add.rexFileChooser({
            accept: 'image/*'
        })
        .syncTo(button)
        .on('change', function (gameObject) {
            var files = gameObject.files;
            if (files.length === 0) {
                return;
            }

            var url = URL.createObjectURL(files[0]);
            canvas.loadFromURLPromise(url)
                .then(function () {
                    URL.revokeObjectURL(url);
                    canvas.fitTo(button);
                })
        })
        
        this.userNameImage = this.add.image(150,200,'UserName').setScale(0.3);
        this.userName = this.add.text(155, 200, 'testuser', { fixedWidth: 150, fixedHeight: 18 })
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
        })
        .setOrigin(0,0.5);

        this.passwordImage = this.add.image(150,300,'Password').setScale(0.3);
        this.password = this.add.text(155, 300, '1234', { fixedWidth: 150, fixedHeight: 18 })
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
        })
        .setOrigin(0,0.5);
    
        this.userName.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.userName)
        });

        this.password.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.password)
        });

        this.RegisterButton = this.add.image(150,400,'Create').setScale(0.3);
        this.RegisterButton.setInteractive().on('pointerdown', () => {
        });
    }
    update(){
    }
}

var FitTo = function (child, parent, out) {
    if (out === undefined) {
        out = {};
    } else if (out === true) {
        out = globalSize;
    }

    if ((child.width <= parent.width) && (child.height <= parent.height)) {
        out.width = child.width;
        out.height = child.height;
        return out;
    }

    var childRatio = child.width / child.height;
    out.width = Math.min(child.width, parent.width);
    out.height = Math.min(child.height, parent.height);
    var ratio = out.width / out.height;

    if (ratio < childRatio) {
        out.height = out.width / childRatio;
    } else if (ratio > childRatio) {
        out.width = out.height * childRatio;
    }

    return out;
}

var globalSize = {};
