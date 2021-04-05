/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class RegisterScreen extends Phaser.Scene{
    constructor(){
        super({key: "RegisterScreen"});
        this.avatar = "";
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        // this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        this.load.plugin('rexcanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcanvasplugin.min.js', true);
        this.load.plugin('rexfilechooserplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfilechooserplugin.min.js', true);

        this.load.image("Back", "./images/back.png");
        this.load.image("Register", "./images/register.png");
        this.load.image("UserName", "./images/username.png");
        this.load.image("Email", "./images/email.png");
        this.load.image("Password", "./images/password.png");
        this.load.image("UserAvatar", "./images/avatar.png");
    }

    create() {
        this.BackButton = this.add.image(50,50,'Back').setScale(0.2);
        this.BackButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('RegisterScreen');
            game.scene.start('LoginScreen');
        });

        // Create button
        var button = this.add.rectangle(150, 150, 120, 120, 0x4e342e).setStrokeStyle(2, 0x7b5e57);
        // Create canvas   
        var canvas = this.add.rexCanvas(150, 150, 120, 120).fill('black');
        canvas.fitTo = (function (parent) {
            var newSize = FitTo(this, parent, true);
            this.setDisplaySize(newSize.width, newSize.height);
        }).bind(canvas)

        var self = this;
        // Create a transparent file chooser
        this.add.rexFileChooser({
            accept: 'image/*'
        })
        .syncTo(button)
        .on('change', function (gameObject) {
            var files = gameObject.files;
            if (files.length === 0) {
                self.avatar = "";
                return;
            }

            var url = URL.createObjectURL(files[0]);
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = function () {
                self.avatar = reader.result;
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
            canvas.loadFromURLPromise(url)
                .then(function () {
                    URL.revokeObjectURL(url);
                    canvas.fitTo(button);
                });
        });
        
        this.userNameImage = this.add.image(150,250,'UserName').setScale(0.3);
        this.userName = this.add.text(155, 250, 'testuser', { fixedWidth: 150, fixedHeight: 18 })
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
        })
        .setOrigin(0,0.5);

        this.emailImage = this.add.image(150,300,'Email').setScale(0.3);
        this.email = this.add.text(155, 300, '1234', { fixedWidth: 100, fixedHeight: 18 })
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
        })
        .setOrigin(0,0.5);

        this.passwordImage = this.add.image(150,350,'Password').setScale(0.3);
        this.password = this.add.text(155, 350, '1234', { fixedWidth: 150, fixedHeight: 18 })
        .setStyle({
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#000000',
        })
        .setOrigin(0,0.5);
    
        this.userName.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.userName)
        });

        this.email.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.email)
        });

        this.password.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.password)
        });

        this.RegisterButton = this.add.image(150,450,'Register').setScale(0.3);
        this.RegisterButton.setInteractive().on('pointerdown', () => {
            Client.register(this.userName.text, this.email.text, this.password.text, this.avatar);
        });
    }

    update(){
    }

    toast_failed(){
        var toast = this.rexUI.add.toast({
            x: 150,
            y: 550,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xcc4040),
            text: this.add.text(0, 0, '', {
                fontSize: '18px'
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },

            duration: {
                in: 250,
                hold: 1000,
                out: 250,
            },
        })
        .show('Register failed...')
        .show('UserName Duplicated...')
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
