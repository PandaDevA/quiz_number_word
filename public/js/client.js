/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.login = function(username, password){
    Client.socket.emit('login', {username: username, password: password});
};

Client.create_room = function(){
    Client.socket.emit('create_room', {username : userData.username});
};

////////////////////////////////////////////////////////////////////////////

Client.socket.on('login',function(data){
    if(data.result)
    {
        userData = data.result;
        game.scene.remove('LoginScreen');
        game.scene.start('HomeScreen');
        console.log('success');
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('create_room',function(data){
    if(data.result)
    {
        userData = data.result;
        game.scene.remove('LoginScreen');
        game.scene.start('HomeScreen');
        console.log('success');
    }
    else
    {
        console.log('failed');
    }
});


