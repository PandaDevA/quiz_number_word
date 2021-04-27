/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class LoginScreen extends Phaser.Scene{
    constructor(){
        super({key: "LoginScreen"});
        if(!game.device.os.desktop)
        {
            game.input.mouse.enabled = false;
        }
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        // this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);


        this.load.image("Logo", "./images/logo.png");
        this.load.image("Login", "./images/login.png");
        this.load.image("SignUp", "./images/signup.png");
        this.load.image("InputBack", "./images/input_back.png");
        this.load.image("Facebook", "./images/facebook.png");
        this.load.image("Google", "./images/google.png");
    }

    create() {
        this.logo = this.add.image(540,325,'Logo');

        this.userNameImage = this.add.image(540,560,'InputBack');
        this.userName = this.add.rexInputText(540, 560, 620, 70, 
            {
                text:'testuser',
                type:'text',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);

        this.userNameText = this.add.text(210, 495, 'Username', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.passwordImage = this.add.image(540,700,'InputBack');
        this.password = this.add.rexInputText(540, 700, 620, 70, 
            {
                text:'1234',
                type:'password',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.passwordText = this.add.text(210, 635, 'Password', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.forgotText = this.add.text(860, 765, 'Forgot Password?', { fixedWidth: 250, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffffa0',
        })
        .setOrigin(1,0.5);

        this.loginButton = this.add.image(540,860,'Login');
        this.loginButton.setInteractive().on('pointerdown', () => {
            console.log('login_request');
            Client.login(this.userName.text, this.password.text);
        });

        this.withText = this.add.text(540, 1020, 'or\nsign up with', { fixedWidth: 200, fixedHeight: 64, align:'center' })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#000000',
        })
        .setOrigin(0.5,0.5);

        this.facebookButton = this.add.image(440,1170,'Facebook');
        this.facebookButton.setInteractive().on('pointerdown', () => {
        });

        this.googleButton = this.add.image(640,1170,'Google');
        this.googleButton.setInteractive().on('pointerdown', () => {
        });


        this.usingText = this.add.text(540, 1430, 'or\nsign up using', { fixedWidth: 200, fixedHeight: 64, align:'center' })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#000000',
        })
        .setOrigin(0.5,0.5);

        this.registerButton = this.add.image(540,1520,'SignUp');
        this.registerButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('LoginScreen');
            game.scene.start('RegisterScreen');
        });
    }
    update(){
    }
}
