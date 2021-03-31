Client.stage_start = function(){
    Client.socket.emit('stage_start', {username : userData.username});
};

Client.stage_cancel = function(){
    Client.socket.emit('stage_cancel', {username : userData.username});
};

Client.socket.on('stage_start',function(data){
    if(data.result)
    {
        if(game.scene.isActive('HomeScreen'))
        {
            gameData = data.gameData;
            game_type = "stage";
            cur_number = 0;
            game.scene.stop('HomeScreen');
            game.scene.start('NumberGameScene');
        }
        else
            Client.stage_cancel();
        console.log(data);
    }
    else
    {
        console.log('failed');
    }
});
