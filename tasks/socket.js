const data = require('../data/');
const puzzle = require('./puzzle');
const users = data.users;
const rooms = data.rooms;
const words = data.words;

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
                // console.log('login request recevied');
                users.getUserByName(data.username, data.password).then((result) => {
                    if (result) {
                        socket.emit('login', {result: result});
                        // console.log(`${data.username} is logged`);
                    } else {
                        socket.emit('login', {result: false});
                        // console.log(`${data.username} is not logged`);
                    }
                    });
            });

            socket.on('stage_start', (data) => {
                console.log('stage_start request recevied');
                users.startStage(data.username).then((result) => {
                    if (result) {
                        socket.emit('stage_start', {result: true, info: result});
                        console.log(`${data.username} start stage`);
                    } else {
                        socket.emit('stage_start', {result: false});
                        console.log(`${data.username} failure to start stage`);
                    }
                });
            });

            socket.on('stage_end', (data) => {
                console.log('stage_end request recevied');
                users.stopStage(data.username, data.result).then((result) => {
                    if (result) {
                        socket.emit('stage_end', {result: true});
                        console.log(`${data.username} end stage`);
                    } else {
                        socket.emit('stage_end', {result: false});
                        console.log(`${data.username} end failure stage`);
                    }
                });
            });

            socket.on('create', (data) => {
            console.log('create request recevied');
            rooms.createRoom(data.username).then((result) => {
                if (result) {
                    socket.join(`game_of_${result.id}`);
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

            socket.on('list', (data) => {
            console.log('list requset received');
            rooms.getJoinUsers(data.roomId).then((result) => {
                if (result) {
                    socket.emit('list', {result: true, joinusers: result});
                    console.log('list request is processed');
                } else {
                    socket.emit('list', {result: false});
                    console.log('list request is not precessed');
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
                    const numData = puzzle.getNumberData();
                    puzzle.getWordData().then((wordData) => {
                        socket.to(`game_of_${data.roomId}`).emit('start', {result: true, gameData: {numData: numData, wordData: wordData}});
                        socket.emit('start', {result: true, gameData: {numData: numData, wordData: wordData}});
                    });
                } else {
                    socket.emit('start', {result: false});
                    console.log('the room could not start');
                }
                });
            });

            socket.on('end', (data) => {
            console.log('end request received');
            if (!data.isTimeOut) {
                rooms.removeRoom(data.roomId, data.username).then((result) => {
                    if (result) {
                        socket.emit('end', {result: true, winner: data.username});
                        socket.to(`game_of_${data.roomId}`).emit('end', {result: true, winner: data.username});
                        console.log('end is processed');
                    } else {
                        socket.emit('end', {result: false});
                        console.log('the room could not end');
                    }
                });
            } else {
                rooms.timeOutUser(data.roomId, data.username).then((result) => {
                    if (result) {
                        if (result.allIsOver == false) {
                            socket.emit('timeout', {result: true});
                            console.log('timeout is processed');
                        } else {
                            socket.emit('end', {result: true, winner: ''});
                            socket.to(`game_of_${data.roomId}`).emit('end', {result: true, winner: ''});
                            console.log('end by timeoout');
                        }
                    } else {
                        socket.emit('timeout', {result: false});
                        console.log('user timeout is not processed');
                    }
                });
            }
            });
        });
    },
};

module.exports = exportedMethods;