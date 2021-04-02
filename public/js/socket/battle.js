Client.invite_request = function(friend_name){
    Client.socket.emit('invite_request', {username : friend_name});
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
