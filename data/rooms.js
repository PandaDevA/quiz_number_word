const mongoCollections = require('../config/mongoCollections');
const rooms = mongoCollections.rooms;
let { ObjectId } = require('mongodb');
const users = require('./users');

const exportedMethods = {

    async joinRoom(data) {
        // const userInfo = await users.getUserInfo(data.username);
        // if (!userInfo) {
        //     console.log(`${data.username} could not find while joinRoom`);
        //     return {result: false, error: 'Could not find the user in server'};
        // }

        let parsedId;
        try {
            parsedId = ObjectId(data.room_id);
        } catch (error) {
            console.log('The Id of room is not valid while joinRoom');
            return {result: false, error: 'The Id of room is not valid'};
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log('The room of this Id is not exist while joinRoom');
            return {result: false, error: 'The room of this Id is not exist'};
        }
        if (room.isStarted || room.isClosed) {
            console.log('The room is already started or ended while joinRoom');
            return { result: false, error: 'The room is already started or ended' };
        }

        const updatedRoomData = room;
        let joinusers = updatedRoomData.joinUsers;

        if(joinusers.length == 100) {
            console.log('Already 100 users take part in the Tournament while joinRoom');
            return { result: false, error: 'Already 100 users take part in the Tournament'};
        }

        let idxOfUser = -1;
        joinusers.map((user, index) => {
            if(user.userName == data.username) {
                idxOfUser = index;
                return;
            }
        });

        if (idxOfUser != -1) {
            console.log(`${data.username} is already join while joinRoom`);
            return { result: {...room, id: String(room._id)} };
        }

        updatedRoomData.joinUsers.push({ userName: data.username, point: 0, isOver: false });
        const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update join user while joinRoom');
            // return false;
        }

        return { result: {...updatedRoomData, id: String(parsedId)} };
    },

    async leaveRoom(data, isForce = false) {
        let parsedId;
        try {
            parsedId = ObjectId(data.room_id);
        } catch (error) {
            console.log('The Id of room is not valid while leaveRoom');
            return {result: false, error: 'The Id of room is not valid'};
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log('The room of this Id is not exist while leaveRoom');
            return {result: false, error: 'The room of this Id is not exist'};
        }

        if (room.isStarted && !isForce) {
            console.log('The room is already started while leaveRoom');
            return { result: false, error: 'The room is already started' };
        }

        const updatedRoomData = room;
        let joinusers = updatedRoomData.joinUsers;
        
        let idxOfUser = -1;
        joinusers.map((user, index) => {
            if(user.userName == data.username) {
                idxOfUser = index;
                return;
            }
        });

        if (idxOfUser == -1) {
            console.log(`${data.username} is already leave while leaveRoom`);
            return { result: true };
        }

        joinusers.splice(idxOfUser, 1);
        updatedRoomData.joinUsers = joinusers;

        if (room.isStarted && isForce && joinusers.length == 0) updatedRoomData.isClosed = true;

        const updatedInfo = await roomCollection.updateOne({ _id: room._id }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update leave user while leaveRoom');
            // return false;
        }

        return { result: updatedRoomData };
    },

    async getRoomById(room_id) {
        let parsedId;
        try {
            parsedId = ObjectId(room_id);
        } catch (error) {
            return false;
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });
        if(!room)
            return false;
        
        if(room.isClosed)
            return false;

        return room;
    }, 
    
    async endRoom(data) {
        let parsedId;
        try {
            parsedId = ObjectId(data.room_id);
        } catch (error) {
            console.log('The Id of room is not valid while endRoom');
            return {result: false, error: 'The Id of room is not valid'};
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log('The room of this Id is not exist while endRoom');
            return {result: false, error: 'The room of this Id is not exist'};
        }

        if (room.isClosed) {
            console.log('The room is already closed while endRoom');
            return { result: false, error: 'The room is already closed' };
        }

        const updatedRoomData = room;
        let joinusers = updatedRoomData.joinUsers;

        if (data.step >= 0 && (updatedRoomData.remainNum + data.step) != 10) {
            console.log('Invalid end Data is received');
            return {result: false, error: 'Invalid data with current step'};
        }
                
        let idxOfUser = -1,
            allIsOver = true,
            allIsEnd = false;

        joinusers.map((user, index) => {
            if(user.userName == data.username) {
                idxOfUser = index;
                joinusers[index].point = data.point;
                joinusers[index].isOver = true;
            } else if (!user.isOver) allIsOver = false;
        });

        if (idxOfUser == -1) {
            console.log(`${data.username} could not find in join users while endRoom`);
            return { result: false, error: 'Could not find in join users' };
        }

        updatedRoomData.joinUsers = joinusers;

        let winners = updatedRoomData.winner, winnerPoints = updatedRoomData.winnerPoint;
        if (winners.length == 0) {
            winners.push(data.username);
            winnerPoints.push(data.point);
        } else {
            let i;
            for (i = 0; i < winners.length; i++) {
                if(data.point > winnerPoints[i]) {
                    const idx = winners.indexOf(data.username);
                    if (idx > -1) {
                        winners.splice(idx, 1);
                        winnerPoints.splice(idx, 1);
                    }
                    winners.splice(i , 0, data.username);
                    winnerPoints.splice(i , 0, data.point);
                    if (winners.length > 3) {
                        winners.pop();
                        winnerPoints.pop();
                    }
                    break;
                }
                if(data.username == winners[i]) break;
            }
            if (i == winners.length && i < 3 && winners.indexOf(data.username) == -1) {
                winners.push(data.username);
                winnerPoints.push(data.point);
            }
        }

        updatedRoomData.winner = winners;
        updatedRoomData.winnerPoint = winnerPoints;

        if (allIsOver) {
            if( updatedRoomData.remainNum == 0) {
                updatedRoomData.isClosed = true;
                allIsEnd = true;
            } else updatedRoomData.remainNum--;
            for (let i=0; i < joinusers.length; i++) {
                joinusers[i].isOver = false;
            }
        }

        const updatedInfo = await roomCollection.updateOne({ _id: room._id }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('Warning: the tournament is not updated while endtournament');
            // return false;
        }

        return {result: {...updatedRoomData, id: String(parsedId)}, allIsOver, allIsEnd};
    },

    async listTournament(less = true) {
        const roomCollection = await rooms();
        let query;
        if (less) {
            const now = new Date();
            query = { userName: 'tournament', isStarted: false, startDateTime: {$gt: now.getTime()-100000} };
        } else {
            query = { userName: 'tournament' };
        }
        let room = await roomCollection.find(query).toArray();
        return room;
    },

    async startRoom(data) {
        let parsedId;
        try {
            parsedId = ObjectId(data.room_id);
        } catch (error) {
            console.log('The Id of room is not valid while startRoom');
            return {result: false, error: 'The Id of room is not valid'};
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log('The room of this Id is not exist while startRoom');
            return {result: false, error: 'The room of this Id is not exist'};
        }

        if (room.isClosed) {
            console.log('The room is already closed while startRoom');
            return { result: false, error: 'The room is already closed' };
        }

        if (room.isStarted) {
            console.log('The room is already started while startRoom');
            return { result: false, error: 'The room is already started' };
        }

        const updatedRoomData = room;
        updatedRoomData.isStarted = true;

        if (room.joinUsers.length == 0) {
            console.log('no one joined the tournament. it counld not start any more');
            updatedRoomData.isClosed = true;
        } 

        const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('Warning: the tournament is not updated while starttournament');
            // return false;
        }
        if (room.joinUsers.length == 0) return { result: false, error: 'no one joined the tournament. it counld not start any more'};

        return {result: {prize: room.prize, joiningFee: room.joiningFee, joinUsers: room.joinUsers}};
    },

    async createRoom(data) {

        const roomCollection = await rooms();

        const newroom = {
            userName: data.username || 'tournament',
            joinUsers: data.username && data.username != 'tournament' ? [{ userName: data.username, point: 0, isOver: false }] : [],
            winner: [],
            winnerPoint: [],
            joiningFee: data.joiningFee || 3,
            startDateTime: data.startDateTime || new Date(),
            prize: data.username && data.username == 'tournament' ? 1000 : 100,
            remainNum: 9,
            isStarted: false,
            isClosed: false,
        };

        if (data.joiningFee != undefined) newroom.joiningFee = data.joiningFee;
        if (data.startDateTime != undefined) newroom.startDateTime = data.startDateTime;
        if (data.prize != undefined) newroom.prize = data.prize;

        const newInsertInformation = await roomCollection.insertOne(newroom);
        if (newInsertInformation.insertedCount === 0) {
            console.log('Could not add room');
            return false;
        }

        return {...newroom, id: String(newInsertInformation.insertedId)};
    },

    async removeRoom(data) {
        let parsedId;
        try {
            parsedId = ObjectId(data.room_id);
        } catch (error) {
            console.log('room_id is not valid while removeroom');
            return {result: false, error: 'Room id is not valid'};
        }

        const roomCollection = await rooms();
        let room;
        room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log('the room of id is not exist');
            return {result: true};
        }

        if (room.isStarted && !room.isClosed) {
            console.log('the room is already running');
            return {result: false, error: 'Room is already running'};
        }

        const deletionInfo = await roomCollection.removeOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) {
            console.log('could not end the room while removeroom');
            return {result: false, error: 'Could not remove room.'};
        }

        return {result: true};
    },
};

module.exports = exportedMethods;