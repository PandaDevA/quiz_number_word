Client.passion_start = function(){
    Client.socket.emit('passion_start', {username : userData.userName});
};

Client.passion_end = function(){
    Client.socket.emit('standalone_end', {username : userData.userName, heart:0, point:0, coin:cur_prize});
};

Client.socket.on('passion_start',function(data){
    let activeScene = game.scene.getScenes(true)[0];
    if(data.result)
    {
        game.scene.stop(activeScene.scene.key);
        game.scene.start('PassionScreen');
    }
    else
    {
        toast_error(activeScene, data.error);
    }
});
