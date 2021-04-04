const mongoCollections = require('../config/mongoCollections');
const rooms = mongoCollections.rooms;
let { ObjectId } = require('mongodb');
const users = require('./users');

const exportedMethods = {

    async joinTournament(data) {
        if (!data.username) {
            console.log('ReferenceError: You must provide username while joniTournament');
            return false;
        }

        const userInfo = await users.getUserInfo(data.username);
        if (!userInfo) return false;

        if (userInfo.heart == 0 || userInfo.coin < 10) {
            return { error: 'You need more heart or coin.' };
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ userName: 'tournament' });
        if (!room) {
            const newroom = {
                userName: 'tournament',
                joinUsers: [{ userName: data.username, point: userInfo.point, isOver: false }],
                winner: '',
                winnerPoint: 0,
                isOver: false,
                isStarted: false,
                isClosed: false,
            };

            const newInsertInformation = await roomCollection.insertOne(newroom);
            if (newInsertInformation.insertedCount === 0) {
                console.log('Could not create tournamentRoom');
                return false;
            }

            const result = {
                joinUsers: newroom.joinUsers,
                newUserPoint: userInfo.point
            }

            return result;
        }

        if (room.isStarted || room.isClosed) {
            console.log('Tournament is already started or ended');
            return { error: 'Tournament is already started or ended' };
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

        let result = {
            joinUsers: updatedRoomData.joinUsers,
            newUserPoint: userInfo.point
        }

        if (idxOfUser != -1) {
            console.log(`${data.username} is already in while jointournament`);
            return result;
        }
        updatedRoomData.joinUsers.push({ userName: data.username, point: userInfo.point, isOver: false });
        result.joinUsers = updatedRoomData.joinUsers;

        const updatedInfo = await roomCollection.updateOne({ _id: room._id }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not join to the tournament while jointournament');
            // return false;
        }

        return result;
    },

    async leaveTournament(data) {
        if (!data.username) {
            console.log('ReferenceError: You must provide username while leaveTournament');
            return false;
        }

        const userInfo = await users.getUserInfo();
        if (!userInfo) return false;

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ userName: 'tournament' });
        if (!room) {
            console.log('Error: tournamentRoom is not exist while leaveTournament');
            return false;
        }

        if (room.isStarted) {
            console.log('Tournament is already started while leaveTournament');
            return { error: 'Tournament is already started' };
        }

        const updatedRoomData = room;
        let joinusers = updatedRoomData.joinUsers;
        let idxOfUser = -1;
        joinusers.map((user, index) => {
            if(user.userName == data.username) {
                idxOfUser = index;
                // console.log(`user index = ${index}`);
                return;
            }
        });
        if (idxOfUser == -1) {
            console.log('The user never in while leaveTournament');
            return false;
        }
        joinusers.splice(idxOfUser, 1);
        updatedRoomData.joinUsers = joinusers;

        const updatedInfo = await roomCollection.updateOne({ _id: room._id }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not leave to the tournament while leavetournament');
            return false;
        }

        return true;
    },

    async startTournament() {

        const roomCollection = await rooms();
        let room = await roomCollection.findOne({ userName: 'tournament' });
        if (!room) {
            console.log('the tournamentRoom is not exist');
            return false;
        }

        if (room.isClosed || room.isStarted) {
            console.log('the tournament is already running');
            return false;
        }

        const updatedRoomData = room;
        updatedRoomData.isStarted = true;

        if (room.joinUsers.length == 0) {
            console.log('no one joined the tournament. it counld not start any more');
            updatedRoomData.isClosed = true;
        }

        const updatedInfo = await roomCollection.updateOne({ _id: room._id }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not start the room while startroom');
            // return false;
        }
        if (room.joinUsers.length == 0) return false;

        return true;
    },
    
    async openTournament() {

        const roomCollection = await rooms();
        let room = await roomCollection.findOne({ userName: 'tournament' });
        if (!room) {
            console.log('the tournamentRoom is not exist');
            return false;
        }

        const updatedRoomData = room;
        updatedRoomData.isClosed = false;   
        updatedRoomData.isStarted = false;

        const updatedInfo = await roomCollection.updateOne({ _id: room._id }, { $set: updatedRoomData });

        // if (updatedInfo.modifiedCount === 0) {
            // console.log('could not end the room while openroom');
            // return false;
        // }

        return true;
    },

    async endTournament(data) {
        if (!data.username || data.isAlive === undefined || data.point === undefined) {
            console.log('ReferenceError: You must provide username, isAlive, point while endTournament');
            return false;
        };

        const roomCollection = await rooms();
        let room = await roomCollection.findOne({ userName: 'tournament' });
        if (!room) {
            console.log('the tournamentRoom is not exist');
            return false;
        }

        if (room.isClosed || !room.isStarted) {
            console.log('the tournament is never running');
            return false;
        }

        const updatedRoomData = room;
        let joinusers = updatedRoomData.joinUsers;
        let idxOfUser = -1;
        let allIsOver = true;

        joinusers.map((user, index) => {
            if(user.userName == data.username) {
                idxOfUser = index;
                joinusers[index].isOver = true;
                return;
            } else if (!user.isOver) allIsOver = false;
        });
        if (idxOfUser == -1) {
            console.log('The user never in while leaveTournament');
            return false;
        }
        updatedRoomData.joinUsers = joinusers;

        let ref_user;
        if(!data.isAlive) {
            ref_user = users.delUserValue(data.username, {heart: 1});
            // if(!ref) return false;
        } else if(data.point > updatedRoomData.winnerPoint) {
            updatedRoomData.winner = data.username;
            updatedRoomData.winnerPoint = data.point;
        }

        if (allIsOver) {
            updatedRoomData.isClosed = true;
        }

        const updatedInfo = await roomCollection.updateOne({ _id: room._id }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not end the room while endroom');
            return false;
        }

        return {result: updatedRoomData, allIsOver: allIsOver, userInfo: ref_user};
    },

    async timeOutUser(id, username) {
        if (!id || !username) {
            console.log('ReferenceError: You must provide an roomid and username while timeoutuser');
            return false;
        }

        let parsedId;
        try {
            parsedId = ObjectId(id);
        } catch (error) {
            console.log(`Syntax Error: id is not valid while timeoutuser`);
            return false;
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log(`Error: room not exist while timeoutuser`);
            return false;
        }

        if (room.isClosed || !room.isStarted) {
            console.log('Room is closed or is not started while timeoutuser');
            return false;
        }

        const updatedRoomData = room;
        const allIsOver = true;
        for (let i = 0; i < room.joinUsers.length; i++) {
            const element = room.joinUsers[i];
            if (element.userName == username) {
                updatedRoomData.joinUsers[i].isOver = true;
            } else
            if (!element.isOver) {
                allIsOver = false;
            }
        };
        if (allIsOver) {
            updatedRoomData.isClosed = true;
            updatedRoomData.winner = '';
        }

        const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not set ready for joinuser while timeoutuser');
            return false;
        }

        if (allIsOver) {
            const result = {
                id: String(updatedRoomData._id),
                userName: updatedRoomData.userName,
                joinUsers: updatedRoomData.joinUsers,
                winner: updatedRoomData.winner,
                isStarted: updatedRoomData.isStarted,
                isClosed: updatedRoomData.isClosed,
            }
            return result;
        }

        return { allIsOver: false };
    },

    async createRoom(username) {
        if (username === undefined) {
            console.log("Failed in createRoom! username is undefined");
            return false;
        }

        const roomCollection = await rooms();

        const newroom = {
            userName: username,
            joinUsers: [],
            winner: '',
            winnerPoint: 0,
            isOver: false,
            isStarted: false,
            isClosed: false,
        };

        const newInsertInformation = await roomCollection.insertOne(newroom);
        if (newInsertInformation.insertedCount === 0) {
            console.log('Could not add room');
            return false;
        }

        const result = newroom;
        result.id = String(newInsertInformation.insertedId);

        return result;
    },

    async joinRoom(id, username) {
        if (!id || !username) {
            console.log('ReferenceError: You must provide an roomid and username while joinRoom');
            return false;
        }

        let parsedId;
        try {
            parsedId = ObjectId(id);
        } catch (error) {
            console.log(`Syntax Error: id is not valid while joinRoom`);
            return false;
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log(`Error: room not exist while joinroom`);
            return {error: 'Error: invite user has canceled.'};
        }

        if (room.isStarted || room.isClosed) {
            console.log('Room is not prepare status while joinroom');
            return false;
        }

        const updatedRoomData = room;
        updatedRoomData.joinUsers.push({userName: username, isOver: false});

        const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not join to the room while joinroom');
            return false;
        }

        const result = {
            id: String(updatedRoomData._id),
            userName: updatedRoomData.userName,
            joinUsers: updatedRoomData.joinUsers,
            winner: updatedRoomData.winner,
            winnerPoint: updatedRoomData.winnerPoint,
            isOver: updatedRoomData.isOver,
            isStarted: updatedRoomData.isStarted,
            isClosed: updatedRoomData.isClosed,
        }
        return result;
    },

    async startRoom(id) {
        if (!id) {
            console.log('ReferenceError: You must provide an roomid while startroom');
            return false;
        }

        let parsedId;
        try {
            parsedId = ObjectId(id);
        } catch (error) {
            console.log(`Syntax Error: id is not valid while startroom`);
            return false;
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log(`Error: room not exist while startroom`);
            return false;
        }

        if (room.isClosed || room.isStarted) {
            console.log('The room is closed or already started while startRoom');
            return false;
        }

        const updatedRoomData = room;
        updatedRoomData.isStarted = true;

        const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not start the room while startroom');
            return false;
        }

        return true;
    },

    async rejectRoom(id) {
        if (!id) {
            console.log('ReferenceError: You must provide an id to reject');
            return false;
        }

        let parsedId;
        try {
            parsedId = ObjectId(id);
        } catch (error) {
            console.log('id is not valid while rejectroom');
            return false;
        }

        const roomCollection = await rooms();
        let room;
        try {
            room = await roomCollection.findOne({ _id: parsedId });
        } catch (e) {
            console.log('the room of id is not exist');
            return true;
        }

        if (room.isStarted) {
            console.log('the room is already running');
            return false;
        }

        const deletionInfo = await roomCollection.removeOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) {
            console.log('could not end the room while rejectroom');
            return false;
        }

        return true;
    },

    async cancelRoom(id) {
        if (!id) {
            console.log('ReferenceError: You must provide an id to cancel');
            return false;
        }

        let parsedId;
        try {
            parsedId = ObjectId(id);
        } catch (error) {
            console.log('id is not valid while cancelroom');
            return false;
        }

        const roomCollection = await rooms();
        let room;
        try {
            room = await roomCollection.findOne({ _id: parsedId });
        } catch (e) {
            console.log('the room of id is not exist');
            return true;
        }

        if (room.isStarted) {
            console.log('the room is already running');
            return false;
        }

        const deletionInfo = await roomCollection.removeOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) {
            console.log('could not end the room while cancelroom');
            return false;
        }

        return true;
    },

    async endRoom(data) {
        if (!data.roomId || !data.username || data.isAlive === undefined || data.point === undefined) {
            console.log('ReferenceError: You must provide roomId, username, isAlive, point while endRoom');
            return false;
        };

        try {
            parsedId = ObjectId(data.roomId);
        } catch (error) {
            console.log('id is not valid while endRoom');
            return false;
        }

        const roomCollection = await rooms();
        let room = await roomCollection.findOne({ _id: parsedId });
        if (!room) {
            console.log('the Room is not exist');
            return false;
        }

        if (room.isClosed || !room.isStarted) {
            console.log('the battle is never running');
            return false;
        }

        const updatedRoomData = room;
        let joinusers = updatedRoomData.joinUsers;
        let allIsOver;

        if (joinusers.length == 0) {
            console.log('The user never in while endRoom');
            return false;
        }
        if(joinusers[0].userName == data.username) {
            joinusers[0].isOver = true;
        }
        if(updatedRoomData.userName == data.username) {
            updatedRoomData.isOver = true;
        }

        if(updatedRoomData.isOver && joinusers[0].isOver) allIsOver = true;
        else allIsOver = false;

        updatedRoomData.joinUsers = joinusers;

        let ref_user;
        if(!data.isAlive) {
            ref_user = await users.delUserValue(data.username, {heart: 1});
            // if(!ref) return false;
        } else if(data.point > updatedRoomData.winnerPoint) {
            updatedRoomData.winner = data.username;
            updatedRoomData.winnerPoint = data.point;
        }

        if (allIsOver) {
            updatedRoomData.isClosed = true;
        }

        const updatedInfo = await roomCollection.updateOne({ _id: room._id }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not end the room while endRoom');
            return false;
        }

        return {result: updatedRoomData, allIsOver: allIsOver, userInfo: ref_user};

        // const deletionInfo = await roomCollection.removeOne({ _id: parsedId });
        // if (deletionInfo.deletedCount === 0) {
        //   throw `Could not delete room with id of ${id}`;
        // }
    },

};

module.exports = exportedMethods;