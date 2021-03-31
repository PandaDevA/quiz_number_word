const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

const exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const result = await userCollection.find().toArray();
    return result;
  },

  async getUserByName(username, password) {
    if (!username || !password) {
      // console.log('Error: username or password is not referred while getUserByName');
      return undefined;
    }

    const userCollection = await users();
    const user =await userCollection.findOne({username: username});

    if (!user) {
      // console.log(`Error: user "${username}" not exist while getUserByName`);
      return undefined;
    }

    if (user.password != password) {
      // console.log(`Error: user "${username}" password is not correct while getUserByName`);
      return undefined;
    }

    return user;
  },

  async addUser(username, password) {
    if(username === undefined || password ===undefined) {
      // console.log("Failed in AddUser! Username or Password is undefined");
      return false;
    }

    const userCollection = await users();

    const newuser = {
      username: username,
      password: password,
      point: 1000,
      heart: 0,
      coin: 0,
      isStartStage: false,
    };

    const newInsertInformation = await userCollection.insertOne(newuser);
    if (newInsertInformation.insertedCount === 0) {
      // console.log('Could not add user');
      return false;
    }
    return true;
  },

  async startStage(username) {
    if (!username || username == '') {
      console.log('ReferenceError: Username is not supplied while startStage');
      return false;
    }

    const userCollection = await users();
    const user =await userCollection.findOne({username: username});

    if (!user) {
      // console.log(`Error: user "${username}" not exist while getUserByName`);
      return false;
    }

    const updateduserData = user;
    updateduserData.isStartStage = true;

    const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

    if (updatedInfo.modifiedCount === 0) {
      console.log('could not update isStartStage successfully');
      return false;
    }

    return true;
  },

  async stopStage(username, data) {
    if (!username || !data) {
      console.log('ReferenceError: Username is not supplied while startStage');
      return false;
    }

    const userCollection = await users();
    const user =await userCollection.findOne({username: username});

    if (!user) {
      // console.log(`Error: user "${username}" not exist while getUserByName`);
      return false;
    }

    const updateduserData = user;
    updateduserData.isStartStage = false;

    if (data.isWin) {
      if (data.point) updateduserData.point += data.point;
      if (data.coin) updateduserData.coin += data.coin;
    } else {
      if (data.point) updateduserData.point += data.point;
      updateduserData.heart --;
    }

    const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

    if (updatedInfo.modifiedCount === 0) {
      console.log('could not update isStartStage successfully');
      return false;
    }

    return updateduserData;
  },

  // async getUserById(id) {
  //   if (!id) throw 'ReferenceError: You must provide an id to search for';
  //   if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
  //   let parsedId;
  //   try {
  //     parsedId = ObjectId(id); 
  //   } catch (error) {
  //     throw SyntaxError;
  //   }

  //   const userCollection = await users();
  //   // userCollection.aggregate([
  //   //    {
  //   //       $project: {
  //   //          user_id: {
  //   //             $toString: "$_id"
  //   //          }
  //   //       }
  //   //    } ]);
  //   // const user = await userCollection.findOne({ _id: id }, {_id: 0});
  //   const user =await userCollection.findOne({_id: parsedId});

  //   if (!user) throw 'user not found';
  //   let tmpId = user._id;
  //   user._id = String(tmpId);
  //   return user;
  // },


  // async removeuser(id) {
  //   if (!id) throw 'ReferenceError: You must provide an id to search for';
  //   if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
    
  //   let parsedId;
  //   try {
  //     parsedId = ObjectId(id); 
  //   } catch (error) {
  //     throw SyntaxError;
  //   }

  //   const userCollection = await users();
  //   let user = null;
  //   try {
  //     user = await this.getuserById(id);
  //   } catch (e) {
  //     console.log(e);
  //     return;
  //   }
  //   const deletionInfo = await userCollection.removeOne({ _id: parsedId });
  //   if (deletionInfo.deletedCount === 0) {
  //     throw `Could not delete user with id of ${id}`;
  //   }
  //   return {"userId": id, "deleted": true};
  // },
};

module.exports = exportedMethods;
