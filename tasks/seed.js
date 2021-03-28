const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  let isAdded = await users.addUser("testuser@gmail.com", "123456");
  if(isAdded) console.log('user Added');
  else console.log("user can't add");

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
