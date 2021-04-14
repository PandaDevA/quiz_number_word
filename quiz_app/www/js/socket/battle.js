Client.invite_request = function(friend_name){
    Client.socket.emit('invite_request', {inviteuser : friend_name, waituser : userData.username});
};

Client.invite_accept = function(){
    Client.socket.emit('invite_accept', {roomId : room_id, inviteuser : invite_name});
};

Client.invite_reject = function(){
    Client.socket.emit('invite_reject', {roomId : room_id, waituser : invite_name, inviteuser:userData.username});
    room_id = "";
    invite_name = "";
};

Client.invite_cancel = function(){
    Client.socket.emit('invite_cancel', {roomId : room_id, waituser : invite_name});
    room_id = "";
    invite_name = "";
};

Client.battle_end = function(isAlive){
    Client.socket.emit('battle_end', {roomId: room_id, isAlive : isAlive, username : userData.username, point: cur_point});
};

Client.random_request = function(){
    Client.socket.emit('random_request', {username : userData.username});
};

Client.random_cancel = function(){
    Client.socket.emit('random_cancel', {username : userData.username});
};


Client.socket.on('invite_request',function(data){
    if(data.result)
    {
        if(data.from)
        {
            room_id = data.result.id;
            invite_name = data.from;
            if(game.scene.isActive('BattleScreen'))
            {
                let scene = game.scene.getScene('BattleScreen');
                scene.invite_request();
            }
        }
        else if(data.to)
        {
            room_id = data.result.id;
            invite_name = data.to;
        }
    }
    else
    {
        if(!data.from)
        {
            if(game.scene.isAcive('BattleScreen'))
            {
                game.scene.getScene('BattleScreen').invite_request_failed();
            }
        }
    }
});

Client.socket.on('invite_accept',function(data){
    if(data.result == false)
    {
        room_id = "";
        invite_name = "";
        if(game.scene.isAcive('BattleScreen'))
        {
            game.scene.getScene('BattleScreen').invite_request_failed();
        }
        console.log(data.error);
    }
});

Client.socket.on('invite_reject',function(data){
    if(data.result)
    {
        room_id = "";
        invite_name = "";
        if(game.scene.isAcive('BattleScreen'))
        {
            game.scene.getScene('BattleScreen').invite_request_failed();
        }
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('invite_cancel',function(data){
    console.log(data);
});

Client.socket.on('battle_start',function(data){
    if(data.result)
    {
        room_id = data.result;
        game_type = "battle";
        game_state = "";
        gameData = data.gameData;
        cur_number = 0;
        cur_word = 0;
        cur_point = 0;
        if(game.scene.isActive('BattleScreen'))
            game.scene.stop('BattleScreen');
        if(game.scene.isActive('HomwScreen'))
            game.scene.stop('HomeScreen');
        game.scene.start('NumberGameScreen');
        console.log(data);
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('battle_end',function(data){
    if(data.result)
    {
        winner_name = data.winner;
        winner_point = data.winner_point;
        if(game.scene.isActive('EndScreen'))
            game.scene.getScene('EndScreen').updateResult();
        else if(game.scene.isActive('HomeScreen'))
            game.scene.getScene('HomeScreen').update();
        console.log(data);
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('random_request',function(data){
    if(data.result)
    {
        if(game.scene.isActive('BattleScreen'))
        {
            let scene = game.scene.getScene('BattleScreen');
            scene.random_request();
        }
    }
    else
    {
        console.log(data);
    }
});
