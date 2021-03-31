/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.login = function(username, password){
    Client.socket.emit('login', {username: username, password: password});
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
        console.log('failed');
    }
});
