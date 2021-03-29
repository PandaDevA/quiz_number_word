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

Client.socket.on('create',function(data){
    if(data.result)
    {
        if(data.result.userName == userData.username)
        {
            roomData = data.result;
            game.scene.remove('ListScreen');
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
            game.scene.get('RoomScreen').update();
        }
        else if(game.scene.isActive('ListScreen'))
        {
            game.scene.remove('ListScreen');
            game.scene.start('RoomScreen');
        }
        console.log('success');
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
        game.scene.get('RoomScreen').update();
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
        roomData = data.result;
        game.scene.get('RoomScreen').update();
        console.log('success');
    }
    else
    {
        console.log('failed');
    }
});
