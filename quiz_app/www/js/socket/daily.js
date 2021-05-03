Client.daily_start = function(){
    Client.socket.emit('daily_start', {username : userData.userName});
};

Client.daily_end = function(isWin){
    if(isWin)
        Client.socket.emit('standalone_end', {username : userData.userName, heart:1, point:cur_point, coin:3});
};

Client.socket.on('daily_start',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        gameData = data.gameData;
        game_type = "daily";
        game_state = "";
        cur_number = 0;
        cur_word = 0;
        cur_point = 0;
        activeScene.cameras.main.fadeOut(1000, 16, 110, 173);
        activeScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            game.scene.stop(activeScene.scene.key);
            game.scene.start('NumberGameScreen');
        });
    }
    else
    {
        toast_error(activeScene, 'CAN NOT PLAY\nDAILY GAME!');
    }
});
