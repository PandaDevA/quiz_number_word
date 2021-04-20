const data = require('../data/');
const puzzle = require('./puzzle');
const users = data.users;
const rooms = data.rooms;

const players = {};

const getDateTimeString = (date) => {

    const pad = (s) => (s < 10 ? '0' + s : s);
    const dateString = [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
    ].join('-');
    const timeString = date.toLocaleTimeString();

    return dateString + ' ' + timeString;
}

 const getMultiRandomData = async () => {
    let numDataList = [], wordDataList = [];
    for(let i = 0; i < /*5*/1; i++) {
        const numData = puzzle.getNumberData();
        const wordData = await puzzle.getWordData();
        numDataList.push(numData);
        wordDataList.push(wordData);
    }
    return { numDataList, wordDataList };
};

const exportedMethods = {
    async onHeartSupply(io) {
        //Supply heart to all users every 30mins
        let result = await users.getAllUsers();
        if (result)
            result.map((user, index) => {
                if (user.heart < 3) {
                    const info = users.addUserValue(user.userName, { heart: 1 });
                    if (!info) console.log('Error occured whild addHeart');
                    else io.to(players[user.userName]).emit('update_userdata', {result: info});
                }
            });
        console.log('Hearts supplied.');
    },

    async onTimeInteval(io) {
        let curDateTime = new Date();
        console.log(getDateTimeString(curDateTime));
        
        rooms.listTournament().then((roomList) => {
            if (roomList.length != 0) {
                for( room in roomList) {
                    const startDateTime = room.startDateTime;
                    if (startDateTime.getDate() != curDateTime.getDate())continue;
                    if (startDateTime.getHours() != curDateTime.getHours())continue;
                    if (startDateTime.getMinutes() != curDateTime.getMinutes())continue;
                    rooms.startRoom({room_id: String(room._id)}).then((result) => {
                        if(result.result) {
                            result.result.joinUsers.map(async(user, index) => {
                                users.delUserValue(user.userName, {coin: result.result.joiningFee, heart: 1}).then((userData) => {
                                    socket.to(players[user.userName]).emit('update_userdata', {result: userData.result});
                                });
                            });
                            getMultiRandomData().then(({numDataList, wordDataList}) => {
                                io.to(`game_of_${room._id}`).emit('online_start', {
                                    result: {roomId: String(room._id), timeOut: result.result.timeOut, prize: result.result.prize},
                                    gameData: { numData: numDataList, wordData: wordDataList }
                                });
                            });
                        }
                        else {
                            console.log("Tournament automatically closed because it's not ready yet");
                        }
                    });
                }
            }
        });
    },

    async useSocket(io) {
        io.on('connection', socket => {
            console.log('a user connected');

            // Auto login if the socket has session with username
            const userNameInSession = socket.handshake.session.username;
            if (userNameInSession) {
                players[userNameInSession] = {
                    socketId: socket.id,
                };
                socket.handshake.session.status = 'Idle';
                socket.emit('update_userdata', { isRefresh: true });
            }

            socket.on('disconnect', async() => {
                console.log('user disconnected');

                const userNameInSession = socket.handshake.session.username;
                if (userNameInSession) {
                    // Get the room Id which this user is joined in
                    const joinedInfo = await rooms.getJoinRoomIdByUserName(userNameInSession);
                    switch (socket.handshake.session.status) {
                        case 'Tournament':
                        case 'Battle':
                            // If tournament is not started yet, perform leave from tournament
                            if (!joinedInfo.isStarted) {
                                await rooms.leaveRoom({username: userNameInSession, room_id: joinedInfo.roomId});
                                break;
                            }
                            // REQUIRE INFO: data.username, data.room_id, data.point, (data.coin, data.heart)OPTIONAL
                            const room = await rooms.endRoom({username: userNameInSession, room_id: joinedInfo.roomId, point: 0});
                            if (room.result) {
                                await rooms.leaveRoom({username: userNameInSession, room_id: joinedInfo.roomId}, /*isForce:*/true);
                                if(room.allIsOver) {
                                    socket.to(`game_of_${joinedInfo.roomId}`).emit('online_end', {
                                        result: true,
                                        winner: room.result.winner,
                                        winnerPoint: room.result.winnerPoint
                                    });
                                } else if (room.allIsEnd) {
                                    socket.to(`game_of_${joinedInfo.roomId}`).emit('online_end', {
                                        result: true,
                                        winner: room.result.winner,
                                        winnerPoint: room.result.winnerPoint
                                    });
                                    if (room.result.winner.length != 0)
                                        users.addUserValue(room.result.winner[0],
                                            {
                                                point: room.result.winnerPoint[0],
                                                coin: room.result.prize,
                                                heart: 1,
                                            }).then((user) => {
                                                socket.to(players[room.result.winner[0]]).emit('update_userdata', {result: user});
                                        });
                                    io.sockets.clients(`game_of_${joinedInfo.roomId}`).forEach(function(client){
                                        client.leave(`game_of_${joinedInfo.roomId}`);
                                        client.handshake.session.status = 'Idle';
                                    });
                                }
                            }
                            await rooms.removeRoom({room_id: joinedInfo.roomId});
                            socket.leave(`game_of_${joinedInfo.roomId}`);
                            break;
                        case 'Waiting':
                            await rooms.removeRoom({room_id: joinedInfo.roomId});
                            socket.leave(`game_of_${joinedInfo.roomId}`);
                            break;
                    }

                    // Set PLAYERS value of this user as 'undefined' to remove the user from PLAYERS Object
                    players[userNameInSession] = undefined;
                }
            });

            socket.on('login', (data) => {
                // REQUIRE INFO: data.username and data.password
                console.log('login request recevied');

                users.getUserByName(data.username, data.password).then((result) => {
                    if (result) {
                        players[data.username] = socket.id;
                        socket.handshake.session.status = 'Idle';
                        socket.handshake.session.username = data.username;
                        socket.emit('login', { result: result });
                        // console.log(`${data.username} is logged`);
                    } else {
                        socket.emit('login', { result: false });
                        // console.log(`${data.username} is not logged`);
                    }
                });
            });

            socket.on('register', (data) => {
                // REQUIRE INFO: data.username and data.password and data.email
                console.log('register request is received');
                if (data.username == 'tournament') {
                    socket.emit('register', {result: false, error: 'The user name is not allowed. Please use other name.'});
                    return;
                }

                users.addUser(data).then((result) => {
                    if(result.result) {
                        socket.emit('register', {result: true});
                    } else {
                        socket.emit('register', {result: false, error: result.error});
                    }
                });
            });

            socket.on('stage_start', (data) => {
                // REQUIRE INFO: data.username
                console.log('stage_start request recevied');
                users.delUserValue(data.username, {heart: 1}).then((user) => {
                    if (user.result) {
                        const numData = puzzle.getNumberData();
                        puzzle.getWordData().then((wordData) => {
                            socket.handshake.session.status = 'Stage';
                            socket.emit('stage_start', {
                                result: true,
                                gameData: { numData: [numData], wordData: [wordData] }
                            });
                            socket.emit('update_userdata', {result: user.result});
                        });
                        console.log(`${data.username} start stage`);
                    } else {
                        socket.emit('stage_start', { result: false, error: user.error });
                        console.log(`${data.username} failure to start stage`);
                    }
                });
            });

            socket.on('standalone_end', (data) => {
                // REQUIRE INFO: data.username and user value; data.coin or data.point or data.heart
                console.log('standalone_end request recevied : ', data);

                users.addUserValue(data.username, data).then((user) => {
                    if (user) socket.emit('update_userdata', {result: user});
                    else console.log(`${data.username} could not find while process standalone_end`);
                });
                socket.handshake.session.status = 'Idle';
            });

            socket.on('daily_start', (data) => {
                // REQUIRE INFO: data.username
                console.log('daily_start request recevied');
                // get curDay
                const now = new Date();
                users.delUserValue(data.username, {now_day: now.getDay()}).then((user) => {
                    if (user.result) {
                        const numData = puzzle.getNumberData();
                        puzzle.getWordData().then((wordData) => {
                            socket.handshake.session.status = 'Daily';
                            socket.emit('daily_start', {
                                result: true,
                                gameData: { numData: [numData], wordData: [wordData] }
                            });
                        });
                        console.log(`${data.username} start daily`);
                    } else {
                        socket.emit('daily_start', { result: false, error: user.error });
                        console.log(`${data.username} failure to start daily`);
                    }
                });
            });

            // socket.on('daily_end', (data) => {
            //     // REQUIRE INFO: data.username and user value; data.coin or data.point
            //     console.log('daily_end request recevied : ', data);

            //     users.addUserValue(data.username, data).then((user) => {
            //         if (user) socket.emit('update_userdata', {result: user});
            //         else console.log(`${data.username} could not find while process daily_end`);
            //     });
            //     socket.handshake.session.status = 'Idle';
            // });

            socket.on('tournament_list', () => {
                // REQUIRE INFO:
                console.log('tournament_list request received');

                rooms.listTournament().then((roomList) => {
                    if (!roomList.length) {
                        socket.emit('tournament_list', { result: false });
                    } else {
                        let list = [];
                        for( room in roomList) {
                            list.push({
                                joiningFee: room.joiningFee,
                                startDateTime: getDateTimeString(room.startDateTime),
                                prize: room.prize,
                            });
                        }
                        socket.emit('tournament_list', { result: list});
                    }
                });
            });

            socket.on('tournament_in', (data) => {
                // REQUIRE INFO: data.username and "tournament room id"=data.room_id
                console.log('tournament_in request received');

                rooms.joinRoom(data).then((room) => {
                    if (!room.error) {
                        socket.handshake.session.status = 'Tournament';
                        socket.emit('tournament_in', { result: true });
                        socket.join(`game_of_${data.room_id}`);
                        console.log(`${data.username} is joined tournament`);
                    } else {
                        socket.emit('tournament_in', { result: false, error: room.error });
                        console.log(`${ data.username } couldn 't join tournament because ${room.error}`);
                    }
                });
            });

            socket.on('tournament_out', (data) => {
                // REQUIRE INFO: data.username and "tournament room id"=data.room_id
                console.log('tournament_out request received');

                rooms.leaveRoom(data).then((room) => {
                    if (!room.error) {
                        socket.emit('tournament_out', { result: true });
                        socket.leave(`game_of_${data.room_id}`);
                        console.log(`${data.username} is leaved tournament`);
                        socket.handshake.session.status = 'Idle';
                    } else {
                        socket.emit('tournament_out', { result: false, error: room.error });
                        console.log(`${ data.username } couldn 't leave tournament because ${room.error}`);
                    }
                });
            });

            socket.on('online_end', (data) => {
                // REQUIRE INFO: data.username, data.room_id, data.point, (data.coin, data.heart)OPTIONAL
                console.log('online_end request received');
                rooms.endRoom(data).then(async(room) => {
                    if (room.result) {
                        if(room.allIsOver) {
                            socket.to(`game_of_${data.room_id}`).emit('online_end', {
                                result: true,
                                winner: room.result.winner,
                                winnerPoint: room.result.winnerPoint
                            });
                            socket.emit('online_end', {
                                result: true,
                                winner: room.result.winner,
                                winnerPoint: room.result.winnerPoint
                            });
                            // console.log('All users are overed');
                        } else if (room.allIsEnd) {
                            socket.to(`game_of_${data.room_id}`).emit('online_end', {
                                result: true,
                                winner: room.result.winner,
                                winnerPoint: room.result.winnerPoint
                            });
                            socket.emit('online_end', {
                                result: true,
                                winner: room.result.winner,
                                winnerPoint: room.result.winnerPoint
                            });
                            if (room.result.winner.length != 0)
                                users.addUserValue(room.result.winner[0],
                                    {
                                        point: room.result.winnerPoint[0],
                                        coin: room.result.prize,
                                        heart: 1,
                                    }).then((user) => {
                                        socket.to(players[room.result.winner[0]]).emit('update_userdata', {result: user});
                                });
                            io.sockets.clients(`game_of_${data.room_id}`).forEach(function(client){
                                client.leave(`game_of_${data.room_id}`);
                                client.handshake.session.status = 'Idle';
                            });
                            socket.handshake.session.status = 'Idle';
                            // console.log('All users are ended');

                            await rooms.removeRoom({room_id: data.room_id});
                        }
                        console.log('end is processed');
                    } else {
                        socket.emit('online_end', { result: false, error: room.error });
                        console.log('the room could not end');
                    }
                });
            });    

            socket.on('invite_request', (data) => {
                //REQUIRE INFO: data.username, data.inviteuser
                console.log('invite_request is received');
                if (players[data.inviteuser] === undefined) {
                    console.log('invite user is not connected.');
                    socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Invite user is offline.'});
                } else if (socket.to(players[data.inviteuser]).handshake.session.status != 'Idle') {
                    console.log('invite user is playing game now.');
                    socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Invite user is playing now.'});
                } else {
                    rooms.createRoom({username: data.username}).then((result) => {
                        if (result) {
                            console.log('invite_request is sent.');
                            socket.join(`game_of_${result.id}`);
                            socket.emit('invite_request', {result: result, to: data.inviteuser});
                            if(players[data.inviteuser])
                                socket.to(players[data.inviteuser]).emit('invite_request', {result: result, from: data.username});
                            socket.handshake.session.status = 'Battle';
                        } else {
                            socket.emit('invite_request', { result: false, to: data.inviteuser, error: 'Could not create room.' });
                            console.log(`invite_request request of ${data.username} is failed`);
                        }
                    });
                }
            });

            socket.on('invite_accept', (data) => {
                // REQUIRE INFO: data.waituser(waiting user), data.inviteuser(accepting user), data.roomId
                console.log('invite_accept request received');
                if (players[data.waituser] === undefined) {
                    console.log('wait user is not connected.');
                    socket.emit('invite_accept', {result: false, error: 'Wait user is offline.'});
                } else if (socket.to(players[data.waituser]).handshake.session.status != 'Battle') {
                    console.log('invite user canceled battle.');
                    socket.emit('invite_accept', {result: false, error: 'Wait user canceled battle.'});
                } else {
                    rooms.joinRoom({room_id: data.roomId, username: data.inviteuser}).then((result) => {
                        if (result.error) {
                            socket.emit('invite_accept', { result: false, error: result.error });
                            if(players[data.waituser]) {
                                socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                                socket.to(players[data.waituser]).emit('invite_accept', { result: false, error: result.error });
                            }
                            console.log(`invite_accept request of ${data.inviteuser} is failed`);
                        }

                        rooms.startRoom({room_id: data.roomId}).then((result) => {
                            if (result.result) {
                                result.result.joinUsers.map(async(user, index) => {
                                    users.delUserValue(user.userName, {coin: result.result.joiningFee, heart: 1}).then((userData) => {
                                        socket.to(players[user.userName]).emit('update_userdata', {result: userData.result});
                                    });
                                });
                                socket.join(`game_of_${data.roomId}`);
                                socket.handshake.session.status = 'Battle';
                                getMultiRandomData().then(({numDataList, wordDataList}) => {
                                    socket.to(`game_of_${room._id}`).emit('online_start', {
                                        result: {roomId: String(room._id), timeOut: result.result.timeOut, prize: result.result.prize},
                                        gameData: { numData: numDataList, wordData: wordDataList }
                                    });
                                    socket.emit('online_start', {
                                        result: {roomId: String(room._id), timeOut: result.result.timeOut, prize: result.result.prize},
                                        gameData: { numData: numDataList, wordData: wordDataList }
                                    });
                                });
                            } else {
                                socket.emit('invite_accept', { result: false });
                                if(players[data.waituser]) {
                                    socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                                    socket.to(players[data.waituser]).emit('invite_accept', { result: false, error: result.error });
                                }
                                console.log('the room could not start');
                            }
                        });
                    });
                }
            });

            socket.on('invite_reject', (data) => {
                // REQUIRE INFO: data.waituser(waiting user), data.inviteuser(accepting user), data.roomId
                console.log('invite_reject request received');
                rooms.removeRoom({room_id: data.roomId}).then((result) => {
                    if (result.result) {
                        // socket.emit('invite_reject', { result: true });
                        socket.to(`game_of_${data.roomId}`).emit('invite_reject', { result: true });
                        if(players[data.waituser] && socket.to(players[data.waituser]).handshake.session.status == 'Battle') {
                            socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                            socket.to(players[data.waituser]).emit('invite_reject', { result: true });
                            socket.to(players[data.waituser]).handshake.session.status = 'Idle';
                        }
                    } else {
                        // socket.emit('invite_reject', { result: false });
                        console.log(`invite_reject request of ${data.inviteuser} is failed`);
                    }
                });
            });

            socket.on('invite_cancel', (data) => {
                // REQUIRE INFO: data.username(waiting user), data.roomId
                console.log('invite_cancel request received');
                rooms.removeRoom({room_id: data.roomId}).then((result) => {
                    if (result.result) {
                        // socket.emit('invite_cancel', { result: true });
                        // socket.to(`game_of_${data.roomId}`).emit('invite_cancel', { result: true });
                        socket.leave(`game_of_${data.roomId}`);
                        socket.handshake.session.status = 'Idle';
                        // if(players[data.inviteuser])
                        //     socket.to(players[data.inviteuser]).leave(`game_of_${data.roomId}`);
                    } else {
                        // socket.emit('invite_cancel', { result: false });
                        console.log(`invite_cancel request of ${data.waituser} is failed`);
                    }
                });
            });

            socket.on('random_request', async(data) => {
                // REQUIRE INFO: data.username
                console.log('random_request is received');
                for (const username in players) {
                    if(username == data.username || !players[username]) continue;
                    if(socket.to(players[username]).handshake.session.status == 'Waiting') {
                        //join to players[username];
                        const roomId = socket.to(players[username]).handshake.session.createdRoomId;
                        const result = await rooms.joinRoom({room_id: roomId, username: data.username});
                        if(!result.error) {
                            socket.join(`game_of_${roomId}`);
                            await rooms.startRoom({room_id: roomId});
                            getMultiRandomData().then(({numDataList, wordDataList}) => { 
                                socket.to(players[username]).handshake.session.status = 'Battle';
                                socket.handshake.session.status = 'Battle';
                                socket.emit('battle_start', { result: roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                                socket.to(`game_of_${roomId}`)
                                    .emit('battle_start', { result: roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                            });
                            return;
                        }
                    }
                }
                
                rooms.createRoom({username: data.username}).then((result) => {
                    if (result) {
                        console.log('random_request is sent.');
                        socket.join(`game_of_${result.id}`);
                        socket.emit('random_request', {result: result.id});
                        socket.handshake.session.status = 'Waiting';
                        socket.handshake.session.createdRoomId = result.id;
                    } else {
                        socket.emit('random_request', { result: false, error: 'Could not create room.'  });
                        console.log(`random_request request of ${data.username} is failed`);
                    }
                });
            });

            socket.on('random_cancel', (data) => {
                // REQUIRE INFO: data.username(waiting user), data.roomId
                console.log('random_cancel is received');
                rooms.removeRoom({room_id: data.roomId}).then((result) => {
                    if (result) {
                        console.log('random_cancel is sent.');
                        socket.leave(`game_of_${data.roomId}`);
                        // socket.emit('random_cancel', {result: true});
                        socket.handshake.session.status = 'Idle';
                    } else {
                        // socket.emit('random_cancel', { result: false });
                        console.log(`random_cancel request of ${data.username} is failed`);
                    }
                });
            });

            socket.on('passion_start', (data) => {
                // REQUIRE INFO: data.username
                console.log('passion_start request is received');
                // get curHour
                const now = new Date();
                users.delUserValue(data.username, {now_hour: now.getHours()}).then((user) => {
                    if(user.result) {
                        socket.emit('passion_start', {result: true});
                        socket.handshake.session.status = 'Passion';
                    }
                    else socket.emit('passion_start', {result: false, error: user.error});
                });
            });
            
            // socket.on('passion_end', (data) => {
            //     // REQUIRE INFO: data.username and user value; data.coin or data.point
            //     console.log('passion_end request recevied : ', data);

            //     users.addUserValue(data.username, data).then((user) => {
            //         if (user) socket.emit('update_userdata', {result: user});
            //         else console.log(`${data.username} could not find while process passion_end`);
            //     });
            //     socket.handshake.session.status = 'Idle';
            // });
        });
    },
};

module.exports = exportedMethods;