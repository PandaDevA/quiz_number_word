Client.stage_start = function(){
    Client.socket.emit('stage_start', {username : userData.username});
};

Client.stage_cancel = function(){
    Client.socket.emit('stage_cancel', {username : userData.username});
};

Client.stage_end = function(isWin){
    Client.socket.emit('stage_end', {username : userData.username, result:{isWin:isWin, point:cur_point, coin:1}});
};

Client.socket.on('stage_start',function(data){
    if(data.result)
    {
        if(game.scene.isActive('HomeScreen'))
        {
            gameData = data.gameData;
            game_type = "stage";
            game_state = "";
            cur_number = 0;
            cur_word = 0;
            cur_point = 0;
            game.scene.stop('HomeScreen');
            game.scene.start('NumberGameScreen');
        }
        else if(game.scene.isActive('EndScreen'))
        {
            gameData = data.gameData;
            game_type = "stage";
            game_state = "";
            cur_number = 0;
            cur_word = 0;
            cur_point = 0;
            game.scene.stop('EndScreen');
            game.scene.start('NumberGameScreen');
        }
        else
            Client.stage_cancel();
        console.log(data);
    }
    else
    {
        game.scene.getScene('HomeScreen').toast_stage_failed();
        console.log('failed');
    }
});

Client.socket.on('stage_end',function(data){
    if(data.result)
    {
        if(game.scene.isActive('HomeScreen'))
        {
            userData = data.info;
            game.scene.getScene('HomeScreen').update();
        }
        else
        {
            userData = data.info;
        }
        console.log(data);
    }
    else
    {
        console.log('failed');
    }
});
