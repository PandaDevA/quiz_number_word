Client.daily_start = function(){
    Client.socket.emit('daily_start', {username : userData.userName});
};

Client.daily_end = function(){
    Client.socket.emit('standalone_end', {username : userData.userName, heart:0, point:0, coin:3});
};

Client.socket.on('daily_start',function(data){
    AdMob.showInterstitial();
    AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow:false,
        isTesting: true,
    });
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        gameData = data.gameData;
        game_type = "daily";
        game_state = "";
        cur_number = 0;
        cur_word = 0;
        cur_point = 0;
        game.scene.stop(activeScene.scene.key);
        game.scene.start('NumberGameScreen');
    }
    else
    {
        toast_error(activeScene, 'CAN NOT PLAY\nBONUS GAME!');
    }
});
