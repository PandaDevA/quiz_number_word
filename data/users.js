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
        const user = await userCollection.findOne({ username: username });

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

    async getUserInfo(username) {
        if (!username) {
            // console.log('Error: username is not referred while getUserInfo');
            return false;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while getUserInfo`);
            return false;
        }

        return user;
    },

    async addUser(username, password) {
        if (username === undefined || password === undefined) {
            // console.log("Failed in AddUser! Username or Password is undefined");
            return false;
        }

        const userCollection = await users();

        const newuser = {
            username: username,
            password: password,
            point: 1000,
            heart: 3,
            coin: 50,
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
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while getUserByName`);
            return false;
        }


        const updateduserData = user;
        if (updateduserData.isStartStage) {
            if (updateduserData.heart == 0) {
                console.log('heart is already zero');
                return false;
            }
            updateduserData.heart--;
        } else
            updateduserData.isStartStage = true;

        const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update isStartStage successfully');
            return false;
        }

        return updateduserData;
    },

    async cancelStage(username) {
        if (!username || username == '') {
            console.log('ReferenceError: Username is not supplied while cancelStage');
            return false;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while getUserByName`);
            return false;
        }

        const updateduserData = user;
        if (!updateduserData.isStartStage) return updateduserData;
        updateduserData.isStartStage = false;

        const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update isStartStage successfully');
            return false;
        }

        return updateduserData;
    },


    async stopStage(username, data) {
        console.log(username);
        if (!username || !data) {
            console.log('ReferenceError: Username is not supplied while endStage');
            return false;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while getUserByName`);
            return false;
        }

        const updateduserData = user;
        updateduserData.isStartStage = false;

        if (data.isWin) {
            if (data.point) updateduserData.point += data.point;
            if (data.coin) updateduserData.coin += data.coin;
            if (updateduserData.coin > 100) updateduserData.coin = 100;
        } else {
            if (data.point) updateduserData.point += data.point;
            if (updateduserData.heart > 0) updateduserData.heart--;
        }

        const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update isStartStage successfully');
            return false;
        }

        return updateduserData;
    },

    async addUserValue(username, data) {
        if (!username || !data) {
            console.log('ReferenceError: Username is not supplied while addUserValue');
            return false;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while addUserValue`);
            return false;
        }

        const updateduserData = user;

        if (data.point) updateduserData.point += data.point;
        if (data.coin) updateduserData.coin += data.coin;
        if (updateduserData.coin > 100) updateduserData.coin = 100;
        if (data.heart) updateduserData.heart += data.heart;
        if (updateduserData.heart > 3) updateduserData.heart = 3;

        const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update UserValue successfully');
            return false;
        }

        return updateduserData;
    },

    async delUserValue(username, data) {
        if (!username || !data) {
            console.log('ReferenceError: Username is not supplied while delUserValue');
            return false;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while delUserValue`);
            return false;
        }

        const updateduserData = user;

        if (data.point) updateduserData.point -= data.point;
        if (updateduserData.point < 0) updateduserData.point = 0;
        if (data.coin) updateduserData.coin -= data.coin;
        if (updateduserData.coin < 0) updateduserData.coin = 0;
        if (data.heart) updateduserData.heart -= data.heart;
        if (updateduserData.heart < 0) updateduserData.heart = 0;

        const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update UserValue successfully');
            return false;
        }

        return updateduserData;
    },
};

module.exports = exportedMethods;