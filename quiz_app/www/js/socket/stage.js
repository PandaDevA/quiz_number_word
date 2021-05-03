Client.stage_start = function(){
    Client.socket.emit('stage_start', {username : userData.userName});
};

Client.stage_end = function(isWin){
    if(isWin)
        Client.socket.emit('standalone_end', {username : userData.userName, heart:1, point:cur_point, coin:1});
};

Client.socket.on('stage_start',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        gameData = data.gameData;
        game_type = "stage";
        game_state = "";
        cur_number = 0;
        cur_word = 0;
        cur_point = 0;

        activeScene.cameras.main.fadeOut(1000, 16, 110, 173);
        activeScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
		    game.scene.stop(activeScene.scene.key);
            game.scene.start('NumberGameScreen');
	    })
        console.log(data);
    }
    else
    {
        toast_error(activeScene, "CAN NOT PLAY\nSTAGE GAME!");
    }
});
