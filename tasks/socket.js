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

            // if (!socket.handshake.session.ship_exists) {

            // // create a new player and add it to our players object
            // players[socket.id] = {
            //     playerId: socket.id,
            // };

            // // send the players object to the new player
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
                if(!players[data.username])
                    users.getUserByName(data.username, data.password).then((result) => {
                        if (result) {
                            players[data.username] = socket.id;
                            socket.emit('login', { result: result });
                            // console.log(`${data.username} is logged`);
                        } else {
                            socket.emit('login', { result: false });
                            // console.log(`${data.username} is not logged`);
                        }
                    });
            });

            socket.on('stage_start', (data) => {
                console.log('stage_start request recevied');
                users.startStage(data.username).then((result) => {
                    if (result) {
                        const numData = puzzle.getNumberData();
                        puzzle.getWordData().then((wordData) => {
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
            });

            socket.on('stage_cancel', (data) => {
                console.log('stage_cancel request recevied');
                users.cancelStage(data.username).then((result) => {});
            });

            socket.on('tournament_in', (data) => {
                console.log('tournament_in request received');
                rooms.joinTournament(data).then((result) => {
                    if (result) {
                        if (!result.error) {
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
                        } else {
                            // socket.emit('tournament_end', { result: false });
                            console.log('the room could not end');
                        }
                    });
            });

            socket.on('invite_request', (data) => {
                console.log('invite_request is received');
                if (players.keys().indexOf(data.inviteuser) == -1) {
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
                            if(players[data.waituser])
                                socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                            console.log(`invite_accept request of ${data.inviteuser} is failed`);
                        }
                        socket.join(`game_of_${data.roomId}`);

                        rooms.startRoom(data.roomId).then((result) => {
                            if (result) {
                                getMultiRandomData().then(({numDataList, wordDataList}) => {                                        
                                    socket.emit('battle_start', { result: data.roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                                    socket.to(`game_of_${data.roomId}`).emit('invite_accept', { result: data.roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                                });
                            } else {
                                socket.emit('invite_accept', { result: false });
                                if(players[data.waituser])
                                    socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
                                if(players[data.inviteuser])
                                    socket.to(players[data.inviteuser]).leave(`game_of_${data.roomId}`);
                                console.log('the room could not start');
                            }
                        });
                    } else {
                        socket.emit('invite_accept', { result: false });
                        if(players[data.waituser])
                            socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
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
                        if(players[data.waituser])
                            socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
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
                        socket.to(`game_of_${data.roomId}`).emit('invite_cancel', { result: true });
                        if(players[data.waituser])
                            socket.to(players[data.waituser]).leave(`game_of_${data.roomId}`);
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
                let isMatch = false;
                for (const username in randomPlayers) {
                    if(username == data.username) continue;
                    if(!isMatch && randomPlayers[username].isWaiting) {
                        console.log('ok1');
                        //join to randomPlayers[user].socketId;
                        const result = await rooms.joinRoom(randomPlayers[username].roomId, data.username);
                        console.log('ok2');
                        if(result && !result.error) {
                            randomPlayers[username].isWaiting = false;
                            isMatch = true;

                            socket.join(`game_of_${randomPlayers[username].roomId}`);

                            getMultiRandomData().then(({numDataList, wordDataList}) => { 
                                socket.emit('battle_start', { result: data.roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                                socket.to(`game_of_${randomPlayers[username].roomId}`)
                                    .emit('battle_start', { result: data.roomId, gameData: { numData: numDataList, wordData: wordDataList } });
                            });
                        }
                    }
                }
                console.log(randomPlayers);
                if(isMatch) return;
                if(!randomPlayers[data.username])
                    rooms.createRoom(data.username).then((result) => {
                        if (result) {
                            randomPlayers[data.username] = { socketId: socket.id, roomId: result.id, isWaiting: true};
                            console.log('random_request is sent.');
                            console.log(randomPlayers);
                            socket.join(`game_of_${result.id}`);
                            socket.emit('random_request', {result: result.id});
                        } else {
                            socket.emit('random_request', { result: false });
                            console.log(`random_request request of ${data.username} is failed`);
                        }
                    });
            });

            socket.on('random_cancel', (data) => {
                console.log('random_cancel is received');
                if(data.roomId)
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
            });


            // socket.on('create', (data) => {
            //     console.log('create request recevied');
            //     rooms.createRoom(data.username).then((result) => {
            //         if (result) {
            //             socket.join(`game_of_${result.id}`);
            //             socket.emit('create', { result: result });
            //             socket.broadcast.emit('create', { result: result });
            //             console.log(`created room is ${data.username}: ${result}`);
            //         } else {
            //             socket.emit('create', { result: false });
            //             console.log(`create request of ${data.username} is failed`);
            //         }
            //     });
            // });

            // socket.on('join', (data) => {
            //     console.log('join request recevied');
            //     rooms.joinRoom(data.roomId, data.joinUser).then((result) => {
            //         if (result) {
            //             socket.join(`game_of_${data.roomId}`);
            //             socket.emit('join', { result: result });
            //             socket.to(`game_of_${data.roomId}`).emit('join', { result: result });
            //         } else {
            //             socket.emit('join', { result: false });
            //             console.log(`join request of ${data.joinUser} is failed`);
            //         }
            //     });
            // });

            // socket.on('list', (data) => {
            //     console.log('list requset received');
            //     rooms.getJoinUsers(data.roomId).then((result) => {
            //         if (result) {
            //             socket.emit('list', { result: true, joinusers: result });
            //             console.log('list request is processed');
            //         } else {
            //             socket.emit('list', { result: false });
            //             console.log('list request is not precessed');
            //         }
            //     });
            // });

            // socket.on('ready', (data) => {
            //     console.log('ready request received');
            //     rooms.readyUser(data.roomId, data.readyUser).then((result) => {
            //         if (result) {
            //             socket.emit('ready', { result: result });
            //             socket.to(`game_of_${data.roomId}`).emit('ready', { result: result });
            //         } else {
            //             socket.emit('ready', { result: false });
            //             console.log(`ready request of ${data.readyUser} is failed`);
            //         }
            //     });
            // });

            // socket.on('start', (data) => {
            //     console.log('start request received');
            //     rooms.startRoom(data.roomId).then((result) => {
            //         if (result) {
            //             const numData = puzzle.getNumberData();
            //             puzzle.getWordData().then((wordData) => {
            //                 socket.to(`game_of_${data.roomId}`).emit('start', { result: true, gameData: { numData: numData, wordData: wordData } });
            //                 socket.emit('start', { result: true, gameData: { numData: numData, wordData: wordData } });
            //             });
            //         } else {
            //             socket.emit('start', { result: false });
            //             console.log('the room could not start');
            //         }
            //     });
            // });

            // socket.on('end', (data) => {
            //     console.log('end request received');
            //     if (!data.isTimeOut) {
            //         rooms.removeRoom(data.roomId, data.username).then((result) => {
            //             if (result) {
            //                 socket.emit('end', { result: true, winner: data.username });
            //                 socket.to(`game_of_${data.roomId}`).emit('end', { result: true, winner: data.username });
            //                 console.log('end is processed');
            //             } else {
            //                 socket.emit('end', { result: false });
            //                 console.log('the room could not end');
            //             }
            //         });
            //     } else {
            //         rooms.timeOutUser(data.roomId, data.username).then((result) => {
            //             if (result) {
            //                 if (result.allIsOver == false) {
            //                     socket.emit('timeout', { result: true });
            //                     console.log('timeout is processed');
            //                 } else {
            //                     socket.emit('end', { result: true, winner: '' });
            //                     socket.to(`game_of_${data.roomId}`).emit('end', { result: true, winner: '' });
            //                     console.log('end by timeoout');
            //                 }
            //             } else {
            //                 socket.emit('timeout', { result: false });
            //                 console.log('user timeout is not processed');
            //             }
            //         });
            //     }
            // });
        });
    },
};

module.exports = exportedMethods;