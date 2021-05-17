const data = require('../data/');
const puzzle = require('./puzzle');
const nodemailer = require('nodemailer');

const infos = data.infos;
const users = data.users;
const rooms = data.rooms;

const players = {};
const sentVerifyCode = {};

const getDateTimeString = (date) => {

    const pad = (s) => (s < 10 ? '0' + s : s);
    const dateString = [
        pad(date.getDate()),
        pad(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
    const timeString = [pad(date.getHours()), pad(date.getMinutes())].join(':');

    return dateString + ' ' + timeString;
}

const getMultiRandomData = async () => {
    let numDataList = [], wordDataList = [];
    for (let i = 0; i < 5; i++) {
        const numData = puzzle.getNumberData();
        const wordData = await puzzle.getWordData();
        numDataList.push(numData);
        wordDataList.push(wordData);
    }
    return { numDataList, wordDataList };
};

const transporter = nodemailer.createTransport(
        {
            host: 'localhost',
            port: 25,
            auth: {
                user: 'chilerac@chileracing.net',
                pass: 'oE667Pnt4k'
            },
        }
    );
  
const sendVerifyCode = (user) => {
    const vCode = 10000 + Math.floor(Math.random() * (99999 - 10000 + 1));

    const mailOptions = {
        from: 'chilerac@chileracing.net',
        to: user,
        subject: 'Verifying for Quiz puzzle game user',
        text: vCode
    };
    
    return new Promise(function(resolve, reject) {
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log('Email sent: ' + info.response);
            resolve(vCode);
        }
        });
    });
}


const exportedMethods = {
    async onHeartSupply(io) {
        //Supply heart to all users every 30mins
        await users.updateUserRank();
        let result = await users.getAllUsers();
        if (result)
            result.map(async (user, index) => {
                var date = new Date();
                var minutes = date.getMinutes();
                var old = user.revive + 30;
                if (user.heart < 3 && ( (user.revive - minutes) <= 30 && (user.revive - minutes) >= 1) || old <= minutes) {
                    const info = await users.addUserValue(user.userName, { heart: 1 });
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
                for ( i in roomList) {
                    const room = roomList[i];
                    const startDateTime = new Date(room.startDateTime);
                    if (startDateTime.getDate() != curDateTime.getDate())continue;
                    if (startDateTime.getHours() != curDateTime.getHours())continue;
                    if (startDateTime.getMinutes() != curDateTime.getMinutes())continue;
                    rooms.startRoom({room_id: String(room._id)}).then(async(result) => {
                        if(result.result) {
                            // result.result.joinUsers.map(async(user, index) => {
                            //     users.delUserValue(user.userName, {coin: result.result.joiningFee, heart: 1}).then((userData) => {
                            //         io.to(players[user.userName]).emit('update_userdata', {result: userData.result});
                            //     });
                            // });
                            joinusers = result.result.joinUsers;
                            if (joinusers.length == 0) { console.log('No one is joined tournament'); }
                            else {
                                for (j in joinusers) {
                                    if (players[joinusers[j].userName] == undefined) {
                                        await rooms.leaveRoom({username: joinusers[j].userName, room_id: result.result._id});
                                    } else {
                                        io.sockets.sockets.get(players[joinusers[j].userName]).handshake.session.status = 'Tournament';
                                        io.sockets.sockets.get(players[joinusers[j].userName]).handshake.session.cur_step = 0;
                                    }
                                }
                                getMultiRandomData().then(({numDataList, wordDataList}) => {
                                    io.in(`game_of_${String(room._id)}`).emit('online_start', {
                                        result: {roomId: String(room._id)},
                                        gameData: { numData: numDataList, wordData: wordDataList, prize: room.prize }
                                    });
                                });
                            }
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
                players[userNameInSession] = socket.id;
                socket.handshake.session.status = 'Idle';
                socket.emit('update_userdata', { isRefresh: true });
                rooms.listTournament().then((roomList) => {
                    if (roomList.length != 0) {
                        for ( i in roomList) {
                            const room = roomList[i];
                            for(j in room.joinUsers) {
                                if (room.joinUsers[j].userName == userNameInSession){
                                    socket.join(`game_of_${String(room._id)}`);
                                } 
                            }
                        }
                    }
                });
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
                            // if (!joinedInfo.isStarted) {
                            //     await rooms.leaveRoom({username: userNameInSession, room_id: joinedInfo.roomId});
                            //     break;
                            // }
                            // REQUIRE INFO: data.username, data.room_id, data.point, data.step, (data.coin, data.heart)OPTIONAL
                            const room = await rooms.endRoom({username: userNameInSession, room_id: joinedInfo.roomId, step: socket.handshake.session.cur_step + 1, point: 0});
                            if (room.result) {
                                await rooms.leaveRoom({username: userNameInSession, room_id: joinedInfo.roomId}, /*isForce:*/true);
                                if (room.allIsEnd) {
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
                                                io.to(players[room.result.winner[0]]).emit('update_userdata', {result: user.result});
                                        });
                                    for (joinuser of room.result.joinUsers) {
                                        if (!players[joinuser]) continue;
                                        const client = io.sockets.sockets.get(players[joinuser]);
                                        client.leave(`game_of_${joinedInfo.roomId}`);
                                        client.handshake.session.status = 'Idle';
                                    }
                                } else if(room.allIsOver) {
                                    socket.to(`game_of_${joinedInfo.roomId}`).emit('online_end', {
                                        result: true,
                                        winner: room.result.winner,
                                        winnerPoint: room.result.winnerPoint
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

            socket.on('logout', (data) => {
                // REQUIRE INFO: data.username
                console.log('logout request recevied');
                // Set PLAYERS value of this user as 'undefined' to remove the user from PLAYERS Object
                socket.handshake.session.username = undefined;
                players[userNameInSession] = undefined;
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
                        rooms.listTournament().then((roomList) => {
                            if (roomList.length != 0) {
                                for ( i in roomList) {
                                    const room = roomList[i];
                                    for(j in room.joinUsers) {
                                        if (room.joinUsers[j].userName == data.username){
                                            socket.join(`game_of_${String(room._id)}`);
                                        } 
                                    }
                                }
                            }
                        });
                    } else {
                        socket.emit('login', { result: false });
                        // console.log(`${data.username} is not logged`);
                    }
                });
            });

            socket.on('forgot', (data) => {
                // REQUIRE INFO: data.username
                console.log('forgot request recevied');

                users.getUserByName(data.username).then((result) => {
                    if (result) {
                        // Send verify code to user
                        sendVerifyCode(result.email).then(
                            vCode => {
                                sentVerifyCode[data.username] = vCode;
                                socket.emit('forgot', { result: true });
                            },
                            error => socket.emit('forgot', { result: false })
                          );
                    } else {
                        socket.emit('forgot', { result: false });
                    }
                });
            });

            socket.on('verify', (data) => {
                // REQUIRE INFO: data.username and data.code
                console.log('verify request recevied');

                if (sentVerifyCode[data.username] != undefined) {
                    // Send verified to user
                    if (sentVerifyCode[data.username] == data.code)
                        socket.emit('verify', { result: true });
                    else
                        socket.emit('verify', { result: false });
                } else {
                    socket.emit('verify', { result: false });
                }
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

            socket.on('google', (data) => {
                // REQUIRE INFO: data.google_info
                console.log('google request is received');
                users.getUserByName(data.google_info.email).then((user) => {
                    let userData = {username: data.google_info.email, email: data.google_info.email, password: '0000'};
                    if (!user) {
                        users.addUser(userData).then((result) => {
                            if(result.result) {
                                players[userData.username] = socket.id;
                                socket.handshake.session.status = 'Idle';
                                socket.handshake.session.username = userData.username;
                                socket.emit('login', { result: result.user });
                                // console.log(`${data.username} is logged`);
                                rooms.listTournament().then((roomList) => {
                                    if (roomList.length != 0) {
                                        for ( i in roomList) {
                                            const room = roomList[i];
                                            for(j in room.joinUsers) {
                                                if (room.joinUsers[j].userName == userData.username){
                                                    socket.join(`game_of_${String(room._id)}`);
                                                } 
                                            }
                                        }
                                    }
                                });
                            } else {
                                socket.emit('login', {result: false, error: result.error});
                            }
                        });
                    } else {
                        players[userData.username] = socket.id;
                        socket.handshake.session.status = 'Idle';
                        socket.handshake.session.username = userData.username;
                        socket.emit('login', { result: user });
                        // console.log(`${data.username} is logged`);
                        rooms.listTournament().then((roomList) => {
                            if (roomList.length != 0) {
                                for ( i in roomList) {
                                    const room = roomList[i];
                                    for(j in room.joinUsers) {
                                        if (room.joinUsers[j].userName == userData.username){
                                            socket.join(`game_of_${String(room._id)}`);
                                        } 
                                    }
                                }
                            }
                        });
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
                    if (user) socket.emit('update_userdata', {result: user.result});
                    else console.log(`${data.username} could not find while process standalone_end`);
                });
                socket.handshake.session.status = 'Idle';
            });

            socket.on('daily_start', (data) => {
                // REQUIRE INFO: data.username
                console.log('daily_start request recevied');
                // get curDay
                const now = new Date();
                users.delUserValue(data.username, {now_day: now.getDate()}).then((user) => {
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

            socket.on('tournament_list', () => {
                // REQUIRE INFO:
                console.log('tournament_list request received');

                rooms.listTournament().then((roomList) => {
                    if (!roomList.length) {
                        socket.emit('tournament_list', { result: false });
                    } else {
                        let joinList = [];
                        let resData = [];
                        for ( i in roomList) {
                            const room = roomList[i];
                            const data = {
                                id: String(room._id),
                                _id: room._id,
                                startDateTime: room.startDateTime,
                                prize: room.prize,
                                joiningFee: room.joiningFee,
                                joinUsers: room.joinUsers
                            };
                            resData.push(data);
                            if (room.joinUsers.indexOf(socket.handshake.session.username) != -1) joinList.push(i);
                        }
                        socket.emit('tournament_list', { result: resData, joinList});
                    }
                });
            });

            socket.on('tournament_in', (data) => {
                // REQUIRE INFO: data.username and "tournament room id"=data.room_id
                console.log('tournament_in request received');

                rooms.joinRoom(data).then((room) => {
                    if (!room.error) {
                        users.delUserValue(data.username, {coin: room.result.joiningFee, heart: 1}).then(async(userData) => {
                            if (!userData.result) {
                                await rooms.leaveRoom(data);
                                socket.emit('tournament_in', { result: false, error: userData.error });
                                console.log(`${ data.username } couldn 't join tournament because ${userData.error}`);
                            } else {
                                socket.emit('update_userdata', {result: userData.result});
                                // socket.handshake.session.status = 'Tournament';
                                socket.emit('tournament_in', { result: true, room_id: data.room_id });
                                socket.join(`game_of_${data.room_id}`);
                                console.log(`${data.username} is joined tournament`);
                            }
                        });
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
                        if ( room.result === true) {
                            socket.emit('tournament_out', { result: true, room_id: data.room_id });
                            socket.leave(`game_of_${data.room_id}`);
                            console.log(`${data.username} is leaved tournament`);
                            socket.handshake.session.status = 'Idle';
                        } else {
                            users.addUserValue(data.username, {coin: room.result.joiningFee, heart: 1}).then((userData) => {
                                if (!userData.result) {
                                    socket.emit('tournament_out', { result: false, error: userData.error });
                                    console.log(`${ data.username } couldn 't leave tournament because ${userData.error}`);
                                } else {
                                    socket.emit('update_userdata', {result: userData.result});
                                    socket.emit('tournament_out', { result: true, room_id: data.room_id });
                                    socket.leave(`game_of_${data.room_id}`);
                                    console.log(`${data.username} is leaved tournament`);
                                    socket.handshake.session.status = 'Idle';
                                }
                            });
                        }
                    } else {
                        socket.emit('tournament_out', { result: false, error: room.error });
                        console.log(`${ data.username } couldn 't leave tournament because ${room.error}`);
                    }
                });
            });

            socket.on('online_end', (data) => {
                // REQUIRE INFO: data.username, data.room_id, data.point, data.step(1~10), (data.coin, data.heart)OPTIONAL
                console.log('online_end request received');
                rooms.endRoom(data).then(async(room) => {
                    if (room.result) {
                        socket.handshake.session.cur_step = data.step;
                        if (room.allIsEnd) {
                            io.in(`game_of_${data.room_id}`).emit('online_end', {
                                result: true,
                                winner: room.result.winner,
                                winnerPoint: room.result.winnerPoint
                            });
                            if (room.result.winner.length != 0) {
                                const user = await users.addUserValue(room.result.winner[0],
                                    {
                                        point: room.result.winnerPoint[0],
                                        coin: room.result.prize,
                                        heart: 1,
                                    });
                                io.to(players[room.result.winner[0]]).emit('update_userdata', {result: user.result});
                            }
                            for( joinuser of room.result.joinUsers) {
                                if (!players[joinuser]) continue;
                                const client = io.sockets.sockets.get(players[joinuser]);
                                client.leave(`game_of_${data.room_id}`);
                                client.handshake.session.status = 'Idle';
                            };
                            socket.handshake.session.status = 'Idle';
                            // console.log('All users are ended');

                            await rooms.removeRoom({room_id: data.room_id});
                        } else if(room.allIsOver) {
                            io.in(`game_of_${data.room_id}`).emit('online_end', {
                                result: true,
                                winner: room.result.winner,
                                winnerPoint: room.result.winnerPoint
                            });
                            // console.log('All users are overed');
                        }
                        console.log('end is processed');
                    } else {
                        socket.emit('online_end', { result: false, error: room.error });
                        console.log('the room could not end');
                    }
                });
            });    

            socket.on('invite_request', (data) => {
                //REQUIRE INFO: data.waituser, data.inviteuser
                console.log('invite_request is received');
                if (players[data.inviteuser] === undefined) {
                    console.log('invite user is not connected.');
                    socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Invite user is offline.'});
                } else if (io.sockets.sockets.get(players[data.inviteuser]).handshake.session.status != 'Idle') {
                    console.log('invite user is playing game now.');
                    socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Invite user is playing now.'});
                } else {
                    users.getUserByName(data.waituser).then((user) => {
                        if (!user) {
                            console.log('user could not find');
                            socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'User could not find'});
                        } else {
                            if (user.heart == 0 || user.coin < 3) {
                                console.log('Need more coin or heart is zero');
                                socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Need more coin or heart is zero'});
                            } else {
                                rooms.createRoom({username: data.waituser}).then((result) => {
                                    if (result) {
                                        console.log('invite_request is sent.');
                                        socket.join(`game_of_${result.id}`);
                                        socket.emit('invite_request', {result: {roomId: result.id}, to: data.inviteuser});
                                        if(players[data.inviteuser])
                                            io.to(players[data.inviteuser]).emit('invite_request', {result: {roomId: result.id}, from: data.waituser});
                                        socket.handshake.session.status = 'Battle';
                                    } else {
                                        socket.emit('invite_request', { result: false, to: data.inviteuser, error: 'Could not create room.' });
                                        console.log(`invite_request request of ${data.waituser} is failed`);
                                    }
                                });
                            }
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
                } else if (io.sockets.sockets.get(players[data.waituser]).handshake.session.status != 'Battle') {
                    console.log('wait user canceled battle.');
                    socket.emit('invite_accept', {result: false, error: 'Wait user canceled battle.'});
                } else {
                    users.getUserByName(data.inviteuser).then((user) => {
                        if (!user) {
                            console.log('user could not find');
                            socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'User could not find'});
                        } else {
                            if (user.heart == 0 || user.coin < 3) {
                                console.log('Need more coin or heart is zero');
                                socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Need more coin or heart is zero'});
                            } else {
                                rooms.joinRoom({room_id: data.roomId, username: data.inviteuser}).then((room) => {
                                    if (room.error) {
                                        socket.emit('invite_accept', { result: false, error: room.error });
                                        if(players[data.waituser]) {
                                            io.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                                            io.to(players[data.waituser]).emit('invite_accept', { result: false, error: room.error });
                                        }
                                        console.log(`invite_accept request of ${data.inviteuser} is failed`);
                                    }
            
                                    rooms.startRoom({room_id: data.roomId}).then((result) => {
                                        if (result.result) {
                                            result.result.joinUsers.map(async(user, index) => {
                                                users.delUserValue(user.userName, {coin: result.result.joiningFee, heart: 1}).then((userData) => {
                                                    io.to(players[user.userName]).emit('update_userdata', {result: userData.result});
                                                    io.sockets.sockets.get(players[user.userName]).handshake.session.cur_step = 0;
                                                });
                                            });
                                            socket.join(`game_of_${data.roomId}`);
                                            socket.handshake.session.status = 'Battle';
                                            socket.handshake.session.cur_step = 0;
                                            getMultiRandomData().then(({numDataList, wordDataList}) => {
                                                users.getUserByName(data.waituser).then((user1) => {
                                                    socket.to(`game_of_${data.roomId}`).emit('online_start', {
                                                        result: {roomId: String(data.roomId)},
                                                        gameData: { numData: numDataList, wordData: wordDataList },
                                                        oppoData: user,
                                                    });
                                                    socket.emit('online_start', {
                                                        result: {roomId: String(data.roomId)},
                                                        gameData: { numData: numDataList, wordData: wordDataList },
                                                        oppoData: user1,
                                                    });
                                                });
                                            });
                                        } else {
                                            socket.emit('invite_accept', { result: false });
                                            if(players[data.waituser]) {
                                                io.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                                                io.to(players[data.waituser]).emit('invite_accept', { result: false, error: result.error });
                                            }
                                            console.log('the room could not start');
                                        }
                                    });
                                });
                            }
                        }
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
                        if(players[data.waituser] && io.sockets.sockets.get(players[data.waituser]).handshake.session.status == 'Battle') {
                            io.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                            io.to(players[data.waituser]).emit('invite_reject', { result: true });
                            io.sockets.sockets.get(players[data.waituser]).handshake.session.status = 'Idle';
                        }
                    } else {
                        // socket.emit('invite_reject', { result: false });
                        console.log(`invite_reject request of ${data.inviteuser} is failed`);
                    }
                });
            });

            socket.on('battle_cancel', (data) => {
                // REQUIRE INFO: data.roomId
                console.log('battle_cancel request received');
                rooms.removeRoom({room_id: data.roomId}).then((result) => {
                    if (result.result) {
                        // socket.emit('battle_cancel', { result: true });
                        // socket.to(`game_of_${data.roomId}`).emit('battle_cancel', { result: true });
                        socket.leave(`game_of_${data.roomId}`);
                        socket.handshake.session.status = 'Idle';
                        // if(players[data.inviteuser])
                        //     io.to(players[data.inviteuser]).leave(`game_of_${data.roomId}`);
                    } else {
                        // socket.emit('battle_cancel', { result: false });
                        console.log(`battle_cancel request of is failed`);
                    }
                });
            });

            socket.on('random_request', (data) => {
                // REQUIRE INFO: data.username
                console.log('random_request is received');
                users.getUserByName(data.username).then(async(user) => {
                    if (!user) {
                        console.log('user could not find');
                        socket.emit('invite_request', {result: false, to: data.username, error: 'User could not find'});
                    } else {
                        if (user.heart == 0 || user.coin < 3) {
                            console.log('Need more coin or heart is zero');
                            socket.emit('invite_request', {result: false, to: data.username, error: 'Need more coin or heart is zero'});
                        } else {
                            for (i in players) {
                                const username = i;
                                if(username == data.username || !players[username]) continue;
                                if(io.sockets.sockets.get(players[username]).handshake.session.status == 'Waiting') {
                                    //join to players[username];
                                    const roomId = io.sockets.sockets.get(players[username]).handshake.session.createdRoomId;
                                    const result = await rooms.joinRoom({room_id: roomId, username: data.username});
                                    if(!result.error) {
                                        socket.join(`game_of_${roomId}`);
                                        await rooms.startRoom({room_id: roomId});
                                        getMultiRandomData().then(({numDataList, wordDataList}) => { 
                                            users.getUserByName(username).then(async(user1) => {

                                                io.sockets.sockets.get(players[username]).handshake.session.status = 'Battle';
                                                io.sockets.sockets.get(players[username]).handshake.session.cur_step = 0;
                                                socket.handshake.session.status = 'Battle';
                                                socket.handshake.session.cur_step = 0;
                                                socket.emit('online_start', { result: {roomId}, oppoData: user1, gameData: { numData: numDataList, wordData: wordDataList } });
                                                socket.to(`game_of_${roomId}`)
                                                    .emit('online_start', { result: {roomId}, oppoData: user, gameData: { numData: numDataList, wordData: wordDataList } });
                                            });
                                        });
                                        return;
                                    }
                                }
                            }
                            
                            rooms.createRoom({username: data.username}).then((result) => {
                                if (result) {
                                    console.log('random_request is sent.');
                                    socket.join(`game_of_${result.id}`);
                                    socket.emit('random_request', {result: {roomId: result.id}});
                                    socket.handshake.session.status = 'Waiting';
                                    socket.handshake.session.createdRoomId = result.id;
                                } else {
                                    socket.emit('random_request', { result: false, error: 'Could not create room.'  });
                                    console.log(`random_request request of ${data.username} is failed`);
                                }
                            });
                        }
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

            socket.on('rank_list', () => {
                // REQUIRE INFO:
                console.log('rank_list request received');

                users.getRankList().then((userList) => {
                    if (!userList.length) {
                        socket.emit('rank_list', { result: false });
                    } else {
                        socket.emit('rank_list', { result: userList });
                    }
                });
            });

            socket.on('rule_content', () => {
                // REQUIRE INFO:
                console.log('rule_content request received');

                infos.getRule().then((rule_content) => {
                    socket.emit('rule_content', { result: rule_content });
                });
            });

            socket.on('method_content', () => {
                // REQUIRE INFO:
                console.log('method_content request received');

                infos.getMethod().then((method_content) => {
                    socket.emit('method_content', { result: method_content });
                });
            });

            socket.on('policy_content', () => {
                // REQUIRE INFO:
                console.log('policy_content request received');

                infos.getPolicy().then((policy_content) => {
                    socket.emit('policy_content', { result: policy_content });
                });
            });
        });
    },
};

module.exports = exportedMethods;