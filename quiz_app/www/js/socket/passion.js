Client.passion_start = function(){
    Client.socket.emit('passion_start', {username : userData.userName});
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
