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
                winUser: '',
                winnerPoint: 0,
                isStarted: false,
                isClosed: false,
            };

            const newInsertInformation = await roomCollection.insertOne(newroom);
            if (newInsertInformation.insertedCount === 0) {
                console.log('Could not create tournamentRoom');
                return false;
            }

            const result = newroom;
            result.id = String(newInsertInformation.insertedId);

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
            return false;
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
                console.log(`user index = ${index}`);
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
            console.log('could not join to the tournament while leavetournament');
            return false;
        }

        return true;
    },


    async endTournament(data) {
        if (!data.username || !data.isAlive || data.point) {
            console.log('ReferenceError: You must provide username, isAlive, point while endTournament');
            return false;
        };

        const roomCollection = await rooms();
        let room = await roomCollection.findOne({ username: 'tournament' });
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

        if(!data.isAlive) {
            const ref = users.delUserValue(data.username, {heart: 1});
            // if(!ref) return false;
        } else if(data.point > updatedRoomData.winnerPoint) {
            updatedRoomData.winner = data.username;
            updatedRoomData.winnerPoint = data.point;
        }

        if (allIsOver) {
            updatedRoomData.isClosed = true;
        }

        const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not end the room while endroom');
            return false;
        }

        return {result: updatedRoomData, allIsOver: allIsOver};
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
            updatedRoomData.winUser = '';
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
                winUser: updatedRoomData.winUser,
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
            winUser: '',
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
        updatedRoomData.joinUsers.push(username);

        const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not join to the room while joinroom');
            return false;
        }

        const result = {
            id: String(updatedRoomData._id),
            userName: updatedRoomData.userName,
            joinUsers: updatedRoomData.joinUsers,
            winUser: updatedRoomData.winUser,
            isStarted: updatedRoomData.isStarted,
            isClosed: updatedRoomData.isClosed,
        }
        return result;
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

    async getRooms() {
        const roomCollection = await rooms();
        const room = await roomCollection.find().toArray();

        const result = [];
        room.map((roomdata, index) => {
            if (1 || !roomdata.isStarted) result.push({
                id: String(roomdata._id),
                userName: roomdata.userName,
                joinUsers: roomdata.joinUsers,
                winUser: roomdata.winUser,
                isStarted: roomdata.isStarted,
                isClosed: roomdata.isClosed,
            });
        });

        return result;
    },

    async getJoinUsers(id) {
        if (!id) {
            console.log('ReferenceError: You must provide an roomid while getJoinUsers');
            return false;
        }

        let parsedId;
        try {
            parsedId = ObjectId(id);
        } catch (error) {
            console.log(`Syntax Error: id is not valid while getJoinUsers`);
            return false;
        }

        const roomCollection = await rooms();
        const room = await roomCollection.findOne({ _id: parsedId });

        if (!room) {
            console.log(`Error: room not exist while getJoinUsers`);
            return false;
        }

        if (room.isClosed || room.isStarted) {
            console.log('The room is closed or already started while getJoinUsers');
            return false;
        }

        const result = room.joinUsers;

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

    async removeRoom(id, winner = '') {
        if (!id) throw 'ReferenceError: You must provide an id to remove';

        let parsedId;
        try {
            parsedId = ObjectId(id);
        } catch (error) {
            console.log('id is not valid while removeroom');
            return false;
        }

        const roomCollection = await rooms();
        let room;
        try {
            room = await roomCollection.findOne({ _id: parsedId });
        } catch (e) {
            console.log('the room of id is not exist');
            return false;
        }

        if (room.isClosed || !room.isStarted) {
            console.log('the room is not running further more');
            return false;
        }

        // const deletionInfo = await roomCollection.removeOne({ _id: parsedId });
        // if (deletionInfo.deletedCount === 0) {
        //   throw `Could not delete room with id of ${id}`;
        // }
        const updatedRoomData = room;
        updatedRoomData.isClosed = true;
        updatedRoomData.winUser = winner;

        const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not end the room while endroom');
            return false;
        }

        return true;
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
        let allIsOver = true;
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
            updatedRoomData.winUser = '';
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
                winUser: updatedRoomData.winUser,
                isStarted: updatedRoomData.isStarted,
                isClosed: updatedRoomData.isClosed,
            }
            return result;
        }

        return { allIsOver: false };
    },

};

module.exports = exportedMethods;