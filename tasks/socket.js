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
                    socket.emit('create', {result: result});
                    socket.broadcast.emit('create', {result: result});
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
                    socket.to(`game_of_${data.roomId}`).emit('join', {result: result});
                } else {
                    socket.emit('join', {result: false});
                    console.log(`join request of ${data.joinUser} is failed`);
                }
                });
            });

            socket.on('ready', (data) => {
            console.log('ready request received');
            rooms.readyUser(data.roomId, data.readyUser).then((result) => {
                if (result) {
                    socket.emit('ready', {result: result});
                    socket.to(`game_of_${data.roomId}`).emit('ready', {result: result});
                } else {
                    socket.emit('ready', {result: false});
                    console.log(`ready request of ${data.readyUser} is failed`);
                }
                });
            });
        
            socket.on('start', (data) => {
            console.log('start request received');
            rooms.startRoom(data.roomId).then((result) => {
                if (result) {
                    socket.to(`game_of_${data.roomId}`).emit('start', {result: true});
                    socket.emit('start', {result: true});
                } else {
                    socket.emit('start', {result: false});
                    console.log('the room could not start');
                }
                });
            });
        });
    },
};

module.exports = exportedMethods;