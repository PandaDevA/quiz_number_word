Client.invite_request = function(friend_name){
    Client.socket.emit('invite_request', {inviteuser : friend_name, waituser : userData.username});
};

Client.invite_accept = function(friend_name){
    Client.socket.emit('invite_accept', {inviteuser : friend_name, waituser : userData.username});
};

Client.invite_reject = function(friend_name){
    Client.socket.emit('invite_reject', {inviteuser : friend_name, waituser : userData.username});
};

Client.invite_cancel = function(friend_name){
    Client.socket.emit('invite_cancel', {inviteuser : friend_name, waituser : userData.username});
};

Client.socket.on('invite_request',function(data){
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

Client.socket.on('invite_accept',function(data){
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

Client.socket.on('invite_reject',function(data){
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

Client.socket.on('invite_cancel',function(data){
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
