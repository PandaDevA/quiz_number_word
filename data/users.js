const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const result = await userCollection.find().toArray();
        return result;
    },

    async getUserByName(username, password = undefined) {
        const userCollection = await users();
        const user = await userCollection.findOne({ userName: username });
        if (!user) {
            // console.log(`Error: user "${username}" not exist while getUserByName`);
            return false;
        }

        if (password === undefined) return user;

        if (user.password != password) {
            // console.log(`Error: user "${username}" password is not correct while getUserByName`);
            return false;
        }

        return user;
    },

    async addUser(data) {
        const userCollection = await users();
        const user = await this.getUserByName(data.username);
        if (user) {
            console.log('user is already registered');
            return {result: false, error: 'The user is already registered'};
        }

        const newuser = {
            userName: data.username,
            password: data.password,
            email: data.email,
            avatar: '',
            point: 1000,
            heart: 3,
            coin: 50,
            lastDate: 0,
            lastTime: 24,
        };
        if(data.avatar) {
            newuser.avatar = data.avatar;
        }

        const newInsertInformation = await userCollection.insertOne(newuser);
        if (newInsertInformation.insertedCount === 0) {
            // console.log('Could not add user');
            return {result: false, error: 'Internal server error while register user'};
        }

        return {result: true};
    },

    async addUserValue(username, data) {

        const userCollection = await users();
        const user = await userCollection.findOne({ userName: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while addUserValue`);
            return false;
        }

        const updatedUserData = user;

        if (data.point) updatedUserData.point += data.point;
        if (data.coin) updatedUserData.coin += data.coin;
        if (updatedUserData.coin > 1000) updatedUserData.coin = 1000;
        if (data.heart) updatedUserData.heart += data.heart;
        if (updatedUserData.heart > 3) updatedUserData.heart = 3;

        await userCollection.updateOne({ _id: user._id }, { $set: updatedUserData });

        return updatedUserData;
    },

    async delUserValue(username, data) {

        const userCollection = await users();
        const user = await userCollection.findOne({ userName: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while delUserValue`);
            return {result: false, error: 'The user name could not find in server'};
        }

        const updatedUserData = user;

        if (data.now_day && user.lastDate == data.now_day) return {result: false, error: 'Please wait until tomorrow'};
        else updatedUserData.lastDate = data.now_day;

        if (data.now_time && user.lastTime / 4 == data.now_time / 4) return {result: false, error: 'Please wait until the next 4 hours'};
        else updatedUserData.lastTime = data.now_time;

        if (data.coin) {
            if (updatedUserData.coin < data.coin) return {result: false, error: 'You need more coins'};
            updatedUserData.coin -= data.coin;
        }
        if (data.heart) {
            if (updatedUserData.heart < data.heart) return {result: false, error: 'Please wait until heart is supplied'};
            updatedUserData.heart -= data.heart;
        }

        await userCollection.updateOne({ _id: user._id }, { $set: updatedUserData });

        return {result: updatedUserData};
    },
};

module.exports = exportedMethods;