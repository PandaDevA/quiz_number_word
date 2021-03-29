const data = require('../data/');
const users = data.users;
const rooms = data.rooms;

// const players = {};
// const star = {
//   x: Math.floor(Math.random() * 700) + 50,
//   y: Math.floor(Math.random() * 500) + 50,
// };
// const scores = {
//   blue: 0,
//   red: 0,
// };


const exportedMethods = {
    async useSocket(io) {

        let result = await users.getAllUsers();
        console.log(result);
        // result = await users.getUserByName('testuser', '1234');
        // if(result) console.log(result);

        io.on('connection', socket => {
            console.log('a user connected');
            // if the player doesn't already have an existing session, create a new player
            // (check prevents creating multiple ships when browser auto disconnects
            // and reconnects socket)
           
            // if (!socket.handshake.session.ship_exists) {

            // create a new player and add it to our players object
            // players[socket.id] = {
            //     playerId: socket.id,
            // };

            // send the players object to the new player
            // socket.emit('currentPlayers', players);
            // socket.broadcast.emit('newPlayer', players[socket.id]);
        
            // socket.handshake.session.ship_exists = true;
            // socket.handshake.session.save();
            // }
        
            socket.on('disconnect', () => {
            console.log('user disconnected');
            // remove this player from our players object
            // delete players[socket.id];
            // emit a message to all players to remove this player
            // io.emit('disconnect', socket.id);
            });

            socket.on('login', (data) => {
            console.log('login request recevied');
            users.getUserByName(data.username, data.password).then((result) => {
                if(result) {
                    socket.emit('login', {result: result});
                    console.log(`${data.username} is logged`);
                } else {
                    socket.emit('login', {result: false});
                    console.log(`${data.username} is not logged`);
                }
                });
            });

            socket.on('create', (data) => {
            console.log('create request recevied');
            rooms.createRoom(data.username).then((result) => {
                if (result) {
                    socket.join(`game_of_${result}`);
                    socket.emit('create', {result: {roomId: result, createUser: data.username}});
                    socket.broadcast.emit('create', {result: {roomId: result, createUser: data.username}});
                    console.log(`created room is ${data.username}: ${result}`);
                } else {
                    socket.emit('create', {result: false});
                    console.log(`create request of ${data.username} is failed`);
                }
                });
            });
        

            socket.on('join', (data) => {
            console.log('join request recevied');
            rooms.joinRoom(data.roomId, data.joinUser).then((result) => {
                if (result) {
                    socket.join(`game_of_${data.roomId}`);
                    socket.emit('join', {result: result});
                    socket.to(`game_of_${data.roomId}`, {result: result});
                } else {
                    socket.emit('join', {result: false});
                    console.log(`join request of ${data.joinUser} is failed`);
                }
                });
            });
        
            // when a player moves, update the player data
            // socket.on('playerMovement', movementData => {
            // players[socket.id].x = movementData.x;
            // players[socket.id].y = movementData.y;
            // players[socket.id].rotation = movementData.rotation;
            // emit a message to all players about the player that moved
            // socket.broadcast.emit('playerMoved', players[socket.id]);
            // });
        
            // socket.on('starCollected', () => {
            // if (players[socket.id].team === 'red') {
            //     scores.red += 10;
            // } else {
            //     scores.blue += 10;
            // }
            // star.x = Math.floor(Math.random() * 700) + 50;
            // star.y = Math.floor(Math.random() * 500) + 50;
            // io.emit('starLocation', star);
            // io.emit('scoreUpdate', scores);
            // })
        });
    },
};

module.exports = exportedMethods;