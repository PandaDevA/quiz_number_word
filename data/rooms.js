const mongoCollections = require('../config/mongoCollections');
const rooms = mongoCollections.rooms;
let { ObjectId } = require('mongodb');

const exportedMethods = {

  async createRoom(username) {
    if(username === undefined) {
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
    const room =await roomCollection.findOne({_id: parsedId});
    if (!room) {
      console.log(`Error: room not exist while joinroom`);
      return false;
    }

    if (room.isStarted || room.isClosed) {
      console.log('Room is not prepare status while joinroom');
      return false;
    }

    const updatedRoomData = room;
    updatedRoomData.joinUsers.push({userName: username, isReady: false});

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

  async readyUser(id, username) {
    if (!id || !username) {
      console.log('ReferenceError: You must provide an roomid and username while readyuser');
      return false;
    }

    let parsedId;
    try {
      parsedId = ObjectId(id); 
    } catch (error) {
      console.log(`Syntax Error: id is not valid while readyuser`);
      return false;
    }

    const roomCollection = await rooms();
    const room =await roomCollection.findOne({_id: parsedId});
    if (!room) {
      console.log(`Error: room not exist while readyuser`);
      return false;
    }

    if(room.isClosed || room.isStarted) {
      console.log('Room is not prepare status while readyuser');
      return false;
    }

    const updatedRoomData = room;
    for(let i=0; i<room.joinUsers.length; i++){
      const element = room.joinUsers[i];
      if(element.userName == username)
      {
        updatedRoomData.joinUsers[i].isReady = true;
        break;
      }
    };

    const updatedInfo = await roomCollection.updateOne({ _id: parsedId }, { $set: updatedRoomData });

    if (updatedInfo.modifiedCount === 0) {
      console.log('could not set ready for joinuser while readyuser');
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

  async getRooms() {
    const roomCollection = await rooms();
    const room = await roomCollection.find().toArray();

    const result = [];
    room.map((roomdata, index) => {
      if(1 || !roomdata.isStarted) result.push({
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
    const room =await roomCollection.findOne({_id: parsedId});

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
    const room =await roomCollection.findOne({_id: parsedId});
    if (!room) {
      console.log(`Error: room not exist while startroom`);
      return false;
    }

    if (room.isClosed || room.isStarted) {
      console.log('The room is closed or already started while startRoom');
      return false;
    }

    let canStart = true;
    room.joinUsers.map((joinuser, index) => {
      if(!joinuser.isReady) canStart = false;
    });

    if(!canStart) {
      console.log(`To start room, all join users should be ready while startroom`);
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
      room =await roomCollection.findOne({_id: parsedId});
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
    const room =await roomCollection.findOne({_id: parsedId});
    if (!room) {
      console.log(`Error: room not exist while timeoutuser`);
      return false;
    }

    if(room.isClosed || !room.isStarted) {
      console.log('Room is closed or is not started while timeoutuser');
      return false;
    }

    const updatedRoomData = room;
    const allIsOver = true;
    for(let i=0; i<room.joinUsers.length; i++){
      const element = room.joinUsers[i];
      if(element.userName == username)
      {
        updatedRoomData.joinUsers[i].isOver = true;
      } else if (!element.isOver) {
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

    return {allIsOver: false};
  },

};

module.exports = exportedMethods;
