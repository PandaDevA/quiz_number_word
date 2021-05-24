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
        this.load.plugin('rexcanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcanvasplugin.min.js', true);
        this.load.plugin('rexfilechooserplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfilechooserplugin.min.js', true);
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);

        this.avatar = "";
    }

    create() {
        this.button_audio = this.sound.add('button');
        // Create button
        var button = this.add.image(540,300,'EmptyUser').setOrigin(0.5,0.5);
        // Create canvas   
        var canvas = this.add.rexCanvas(540, 300, 300, 300).setOrigin(0.5,0.5);
        canvas.fitTo = (function (parent) {
            var newSize = FitTo(this, parent, true);
            this.setDisplaySize(newSize.width, newSize.height);
        }).bind(canvas)
        this.userAvatar_cover = this.add.image(540,300,'avatar_cover').setDepth(5);

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
        
        this.userNameImage = this.add.image(540,600,'InputBack');
        this.userName = this.add.rexInputText(540, 600, 620, 70, 
            {
                text:'',
                type:'text',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);

        this.userNameText = this.add.text(210, 535, 'Kullanıcı', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.emailImage = this.add.image(540,750,'InputBack');
        this.email = this.add.rexInputText(540, 750, 620, 70, 
        {
            text:'',
            type:'text',
            fontSize: '64px',
            fontFamily: 'RR',
            color: '#000000',
        })
        .setOrigin(0.5,0.5);
        this.emailText = this.add.text(210, 685, 'Email', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.passwordImage = this.add.image(540,900,'InputBack');
        this.password = this.add.rexInputText(540, 900, 620, 70, 
            {
                text:'',
                type:'text',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.passwordText = this.add.text(210, 835, 'Şifre', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.registerButton = this.add.image(540,1300,'SignUp1');
        this.registerButton.setInteractive().on('pointerdown', () => {
            if(this.userName.text == '' || this.password.text == ''){
                toast_error(this, 'Please fill username\nand password.');
                return;
            }
            if(sound_enable)
                this.button_audio.play();
            Client.register(this.userName.text, this.email.text, this.password.text, this.avatar);
        });

        this.privacyText = this.add.text(540, 1100, 'Üye olduğunuzda, "Koşullar ve\nŞartlar" ile "Gizlilik\nSözleşmesi"ni kabul etmiş\nsayılırsınız.', { fixedWidth: 800, fixedHeight: 300 })
        .setStyle({
            fontSize: '36px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            fill: '#000000',
        })
        .setOrigin(0.5,0.5);

        this.loginText = this.add.text(540, 1540, 'GİRİŞ YAP', { fixedWidth: 500, fixedHeight: 120 })
        .setStyle({
            fontSize: '84px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            fill: '#000000',
        })
        .setOrigin(0.5,0.5);
        this.loginText.stroke = "#f0fafe";
        this.loginText.strokeThickness = 32;
        //  Apply the shadow to the Stroke and the Fill (this is the default)
        this.loginText.setShadow(10, 10, "#333333", 10, true, true);

        this.loginText.setInteractive().on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            game.scene.stop('RegisterScreen');
            game.scene.start('LoginScreen');
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
