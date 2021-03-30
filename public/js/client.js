/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.login = function(username, password){
    Client.socket.emit('login', {username: username, password: password});
};

Client.create_room = function(){
    Client.socket.emit('create', {username : userData.username});
};

Client.join_room = function(room_id){
    Client.socket.emit('join', {joinUser : userData.username, roomId : room_id});
};

Client.ready = function(){
    Client.socket.emit('ready', {readyUser : userData.username, roomId : roomData.id});
};

Client.start = function(){
    Client.socket.emit('start', {roomId : roomData.id});
};

Client.end = function(isTimeOut){
    Client.socket.emit('end', {isTimeOut : isTimeOut, roomId : roomData.id, username : userData.username});
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

Client.socket.on('create',function(data){
    if(data.result)
    {
        if(data.result.userName == userData.username)
        {
            roomData = data.result;
            game.scene.stop('ListScreen');
            game.scene.start('RoomScreen');
        }
        else{
            if(game.scene.isActive('ListScreen'))
            {
                let scene = game.scene.getScene('ListScreen');
                scene.add_item(data.result);
            }
        }
        console.log('success');
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('join',function(data){
    if(data.result)
    {
        roomData = data.result;
        if(game.scene.isActive('RoomScreen'))
        {
            game.scene.getScene('RoomScreen').update();
        }
        else if(game.scene.isActive('ListScreen'))
        {
            game.scene.stop('ListScreen');
            game.scene.start('RoomScreen');
        }
        console.log(data);
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('ready',function(data){
    if(data.result)
    {
        roomData = data.result;
        game.scene.getScene('RoomScreen').update();
        console.log('success');
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('start',function(data){
    if(data.result)
    {
        gameData = data.gameData;
        game.scene.stop('RoomScreen');
        game.scene.start('NumberGameScreen');
        console.log(data);
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('end',function(data){
    if(data.result)
    {
        winner_name = data.winner;
        if(game.scene.isActive('EndScreen'))
            game.scene.getScene('EndScreen').updateResult();
        else if(game.scene.isActive('WordGameScreen')){
            game.scene.stop('WordGameScreen');
            game.scene.start('EndScreen');
        }
        else if(game.scene.isActive('NumberGameScreen')){
            game.scene.stop('NumberGameScreen');
            game.scene.start('EndScreen');
        }
        console.log(data);
    }
    else
    {
        console.log('failed');
    }
});
