Client.tournament_in = function(){
    Client.socket.emit('tournament_in', {username : userData.username});
};

Client.tournament_out = function(){
    Client.socket.emit('tournament_out', {username : userData.username});
};

Client.tournament_end = function(isAlive){
    Client.socket.emit('tournament_end', {isAlive : isAlive, username : userData.username, point: cur_point});
};

Client.socket.on('tournament_in',function(data){
    if(data.result)
    {
        if(data.time)
        {
            tournamentData = data.result;
            tournamentTime = data.time;
            game.scene.stop('HomeScreen');
            game.scene.start('TournamentScreen');
        }
        else{
            if(game.scene.isActive('TournamentScreen'))
            {
                let scene = game.scene.getScene('TournamentScreen');
                scene.add_user(data.result);
            }
        }
        console.log('success');
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('tournament_out',function(data){
    if(data.result)
    {
        tournamentData = data.result;
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

Client.socket.on('tournament_start',function(data){
    if(data.result)
    {
        game_type = "tournament";
        gameData = data.gameData;
        cur_number = 0;
        cur_word = 0;
        cur_point = 0;
        game.scene.stop('TournamentScreen');
        game.scene.start('NumberGameScreen');
        console.log(data);
    }
    else
    {
        console.log('failed');
    }
});

Client.socket.on('tournament_end',function(data){
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
