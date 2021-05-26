const data = require('../data/');
const puzzle = require('./puzzle');
const nodemailer = require('nodemailer');

const infos = data.infos;
const users = data.users;
const rooms = data.rooms;

const players = {};
const sentVerifyCode = {};
var socketio = undefined;

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
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
        	auth: {
		        user: 'tuktarov2121@gmail.com',
		        pass: 'dsf14hgd4eGHFD',
	        },
	        tls: {
		        // do not fail on invalid certs
		        rejectUnauthorized: false
	        }
        }
    );
  
const sendVerifyCode = (user) => {
    const vCode = 10000 + Math.floor(Math.random() * (99999 - 10000 + 1));

    const mailOptions = {
        from: 'tuktarov2121@gmail.com',
        to: user,
        subject: 'New password for 1 Word 1 Action',
        text: vCode.toString()
    };
    
    return new Promise(function(resolve, reject) {
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log('Email sent: ' + info.response);
            resolve(vCode.toString());
        }
        });
    });
}

async function onRoomTime(room_id, nStep){
    let cur_room = await rooms.getRoomById(room_id);
    if(cur_room){
        if(cur_room.remainNum + nStep != 10 || cur_room.isClosed == true){
            console.log('skip room');
            return;
        }
        let joinUsers = cur_room.joinUsers;
        for(j in joinUsers) {
            if (joinUsers[j].isOver == false){
                const room = await rooms.endRoom({username: joinUsers[j].userName, room_id: room_id, step: -1, point: 0});
                await rooms.leaveRoom({username: joinUsers[j].userName, room_id: room_id}, /*isForce:*/true);
                const kicked_client = socketio.sockets.sockets.get(players[joinUsers[j].userName]);
                kicked_client.leave(`game_of_${room_id}`);
                kicked_client.emit('kicked');
                console.log('kick ' + joinUsers[j].userName);
                kicked_client.handshake.session.status = 'Idle';
                kicked_client.handshake.session.save();
                if (room.allIsEnd) {
                    socketio.to(`game_of_${room_id}`).emit('online_end', {
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
                                socketio.to(players[room.result.winner[0]]).emit('update_userdata', {result: user.result});
                        });
                    for (joinuser of room.result.joinUsers) {
                        if (!players[joinuser.userName]) continue;
                        const client = socketio.sockets.sockets.get(players[joinuser.userName]);
                        client.leave(`game_of_${room_id}`);
                        client.handshake.session.status = 'Idle';
                        client.handshake.session.save();
                    }
                } else if(room.allIsOver) {
                    socketio.to(`game_of_${room_id}`).emit('online_end', {
                        result: true,
                        winner: room.result.winner,
                        winnerPoint: room.result.winnerPoint
                    });
                    setTimeout( function() {
                        onRoomTime(room_id, nStep+1);
                    }, 80 * 1000);
                }
                await rooms.removeRoom({room_id: room_id});
                kicked_client.leave(`game_of_${room_id}`);
                break;
            } 
        }
    } else {
        console.log('invalid room_id');
    }
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
                    else io.to(players[user.userName]).emit('update_userdata', {result: info.result});
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
                                        io.sockets.sockets.get(players[joinusers[j].userName]).handshake.session.save();
                                    }
                                }
                                getMultiRandomData().then(({numDataList, wordDataList}) => {
                                    io.in(`game_of_${String(room._id)}`).emit('online_start', {
                                        result: {roomId: String(room._id)},
                                        gameData: { numData: numDataList, wordData: wordDataList, prize: room.prize }
                                    });
                                    setTimeout( function(){
                                        onRoomTime(room._id, 1);
                                    }, 80 * 1000);
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
        socketio = io;
        io.on('connection', socket => {
            console.log('a user connected');

            // Auto login if the socket has session with username
            const userNameInSession = socket.handshake.session.username;
            if (userNameInSession) {
                players[userNameInSession] = socket.id;
                socket.handshake.session.status = 'Idle';
                socket.handshake.session.save();
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
                            const room = await rooms.endRoom({username: userNameInSession, room_id: joinedInfo.roomId, step: -1, point: 0});
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
                                    if (!players[joinuser.userName]) continue;
                                    const client = io.sockets.sockets.get(players[joinuser.userName]);
                                    client.leave(`game_of_${joinedInfo.roomId}`);
                                    client.handshake.session.status = 'Idle';
                                    client.handshake.session.save();
                                }
                            } else if(room.allIsOver) {
                                socket.to(`game_of_${joinedInfo.roomId}`).emit('online_end', {
                                    result: true,
                                    winner: room.result.winner,
                                    winnerPoint: room.result.winnerPoint
                                });
                                setTimeout( function(){
                                    onRoomTime(room.result._id, 10-room.result.remainNum);
                                }, 80 * 1000);
                            }
                            await rooms.removeRoom({room_id: joinedInfo.roomId});
                            socket.leave(`game_of_${joinedInfo.roomId}`);
                            break;
                        case 'Waiting':
                            await rooms.removeRoom({room_id: joinedInfo.roomId});
                            socket.leave(`game_of_${joinedInfo.roomId}`);
                            break;
                    }

                    socket.handshake.session.username = undefined;
                    socket.handshake.session.status = 'Idle';
                    socket.handshake.session.save();

                    // Set PLAYERS value of this user as 'undefined' to remove the user from PLAYERS Object
                    players[userNameInSession] = undefined;
                }
            });

            socket.on('logout', (data) => {
                // REQUIRE INFO: data.username
                console.log('logout request recevied');
                // Set PLAYERS value of this user as 'undefined' to remove the user from PLAYERS Object
                socket.handshake.session.username = undefined;
                socket.handshake.session.save();
                players[userNameInSession] = undefined;
            });

            socket.on('login', (data) => {
                // REQUIRE INFO: data.username and data.password
                console.log('login request recevied');

                let bResetPassword = false;
                console.log(data.username);
                console.log(sentVerifyCode[data.username]);
                console.log(data.password);
                if(sentVerifyCode[data.username] != undefined){
                    if(data.password == sentVerifyCode[data.username]){
                        console.log('start resetting');
                        bResetPassword = true;
                        delete sentVerifyCode[data.username];
                    }
                }
                users.getUserByName(data.username, data.password, bResetPassword).then((result) => {
                    if (result) {
                        players[data.username] = socket.id;
                        socket.handshake.session.status = 'Idle';
                        socket.handshake.session.username = data.username;
                        socket.handshake.session.save();
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
                        console.log('try to email' + result.email);
                        sendVerifyCode(result.email).then(
                            vCode => {
                                sentVerifyCode[data.username] = vCode;
                                socket.emit('forgot', { result: true });
                            },
                            error => socket.emit('forgot', { result: false })
                          );
                    } else {
                        console.log(' ' + result.email + ' does not exist');
                        socket.emit('forgot', { result: false });
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

            socket.on('user_update', (data) => {
                // REQUIRE INFO: data.username and data.password and data.email
                console.log('user_update request is received');
                if (data.username == 'tournament') {
                    socket.emit('user_update', {result: false, error: 'The user name is not allowed. Please use other name.'});
                    return;
                }

                users.updateUser(data.prevname, data).then((result) => {
                    if(result.result) {
                        socket.emit('update_userdata', {result: result.result});
                        socket.emit('user_update', {result: true});
                    } else {
                        socket.emit('user_update', {result: false, error: result.error});
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
                                socket.handshake.session.save();
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
                        socket.handshake.session.save();
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
                            socket.handshake.session.save();
                            socket.emit('stage_start', {
                                result: true,
                                gameData: { numData: [numData], wordData: [wordData] }
                            });
                            socket.emit('update_userdata', {result: user.result});
                        });
                        console.log(`${data.username} start stage`);
                    } else {
                        socket.emit('stage_start', { result: false, need_power: user.need_power, error: user.error });
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
                socket.handshake.session.save();
            });

            socket.on('prize', (data) => {
                // REQUIRE INFO: data.username and user value; data.coin or data.point or data.heart
                console.log('prize request recevied : ', data);

                users.addUserValue(data.username, data).then((user) => {
                    if (user) socket.emit('update_userdata', {result: user.result});
                    else console.log(`${data.username} could not find while process prize`);
                });
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
                            socket.handshake.session.save();
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
                            socket.handshake.session.save();
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
                                    socket.handshake.session.save();
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
                        socket.handshake.session.save();
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
                                if (!players[joinuser.userName]) continue;
                                const client = io.sockets.sockets.get(players[joinuser.userName]);
                                client.leave(`game_of_${data.room_id}`);
                                client.handshake.session.status = 'Idle';
                                client.handshake.session.save();
                            };
                            socket.handshake.session.status = 'Idle';
                            socket.handshake.session.save();
                            console.log('All users are ended');

                            await rooms.removeRoom({room_id: data.room_id});
                        } else if(room.allIsOver) {
                            io.in(`game_of_${data.room_id}`).emit('online_end', {
                                result: true,
                                winner: room.result.winner,
                                winnerPoint: room.result.winnerPoint
                            });
                            setTimeout( function(){
                                onRoomTime(data.room_id, data.step+1);
                            }, 80 * 1000);
                            console.log('All users are overed');
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
                    socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Çağırdığınız kullanıcı\nonline değil.'});
                } else if (io.sockets.sockets.get(players[data.inviteuser]).handshake.session.status != 'Idle') {
                    console.log('invite user is playing game now.');
                    socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Invite user is playing now.'});
                } else {
                    users.getUserByName(data.waituser).then((user) => {
                        if (!user) {
                            console.log('user could not find');
                            socket.emit('invite_request', {result: false, to: data.inviteuser, error: 'Online kullanıcı\nbulunamadı'});
                        } else {
                            if (user.heart == 0 || user.coin < 3) {
                                console.log('Need more coin or heart is zero');
                                socket.emit('invite_request', {result: false, to: data.inviteuser, need_power: true, error: 'Need more coin or heart is zero'});
                            } else {
                                rooms.createRoom({username: data.waituser}).then((result) => {
                                    if (result) {
                                        console.log('invite_request is sent.');
                                        socket.join(`game_of_${result.id}`);
                                        socket.emit('invite_request', {result: {roomId: result.id}, to: data.inviteuser});
                                        if(players[data.inviteuser])
                                            io.to(players[data.inviteuser]).emit('invite_request', {result: {roomId: result.id}, from: data.waituser});
                                        socket.handshake.session.status = 'Battle';
                                        socket.handshake.session.save();
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
                                socket.emit('invite_request', {result: false, to: data.inviteuser, need_power: true, error: 'Need more coin or heart is zero'});
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
                                                });
                                            });
                                            socket.join(`game_of_${data.roomId}`);
                                            socket.handshake.session.status = 'Battle';
                                            socket.handshake.session.save();
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
                                                    setTimeout( function(){
                                                        onRoomTime(data.roomId, 1);
                                                    }, 80 * 1000);
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
                            io.sockets.sockets.get(players[data.waituser]).handshake.session.save();
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
                        socket.handshake.session.save();
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
                        socket.emit('random_request', {result: false, to: data.username, error: 'User could not find'});
                    } else {
                        if (user.heart == 0 || user.coin < 3) {
                            console.log('Need more coin or heart is zero');
                            socket.emit('random_request', {result: false, to: data.username, need_power: true, error: 'Need more coin or heart is zero'});
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
                                                io.sockets.sockets.get(players[username]).handshake.session.save();
                                                socket.handshake.session.status = 'Battle';
                                                socket.handshake.session.save();
                                                socket.emit('online_start', { result: {roomId}, oppoData: user1, gameData: { numData: numDataList, wordData: wordDataList } });
                                                socket.to(`game_of_${roomId}`)
                                                    .emit('online_start', { result: {roomId}, oppoData: user, gameData: { numData: numDataList, wordData: wordDataList } });
                                                setTimeout(function () {
                                                    onRoomTime(roomId, 1)
                                                }, 80 * 1000);
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
                                    socket.handshake.session.save();
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
                        socket.handshake.session.save();
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
            //     socket.handshake.session.save();
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