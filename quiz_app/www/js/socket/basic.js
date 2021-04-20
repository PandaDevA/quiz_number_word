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
        console.log('success');
    }
    else
    {
        game.scene.getScene('LoginScreen').toast_failed();
        console.log('failed');
    }
});

Client.socket.on('register',function(data){
    if(data.result)
    {
        game.scene.stop('RegisterScreen');
        game.scene.start('LoginScreen');
        game.scene.getScene('LoginScreen').toast_register_succeed();
        console.log('success');
    }
    else
    {
        game.scene.getScene('RegisterScreen').toast_failed();
        console.log('failed');
    }
});

Client.socket.on('update_userdata',function(data){
    userData = data.result;
    if(game.scene.isActive('HomeScreen'))
        game.scene.getScene('HomeScreen').update_userData();
});

function toast_error(scene, error){
    var toast = scene.rexUI.add.toast({
        x: 540,
        y: 840,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xffffff),
        text: scene.add.text(0, 0, '', {
            fontSize: '64px'
        }),
        space: {
            left: 50,
            right: 50,
            top: 80,
            bottom: 80,
        },

        duration: {
            in: 250,
            hold: 1000,
            out: 250,
        },
    })
    .show(error)
}