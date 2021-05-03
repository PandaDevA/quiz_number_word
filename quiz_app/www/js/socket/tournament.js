Client.tournament_list = function(){
    Client.socket.emit('tournament_list', {});
};

Client.tournament_in = function(roomId){
    Client.socket.emit('tournament_in', {username : userData.userName, room_id: roomId});
};

Client.tournament_out = function(roomId){
    Client.socket.emit('tournament_out', {username : userData.userName, room_id: roomId});
};

Client.tournament_end = function(isAlive){
    Client.socket.emit('tournament_end', {isAlive : isAlive, username : userData.userName, point: cur_point});
};

Client.socket.on('tournament_list',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        tournament_list = data.result;
        if(tournament_list.length>0)
        {
            activeScene.cameras.main.fadeOut(1000, 16, 110, 173);
            activeScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                game.scene.stop(activeScene.scene.key);
                game.scene.start('TournamentScreen');
            });
        }
    }
    else
    {
        toast_error(activeScene, "THERE IS\nNO TOURNAMENT\nPLANED");
    }
});

Client.socket.on('tournament_in',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        if(game.scene.isActive('TournamentScreen')){
            activeScene.updateJoin(data.room_id, true);
        }
    }
    else
    {
        toast_error(activeScene, "CAN NOT JOIN\nIN TOURNAMENT");
    }
});

Client.socket.on('tournament_out',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        if(game.scene.isActive('TournamentScreen')){
            activeScene.updateJoin(data.room_id, false);
        }
    }
    else
    {
        toast_error(activeScene, "CAN NOT JOIN\nOUT TOURNAMENT");
    }
});
