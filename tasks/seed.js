const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const puzzle = require('./puzzle');
const users = data.users;
const rooms = data.rooms;
const words = data.words;

async function main() {

 
  const db = await dbConnection();
  await db.dropDatabase();

  await words.addWord('Rocket');
  await words.addWord('Computer');
  await words.addWord('Nation');
  await words.removeword('Rocket');

  let isAdded = await users.addUser("testuser", "1234");
  if(isAdded) console.log('user Added');
  else console.log("user not added");

  isAdded = await users.addUser("testuser2", "1234");
  if(isAdded) console.log('user Added');
  else console.log("user not added");

  let addedData = await rooms.createRoom('createuser');
  if(addedData) console.log('room created');
  else console.log('room not created');

  let result = await rooms.getRooms();
  if(result) console.log(result);

  result = await rooms.joinRoom(addedData.id, 'joinuser');
  if(result) console.log('user joined');
  else console.log('user is not joined');
  
  result = await rooms.getRooms();
  if(result) console.dir(result, {'maxArrayLength': null, depth:null});

  result = await rooms.readyUser(addedData.id, 'joinuser');
  if(result) console.log('user id ready');
  else console.log('user is not ready');

  result = await rooms.getRooms();
  if(result) console.dir(result, {'maxArrayLength': null, depth:null});

  result = await rooms.startRoom(addedData.id);
  if(result) console.log('room started');
  else console.log('room is not started');

  result = await rooms.getRooms();
  if(result) console.log(result);

  // result = await rooms.removeRoom(addedData[0].id);
  // if(result) console.log('room removed');
  // else console.log('room is not removed');

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
