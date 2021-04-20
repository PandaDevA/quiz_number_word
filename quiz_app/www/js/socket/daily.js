Client.daily_start = function(){
    Client.socket.emit('daily_start', {username : userData.userName});
};

Client.daily_end = function(isWin){
    if(isWin)
        Client.socket.emit('standalone_end', {username : userData.userName, heart:1, point:cur_point, coin:3});
};

Client.socket.on('daily_start',function(data){
    if(data.result)
    {
        if(game.scene.isActive('HomeScreen'))
        {
            gameData = data.gameData;
            game_type = "daily";
            game_state = "";
            cur_number = 0;
            cur_word = 0;
            cur_point = 0;
            game.scene.stop('HomeScreen');
            game.scene.start('NumberGameScreen');
        }
        console.log(data);
    }
    else
    {
        game.scene.getScene('HomeScreen').toast_stage_failed();
        console.log('failed');
    }
});
