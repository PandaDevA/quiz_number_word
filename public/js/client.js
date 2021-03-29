/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.login = function(username, password){
    Client.socket.emit('login', {username: username, password: password});
};

////////////////////////////////////////////////////////////////////////////

Client.socket.on('login_response',function(data){
    if(data.result)
    {
        game.scene.remove('LoginScreen');
        game.scene.start('HomeScreen');
        console.log('success');
    }
    else
    {
        console.log('failed');
    }
});


