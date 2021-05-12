/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io("http://192.168.104.55:8081/");
// Client.socket = io("http://192.168.104.56:8081/");
// Client.socket = io("http://quizpuzzle.chileracing.net/");

Client.login = function(username, password){
    Client.socket.emit('login', {username: username, password: password});
};

Client.forgot = function(username){
    Client.socket.emit('forgot', {username: username});
};

Client.logout = function(){
    Client.socket.emit('logout', {});
};

Client.register = function(username, email, password, avatar){
    Client.socket.emit('register', {username: username, email: email, password: password, avatar: avatar});
};

Client.rank_list = function(){
    Client.socket.emit('rank_list', {});
};

Client.rule_content = function(){
    Client.socket.emit('rule_content', {});
};

Client.method_content = function(){
    Client.socket.emit('method_content', {});
};

Client.policy_content = function(){
    Client.socket.emit('policy_content', {});
};


////////////////////////////////////////////////////////////////////////////

Client.socket.on('login',function(data){
    if(data.result)
    {
        userData = data.result;
        game.scene.getScene('LoginScreen').cameras.main.fadeOut(1000, 16, 110, 173);
        game.scene.getScene('LoginScreen').cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            game.scene.stop('LoginScreen');
            game.scene.start('HomeScreen');
        });
    }
    else
    {
        toast_error(game.scene.getScene('LoginScreen'), 'Login Failed');
    }
});

Client.socket.on('register',function(data){
    if(data.result)
    {
        game.scene.getScene('RegisterScreen').cameras.main.fadeOut(1000, 16, 110, 173);
        game.scene.getScene('RegisterScreen').cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            game.scene.stop('RegisterScreen');
            game.scene.start('LoginScreen');
        });
        toast_error(game.scene.getScene('LoginScreen'), 'Register Succeed...');
    }
    else
    {
        toast_error(game.scene.getScene('RegisterScreen'), 'Register failed\nUserName Duplicated.');
    }
});

Client.socket.on('forgot',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        toast_error(activeScene, 'New Password Has Been\nSent To Your Email.');
    }
    else
    {
        toast_error(activeScene, 'Username Does\nNot Exists.');
    }
});

Client.socket.on('rank_list',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        rank_list = data.result;
        activeScene.cameras.main.fadeOut(1000, 16, 110, 173);
        activeScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            game.scene.stop(activeScene.scene.key);
            game.scene.start('RankScreen');
        });
    }
    else
    {
        toast_error(activeScene, 'Failed to load rank');
    }
});

Client.socket.on('rule_content',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        rule_content = data.result;
        activeScene.cameras.main.fadeOut(1000, 16, 110, 173);
        activeScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            game.scene.stop(activeScene.scene.key);
            game.scene.start('RuleScreen');
        });
    }
    else
    {
        toast_error(activeScene, 'Failed to load rule');
    }
});

Client.socket.on('policy_content',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        policy_content = data.result;
        activeScene.cameras.main.fadeOut(1000, 16, 110, 173);
        activeScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            game.scene.stop(activeScene.scene.key);
            game.scene.start('PolicyScreen');
        });
    }
    else
    {
        toast_error(activeScene, 'Failed to load policy');
    }
});

Client.socket.on('method_content',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        method_content = data.result;
        activeScene.cameras.main.fadeOut(1000, 16, 110, 173);
        activeScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            game.scene.stop(activeScene.scene.key);
            game.scene.start('MethodScreen');
        });
    }
    else
    {
        toast_error(activeScene, 'Failed to load method');
    }
});

Client.socket.on('update_userdata',function(data){
    userData = data.result;
    if(game.scene.isActive('HomeScreen'))
        game.scene.getScene('HomeScreen').update_userData();
});

var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        width: 280,
        height: 140,

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xfa5c00),

        text: scene.add.text(0, 0, text, {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '90px',
            color: "#ffffff",
            align: "center"
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        },

        align: "center"
    });
}

function invite_modal(scene){
    var cover = scene.add.rectangle(-1000,-1000,2080,2680,0x000000, 0.2).setOrigin(0,0).setDepth(1).setInteractive();
    var dialog = scene.rexUI.add.dialog({
        x: 540,
        y: 800,

        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xffffff),
        content: scene.add.text(0, 0, invite_name + '\nWANT TO PLAY\nBATTLE GAME\nWITH YOU.\nDO YOU WANT?', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            align: "center"
        }),

        actions: [
            createLabel(scene, 'YES'),
            createLabel(scene, 'NO')
        ],

        space: {
            content: 25,
            action: 15,

            left: 60,
            right: 60,
            top: 40,
            bottom: 40,
        },

        align: {
            actions: 'center', // 'center'|'left'|'right'
        },

        expand: {
            content: false, // Content is a pure text object
        }
    }).setDepth(100)
        .layout()
        // .drawBounds(scene.add.graphics(), 0xff0000)
        .popUp(1000);

    dialog
        .on('button.click', function (button, groupName, index) {
            if(index == 0)
            {
                Client.invite_accept();
            }
            else
            {
                Client.invite_reject();
            }
            cover.destroy();
            dialog.destroy();
        })
        .on('button.over', function (button, groupName, index) {
            // button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button, groupName, index) {
            // button.getElement('background').setStrokeStyle();
        });
}

function reject_modal(scene){
    var cover = scene.add.rectangle(-1000,-1000,2080,2680,0x000000, 0.2).setOrigin(0,0).setDepth(1).setInteractive();
    var dialog = scene.rexUI.add.dialog({
        x: 540,
        y: 800,

        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xffffff),
        content: scene.add.text(0, 0, 'OPPONENT\nREJECTED TO\nPLAY WITH YOU.', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            align: "center"
        }),

        actions: [
            createLabel(scene, 'OK'),
        ],

        space: {
            content: 25,
            action: 15,

            left: 60,
            right: 60,
            top: 40,
            bottom: 40,
        },

        align: {
            actions: 'center', // 'center'|'left'|'right'
        },

        expand: {
            content: false, // Content is a pure text object
        }
    }).setDepth(100)
        .layout()
        // .drawBounds(scene.add.graphics(), 0xff0000)
        .popUp(1000);

    dialog
        .on('button.click', function (button, groupName, index) {
            cover.destroy();
            dialog.destroy();
            scene.cameras.main.fadeOut(1000, 16, 110, 173);
            scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                game.scene.stop(scene.scene.key);
                game.scene.start('BattleScreen');
            });
        })
        .on('button.over', function (button, groupName, index) {
            // button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button, groupName, index) {
            // button.getElement('background').setStrokeStyle();
        });
}

function toast_error(scene, error){
    var toast = scene.rexUI.add.toast({
        x: 540,
        y: 300,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xffffff).setStrokeStyle(10, 0xff0000, 1),
        text: scene.add.text(0, 0, '', {
            fontFamily: 'RR',
            fontWeight: 'bold',
            fontSize: '64px',
            color: "#106eac",
            align: "center",
        }),
        space: {
            left: 50,
            right: 50,
            top: 80,
            bottom: 80,
        },

        duration: {
            in: 250,
            hold: 3000,
            out: 250,
        },
    }).setDepth(100)
    .show(error)
}