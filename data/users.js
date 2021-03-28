const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

const exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const result = await userCollection.find().toArray();
    return result;
  },

  async getUserByEmail(email) {
    if (!email) {
      console.log('Error: email is not referred while getUserByEmail');
      return undefined;
    }

    const userCollection = await users();
    const user =await userCollection.findOne({email: email});

    if (!user) {
      console.log(`Error: user "${email}" not exist while getUserByEmail`);
      return undefined;
    }

    return user;
  },

  async addUser(email, password) {
    if(email === undefined || password ===undefined) {
      console.log("Failed in AddUser! Email or Password is undefined");
      return false;
    }

    const userCollection = await users();

    const newuser = {
      email: email,
      password: password,
      point: 1000,
      socketId: null,
    };

    const newInsertInformation = await userCollection.insertOne(newuser);
    if (newInsertInformation.insertedCount === 0) {
      console.log('Could not add user');
      return false;
    }
    return true;
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

  // async updateuser(id, updateduser) {
  //   if (!id) throw 'ReferenceError: You must provide an id to search for';
  //   if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
  //   let parsedId;
  //   try {
  //     parsedId = ObjectId(id); 
  //   } catch (error) {
  //     throw SyntaxError;
  //   }

  //   const userCollection = await users();

  //   const updateduserData = {};

  //   if(updateduser.author === undefined) throw ReferenceError;
  //   if(typeof(updateduser.author) != 'object') throw TypeError;
  //   if(typeof(updateduser.author.authorFirstName) != 'string' || updateduser.author.authorFirstName.trim() == '') throw TypeError;
  //   if(typeof(updateduser.author.authorLastName) != 'string' || updateduser.author.authorLastName.trim() == '') throw TypeError;
  //   updateduserData.author = updateduser.author;

  //   if(updateduser.title === undefined) throw ReferenceError;
  //   if(typeof(updateduser.title)!='string' || updateduser.title.trim() == '') throw TypeError;
  //   updateduserData.title = updateduser.title;

  //   if (updateduser.genre === undefined) throw ReferenceError;
  //   if(!Array.isArray(updateduser.genre) || updateduser.genre.length == 0 || typeof(updateduser.genre[0]) != 'string' || updateduser.genre[0].trim()=='') throw TypeError;
  //   updateduserData.genre = updateduser.genre;

  //   if(updateduser.datePublished === undefined || typeof(updateduser.datePublished) != 'string')  throw TypeError;
  //   const pubDate = new Date(updateduser.datePublished);
  //   if(isNaN(Date.parse(pubDate))) throw TypeError;
  //   let curDate = new Date();
  //   if(pubDate < new Date('1/1/1930') || pubDate > curDate) throw RangeError;
  //   updateduserData.datePublished = updateduser.datePublished;

  //   if (updateduser.summary === undefined) throw ReferenceError;
  //   if(typeof(updateduser.summary)!='string' || updateduser.summary.trim() == '') throw TypeError;
  //   updateduserData.summary = updateduser.summary;

  //   const updatedInfo = await userCollection.updateOne({ _id: parsedId }, { $set: updateduserData });

  //   if (updatedInfo.modifiedCount === 0) {
  //     throw 'could not update movie successfully';
  //   }

  //   return await this.getuserById(id);
  // },
};

module.exports = exportedMethods;
