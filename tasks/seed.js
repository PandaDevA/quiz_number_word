const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const puzzle = require('./puzzle');
const users = data.users;
const rooms = data.rooms;
const words = data.words;

async function main() {


    const db = await dbConnection();
    await db.dropDatabase();

    await words.addWord({
        "word": "COMPUTER",
        "matchArray": ["COMPUTER", "COMPUTE", "COMPUT", "COMPU"]
    });
    await words.addWord({
        "word": "PASSWORD",
        "matchArray": ["PASSWORD", "PASSWOR", "PASSWO", "PASSW"]
    });
    await words.addWord({
        "word": "MONSTERS",
        "matchArray": ["MONSTERS", "MONSTER", "MONSTE", "MONST"]
    });
    // await words.removeword('Rocket');

    let isAdded = await users.addUser({username: "testuser", password: "1234", email: "testuser@gmail.com"});
    if (isAdded) console.log('user Added');
    else console.log("user not added");

    isAdded = await users.addUser({username: "testuser2", password: "1234", email: "testuser2@gmail.com"});
    if (isAdded) console.log('user Added');
    else console.log("user not added");

    let addedData = await rooms.createRoom({
        username: 'tournament',
        joiningFee: 10,
        startDateTime: new Date('4/20/2021 16:00:00'),
        prize: 30,
    });
    if (addedData) console.log(`room created: ${JSON.stringify(addedData)}`);
    else console.log('room not created');

    console.log('Done seeding database');

    await db.serverConfig.close();
}

main();