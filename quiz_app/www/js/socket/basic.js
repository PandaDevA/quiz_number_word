/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io("http://192.168.104.55:8081/");

Client.login = function(username, password){
    Client.socket.emit('login', {username: username, password: password});
};


Client.register = function(username, email, password, avatar){
    Client.socket.emit('register', {username: username, email: email, password: password, avatar: avatar});
};


////////////////////////////////////////////////////////////////////////////

Client.socket.on('login',function(data){
    if(data.result)
    {
        userData = data.result;
        game.scene.stop('LoginScreen');
        game.scene.start('HomeScreen');
    }
    else
    {
        toast_error(game.scene.getScene('LoginScreen'), 'Login Failed');
    }
});

Client.socket.on('register',function(data){
    if(data.result)
    {
        game.scene.stop('RegisterScreen');
        game.scene.start('LoginScreen');
        toast_error(game.scene.getScene('LoginScreen'), 'Register Succeed...');
    }
    else
    {
        toast_error(game.scene.getScene('RegisterScreen'), 'Register failed\nUserName Duplicated.');
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
    }).setDepth(2)
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
    }).setDepth(2)
        .layout()
        // .drawBounds(scene.add.graphics(), 0xff0000)
        .popUp(1000);

    dialog
        .on('button.click', function (button, groupName, index) {
            cover.destroy();
            dialog.destroy();
            game.scene.stop(scene.scene.key);
            game.scene.start('BattleScreen');
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
        y: 840,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xffffff),
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
    })
    .show(error)
}