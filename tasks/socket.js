const data = require('../data/');
const puzzle = require('./puzzle');
const users = data.users;
const rooms = data.rooms;
const words = data.words;

const players = {};
const randomPlayers = {};

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
    for(let i = 0; i < 1; i++) {
        const numData = puzzle.getNumberData();
        const wordData = await puzzle.getWordData();
        numDataList.push(numData);
        wordDataList.push(wordData);
    }
    return { numDataList, wordDataList };
};

const exportedMethods = {
    async onTimeInteval(io) {
        let result = await users.getAllUsers();
        if (result)
            result.map((user, index) => {
                if (user.heart < 3) {
                    const info = users.addUserValue(user.username, { heart: 1 });
                    if (!info) console.log('Error occured whild addHeart');
                    else io.emit('update_userdata', info);
                }
            });
        console.log('Hearts supplied.');
    },

    async useSocket(io) {

        let tournamentDateTime = new Date();
        tournamentDateTime.setTime(tournamentDateTime.getTime() + 30000);
        // console.log(getDateTimeString(tournamentDateTime));
        rooms.openTournament().then(() => {
            const timeNumber = setTimeout(() => {
                try {
                    rooms.startTournament().then((result) => {
                        if(result)
                            getMultiRandomData().then(({numDataList, wordDataList}) => {
                                io.to('game_of_tournament').emit('tournament_start', {
                                    result: true,
                                    gameData: { numData: numDataList, wordData: wordDataList }
                                });
                            });
                        else {
                            console.log("Tournament automatically closed because it's not ready yet");
                        }
                    });
                } catch (e) {
                    console.log(`Tournament couldn't start: ${e.message}`);
                }
            }, 30000);
        });

        io.on('connection', socket => {
            console.log('a user connected');
            // if the player doesn't already have an existing session, create a new player
            // (check prevents creating multiple ships when browser auto disconnects
            // and reconnects socket)

            // // create a new player and add it to our players object
            // players[socket.id] = {
            //     playerId: socket.id,
            // };

            // // send the players object to the new player
            // socket.emit('currentPlayers', players);
            // socket.broadcast.emit('newPlayer', players[socket.id]);

            socket.on('disconnect', () => {
                console.log('user disconnected');
                // console.log(socket.handshake.session);
                // remove this player from our players object
                if (socket.handshake.session.game_exists) {
                    const username = socket.handshake.session.username;
                    switch(socket.handshake.session.player_status) {
                        case 'tournament_in':
                            //tournament end
                            rooms.endTournament({username: username, isAlive: false, point: 0}).then((result) => {
                                if (result) {
                                    if(result.allIsOver) {
                                        socket.to('game_of_tournament').emit('tournament_end', {
                                            result: true,
                                            winner: result.result.winner,
                                            winnerPoint: result.result.winnerPoint
                                        });
                                    }
                                } else {
                                    rooms.leaveTournament({username: username});
                                    socket.leave('game_of_tournament');
                                    socket.emit('tournament_out', username);
                                    socket.to('game_of_tournament').emit('tournament_out', username);
                                }
                            });
                            break;
                        case 'stage_start':
                            //stage end
                            users.stopStage(username, {isWin: false, point: 0});
                            break;
                        case 'random_wait':
                            //random end
                            if(randomPlayers[username] && randomPlayers[username].joinUsers == '')
                                rooms.cancelRoom(randomPlayers[username].roomId).then((result) => {
                                    if (result) {
                                        socket.leave(`game_of_${result.id}`);
                                    }
                                    randomPlayers[username] = undefined;
                                });
                            else {
                                rooms.endRoom({roomId: randomPlayers[username].roomId, username: username, isAlive: false, point: 0}).then((result) => {
                                    if (result) {
                                        if(result.allIsOver) {
                                            socket.to(`game_of_${randomPlayers[username].roomId}`).emit('battle_end', {
                                                result: true,
                                                winner: result.result.winner,
                                                winnerPoint: result.result.winnerPoint
                                            });
                                            if(players[randomPlayers[username].joinUser]) socket.to(players[randomPlayers[username].joinUser]).leave(`game_of_${randomPlayers[username].roomId}`);
                                            socket.leave(`game_of_${randomPlayers[username].roomId}`);
                                            randomPlayers[username] = undefined;
                                        } else {
                                            socket.leave(`game_of_${randomPlayers[username].roomId}`);
                                        }
                                    } else {
                                        socket.leave(`game_of_${randomPlayers[username].roomId}`);
                                    }
                                });
                            }
                            break;
                        case 'random_start':
                            //random end
                            let createUser = '';
                            for (const user in randomPlayers) {
                                if(user == username || !randomPlayers[user]) continue;
                                if(randomPlayers[user].joinUser == username) {createUser = user;break;}
                            }
                            if(createUser == '')break;
                            rooms.endRoom({roomId: randomPlayers[createUser].roomId, username: username, isAlive: false, point: 0}).then((result) => {
                                if (result) {
                                    if(result.allIsOver) {
                                        socket.to(`game_of_${randomPlayers[createUser].roomId}`).emit('battle_end', {
                                            result: true,
                                            winner: result.result.winner,
                                            winnerPoint: result.result.winnerPoint
                                        });
                                        if(players[createUser]) socket.to(players[createUser]).leave(`game_of_${randomPlayers[createUser].roomId}`);
                                        socket.leave(`game_of_${randomPlayers[createUser].roomId}`);
                                        randomPlayers[createUser] = undefined;
                                    } else {
                                        socket.leave(`game_of_${randomPlayers[createUser].roomId}`);
                                    }
                                } else {
                                    socket.leave(`game_of_${randomPlayers[createUser].roomId}`);
                                }
                            });
                            break;
                    }
                    //daily end
                    //invite end
                    players[username] = undefined;
                    socket.handshake.session.game_exists = false;
                    // console.log(players);
                    console.log(randomPlayers);
                    // console.log(socket.handshake.session);
                    socket.handshake.session.save();
                }
            });

            socket.on('login', (data) => {
                // console.log('login request recevied');
                if(!players[data.username])
                    users.getUserByName(data.username, data.password).then((result) => {
                        if (result) {
                            if (!socket.handshake.session.game_exists) {
                                players[data.username] = socket.id;
                                socket.handshake.session.game_exists = true;
                                socket.handshake.session.player_status = 'login';
                                socket.handshake.session.username = data.username;
                                console.log(players);
                                socket.handshake.session.save();
                            }
                            socket.emit('login', { result: result });
                            // console.log(`${data.username} is logged`);
                        } else {
                            socket.emit('login', { result: false });
                            // console.log(`${data.username} is not logged`);
                        }
                    });
                else {
                    console.log(`${data.username} is already logged in`);
                    socket.emit('login', {result: false});
                }
            });

            socket.on('register', async(data) => {
                console.log('register request is received');
                if(!data.username) {
                    console.log('username is not supplied while register');
                    socket.emit('register', {result: false, error: 'Username must be supplied'});
                    return;
                }
                users.getUserInfo(data.username).then((result) => {
                    if(result) {
                        console.log(`${data.username} is already registered while register`);
                        socket.emit('register', {result: false, error: `${data.username} is already registered`});
                    } else {
                        users.addUser(data).then((result) => {
                            if(result) {
                                socket.emit('register', {result: true, error: ''});
                            } else {
                                socket.emit('register', {result: false, error: `Error occurred while register user in db`});
                            }
                        });
                    }
                });
            });

            socket.on('stage_start', (data) => {
                console.log('stage_start request recevied');
                users.startStage(data.username).then((result) => {
                    if (result) {
                        const numData = puzzle.getNumberData();
                        puzzle.getWordData().then((wordData) => {
                            if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'stage_start';
                            socket.emit('stage_start', {
                                result: true,
                                info: result,
                                gameData: { numData: [numData], wordData: [wordData] }
                            });
                        });
                        console.log(`${data.username} start stage`);
                    } else {
                        socket.emit('stage_start', { result: false });
                        console.log(`${data.username} failure to start stage`);
                    }
                });
            });

            socket.on('stage_end', (data) => {
                console.log('stage_end request recevied : ', data);
                users.stopStage(data.username, data.result).then((result) => {
                    if (result) {
                        socket.emit('stage_end', { result: true, info: result });
                        console.log(`${data.username} end stage`);
                        if(!data.result.isWin) socket.emit('update_userdata', result);
                    } else {
                        socket.emit('stage_end', { result: false });
                        console.log(`${data.username} end failure stage`);
                    }
                });
                if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'stage_end';
            });

            socket.on('stage_cancel', (data) => {
                console.log('stage_cancel request recevied');
                users.cancelStage(data.username).then((result) => {});
                if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'stage_cancel';
            });

            socket.on('tournament_in', (data) => {
                console.log('tournament_in request received');
                rooms.joinTournament(data).then((result) => {
                    if (result) {
                        if (!result.error) {
                            if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'tournament_in';
                            socket.emit('tournament_in', {
                                result: result.joinUsers,
                                time: getDateTimeString(tournamentDateTime),
                            });
                            socket.to('game_of_tournament').emit('tournament_in', {
                                result: {userName: data.username, point: result.newUserPoint}
                            });
                            socket.join('game_of_tournament');
                        } else {
                            socket.emit('tournament_in', { result: false, error: result.error });
                            console.log(`${ data.username } couldn 't join tournament because ${result.error}`);
                        }
                    } else {
                        socket.emit('tournament_in', { result: false, error: 'Error occured while join in tournament' });
                        console.log(`${data.username} failure to join tournament`);
                    }
                });
            });

            socket.on('tournament_out', (data) => {
                console.log('tournament_out request received');
                rooms.leaveTournament(data).then((result) => {
                    if (result) {
                        if (!result.error) {
                            socket.leave('game_of_tournament');
                            socket.to('game_of_tournament').emit('tournament_out', data.username);
                        } else {
                            socket.emit('tournament_out', { result: false, error: result.error });
                            console.log(`${ data.username } couldn 't leave tournament`);
                        }
                    } else {
                        socket.emit('tournament_out', { result: false, error: 'ServerInternalError' });
                        console.log(`${data.username} failure to leave tournament`);
                    }
                });
                if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'tournament_out';
            });

            socket.on('tournament_end', (data) => {
                console.log('tournament_end request received');
                    rooms.endTournament(data).then((result) => {
                        if (result) {
                            if(result.allIsOver) {
                                socket.to('game_of_tournament').emit('tournament_end', {
                                    result: true,
                                    winner: result.result.winner,
                                    winnerPoint: result.result.winnerPoint
                                });
                                socket.emit('update_userdata', result.userInfo);
                                console.log('All users are ended');
                            }// else {
                                // socket.emit('tournament_end', {
                                    // result: true,
                                    // winner: result.result.winner,
                                    // winnerPoint: result.result.winnerPoint
                                // });
                            // }
                            console.log('end is processed');
                            if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'tournament_end';
                        } else {
                            // socket.emit('tournament_end', { result: false });
                            console.log('the room could not end');
                        }
                    });
            });

            socket.on('invite_request', (data) => {
                console.log('invite_request is received');
                let isOnline = false;
                for(user in players) {
                    if(user == data.inviteuser) {
                        isOnline = true;
                        break;
                    }                    
                }
                if (!isOnline) {
                    console.log('invite user is not connected.');
                    socket.emit('invite_request', {result: false, to: data.inviteuser});
                } else {
                    rooms.createRoom(data.waituser).then((result) => {
                        if (result) {
                            console.log('invite_request is sent.');
                            socket.join(`game_of_${result.id}`);
                            socket.emit('invite_request', {result: result, to: data.inviteuser});
                            if(players[data.inviteuser])
                                socket.to(players[data.inviteuser]).emit('invite_request', {result: result, from: data.waituser});
                        } else {
                            socket.emit('invite_request', { result: false, to: data.inviteuser });
                            console.log(`invite_request request of ${data.waituser} is failed`);
                        }
                    });
                }
            });

            socket.on('invite_accept', (data) => {
                console.log('invite_accept request recevied');
                rooms.joinRoom(data.roomId, data.inviteuser).then((result) => {
                    if (result) {
                        if (result.error) {
                            socket.emit('invite_accept', { result: false, error: result.error });
                            if(players[data.waituser]) {
                                socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                                socket.to(players[data.waituser]).emit('invite_accept', { result: false, error: result.error });
                            }
                            console.log(`invite_accept request of ${data.inviteuser} is failed`);
                        }

                        rooms.startRoom(data.roomId).then((result) => {
                            if (result) {
                                socket.join(`game_of_${data.roomId}`);
                                getMultiRandomData().then(({numDataList, wordDataList}) => {                                        
                                    socket.emit('battle_start', { result: data.roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                                    socket.to(`game_of_${data.roomId}`).emit('battle_start', { result: data.roomId, gameData: { numData: numDataList, wordData: wordDataList } });
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
                    } else {
                        socket.emit('invite_accept', { result: false });
                        if(players[data.waituser]) {
                            socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                            socket.to(players[data.waituser]).emit('invite_accept', { result: false });
                        }
                        console.log(`invite_accept request of ${data.inviteuser} is failed`);
                    }
                });
            });

            socket.on('invite_reject', (data) => {
                console.log('invite_reject request received');
                rooms.rejectRoom(data.roomId).then((result) => {
                    if (result) {
                        // socket.emit('invite_reject', { result: true });
                        socket.to(`game_of_${data.roomId}`).emit('invite_reject', { result: true });
                        if(players[data.waituser]) {
                            socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                            socket.to(players[data.waituser]).emit('invite_reject', { result: true });
                        }
                    } else {
                        // socket.emit('invite_reject', { result: false });
                        console.log(`invite_reject request of ${data.inviteuser} is failed`);
                    }
                });
            });

            socket.on('invite_cancel', (data) => {
                console.log('invite_cancel request received');
                rooms.cancelRoom(data.roomId).then((result) => {
                    if (result) {
                        // socket.emit('invite_cancel', { result: true });
                        // socket.to(`game_of_${data.roomId}`).emit('invite_cancel', { result: true });
                        socket.leave(`game_of_${data.roomId}`);
                        // if(players[data.inviteuser])
                        //     socket.to(players[data.inviteuser]).leave(`game_of_${data.roomId}`);
                    } else {
                        // socket.emit('invite_cancel', { result: false });
                        console.log(`invite_cancel request of ${data.waituser} is failed`);
                    }
                });
            });

            socket.on('random_request', async(data) => {
                console.log('random_request is received');
                console.log(randomPlayers);
                if(!data.username)return;
                let isMatch = false;
                for (const username in randomPlayers) {
                    if(username == data.username || !randomPlayers[username]) continue;
                    if(!isMatch && randomPlayers[username].isWaiting) {
                        //join to randomPlayers[user].socketId;
                        const result = await rooms.joinRoom(randomPlayers[username].roomId, data.username);
                        if(result && !result.error) {
                            randomPlayers[username].isWaiting = false;
                            randomPlayers[username].joinUser = data.username;
                            isMatch = true;
                            await rooms.startRoom(randomPlayers[username].roomId);
                            socket.join(`game_of_${randomPlayers[username].roomId}`);
                            getMultiRandomData().then(({numDataList, wordDataList}) => { 
                                if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'random_start';
                                socket.emit('battle_start', { result: randomPlayers[username].roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                                socket.to(`game_of_${randomPlayers[username].roomId}`)
                                    .emit('battle_start', { result: randomPlayers[username].roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                            });
                            break;
                        }
                    }
                }
                // console.log(randomPlayers);
                if(isMatch) return;
                if(!randomPlayers[data.username])
                    rooms.createRoom(data.username).then((result) => {
                        if (result) {
                            randomPlayers[data.username] = { socketId: socket.id, roomId: result.id, isWaiting: true, joinUser: ''};
                            console.log('random_request is sent.');
                            // console.log(randomPlayers);
                            socket.join(`game_of_${result.id}`);
                            socket.emit('random_request', {result: result.id});
                            if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'random_wait';
                        } else {
                            socket.emit('random_request', { result: false });
                            console.log(`random_request request of ${data.username} is failed`);
                        }
                    });
            });

            socket.on('random_cancel', (data) => {
                console.log('random_cancel is received');
                if(data.roomId && data.username)
                    rooms.cancelRoom(data.roomId).then((result) => {
                        if (result) {
                            randomPlayers[data.username] = undefined;
                            console.log('random_cancel is sent.');
                            console.log(randomPlayers);
                            socket.leave(`game_of_${result.id}`);
                            // socket.emit('random_cancel', {result: true});
                        } else {
                            // socket.emit('random_cancel', { result: false });
                            console.log(`random_cancel request of ${data.username} is failed`);
                        }
                    });
                if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'random_cancel';
            });

            socket.on('battle_end', (data) => {
                console.log('battle_end is received');
                // console.log(randomPlayers);
                rooms.endRoom(data).then((result) => {
                    if (result) {
                        if(result.allIsOver) {
                            socket.emit('battle_end', {
                                result: true,
                                winner: result.result.winner,
                                winnerPoint: result.result.winnerPoint
                            });
                            socket.to(`game_of_${data.roomId}`).emit('battle_end', {
                                result: true,
                                winner: result.result.winner,
                                winnerPoint: result.result.winnerPoint
                            });
                            socket.emit('update_userdata', result.userInfo);
                            const createuser = result.result.userName;
                            const joinuser = result.result.joinUsers[0].userName;
                            if(players[createuser]) socket.to(players[createuser]).leave(`game_of_${data.roomId}`);
                            if(players[joinuser]) socket.to(players[joinuser]).leave(`game_of_${data.roomId}`);
                            randomPlayers[createuser] = undefined;
                            rooms.rejectRoom(data.roomId);
                            console.log('All users are ended');
                        }
                        console.log('end is processed');
                        if (socket.handshake.session.game_exists) socket.handshake.session.player_status = 'battle_end';
                    } else {
                        console.log('the room could not end');
                    }
                });
            });
        });
    },
};

module.exports = exportedMethods;