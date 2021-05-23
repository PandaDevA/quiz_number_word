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
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);

        this.load.image("Logo", "./images/logo.png");
        this.load.image("Login", "./images/login.png");
        this.load.image("SignUp", "./images/signup.png");
        this.load.image("Update", "./images/update.png");
        this.load.image("InputBack", "./images/input_back.png");
        this.load.image("Facebook", "./images/facebook.png");
        this.load.image("Google", "./images/google.png");
        this.load.image("Cancel", "./images/cancel.png");
        this.load.image("UserName", "./images/username.png");
        this.load.image("EmptyUser", "./images/avatar_empty.png");
        this.load.image("Invite", "./images/invite.png");
        this.load.image("Random", "./images/random.png");
        this.load.image("MainPage", "./images/main_page.png");
        this.load.image("Lose", "./images/lose.png");
        this.load.image("PlayAgain", "./images/play_again.png");
        this.load.image("Win", "./images/win.png");
        this.load.image("Orange", "./images/orange_back.png");
        this.load.image("NextStage", "./images/next_stage.png");
        this.load.image("PointAds", "./images/win_earn_point_ads.png");
        this.load.image("CoinAds", "./images/win_earn_coin_ads.png");
        this.load.image("UserAvatar", "./images/avatar.png");
        this.load.image("avatar_cover", "./images/avatar_cover.png");
        this.load.image("Life", "./images/life.png");
        this.load.image("Coin", "./images/coin.png");
        this.load.image("InfoPanel", "./images/user_detail.png");
        this.load.image("Stage", "./images/stage.png");
        this.load.image("Battle", "./images/battle.png");
        this.load.image("Tournament", "./images/tournament.png");
        this.load.image("DailyGame", "./images/daily_game.png");
        this.load.image("TurnEarn", "./images/turn_earn.png");
        this.load.image("Menu", "./images/menu.png");
        this.load.image("Target", "./images/target.png");
        this.load.image("Time", "./images/time.png");
        this.load.image("Outline", "./images/game_outline.png");
        this.load.spritesheet("Number", "./images/number.png", { frameWidth: 211, frameHeight: 199 });
        this.load.spritesheet("Multi", "./images/sign_multi.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Plus", "./images/sign_plus.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Minus", "./images/sign_minus.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Divi", "./images/sign_div.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Refresh", "./images/refresh.png", { frameWidth: 190, frameHeight: 178 });
        this.load.spritesheet("Check", "./images/check.png", { frameWidth: 190, frameHeight: 178 });
        this.load.image("Passion", "./images/passion_board.png");
        this.load.image("Turn", "./images/turn.png");
        this.load.image("Stop", "./images/stop.png");
        this.load.image("Indicator", "./images/passion_picker.png");
        this.load.image("SignUp1", "./images/signup_button.png");
        this.load.image("TournamentDetailBlack", "./images/tournament_detail_black_back.png");
        this.load.image("TournamentDetailOrange", "./images/tournament_detail_orange_back.png");
        this.load.image("Join", "./images/join.png");
        this.load.image("Letter", "./images/letter.png");

        this.load.audio('button', './assets/audio/button click.mp3');
        this.load.audio('lose', './assets/audio/losed result.mp3');
        this.load.audio('success', './assets/audio/success result.mp3');
        this.load.audio('waiting', './assets/audio/waiting opponent sound.mp3');
        this.load.audio('action', './assets/audio/word action click.mp3');
        this.load.audio('start', './assets/audio/word and action opening.mp3');
   }

    create() {
        this.button_audio = this.sound.add('button');
        if(window.localStorage.getItem('UserName') != null){
            Client.login(window.localStorage.getItem('UserName'), window.localStorage.getItem('Password'))
        }
        this.logo = this.add.image(540,325,'Logo');

        this.userNameImage = this.add.image(540,560,'InputBack');
        this.userName = this.add.rexInputText(540, 560, 620, 70, 
            {
                text: window.localStorage.getItem('UserName'),
                type:'text',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);

        this.userNameText = this.add.text(210, 495, 'Kullanıcı', { fixedWidth: 200, fixedHeight: 32 })
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
                text: window.localStorage.getItem('Password'),
                type:'password',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.passwordText = this.add.text(210, 635, 'Şifre', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.forgotText = this.add.text(860, 765, 'Şifremi Unuttum?', { fixedWidth: 250, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffffa0',
        })
        .setOrigin(1,0.5);
        this.forgotText.setInteractive().on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            Client.forgot(this.userName.text);
        });

        this.loginButton = this.add.image(540,860,'Login');
        this.loginButton.setInteractive().on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
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

        // this.facebookButton = this.add.image(440,1170,'Facebook');
        // this.facebookButton.setInteractive().on('pointerdown', () => {
        // });

        this.googleButton = this.add.image(540,1170,'Google');
        this.googleButton.setInteractive().on('pointerdown', () => {
            if(sound_enable)
                this.button_audio.play();
            window.plugins.googleplus.login(
                {
                  'webClientId': '540253986128-8fhn5o5lb8ogcsnii9tiqqedkd5413jt.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                  'offline': false, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                },
                function (obj) {
                    Client.google(obj);
                },
                function (msg) {
                    toast_error(this, "Google login failed!");
                }
            );
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
            if(sound_enable)
                this.button_audio.play();
            game.scene.stop('LoginScreen');
            game.scene.start('RegisterScreen');
        });
    }
    update(){
    }
}
