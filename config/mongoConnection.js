const MongoClient = require('mongodb').MongoClient;
const settings = {
    mongoConfig: {
        serverUrl: 'mongodb://localhost:8002/',
        database: 'Puzzle_number_word'
        //  serverUrl: 'mongodb+srv://admin:%21QAZxsw2@puzzle.am9gf.mongodb.net/test?authSource=admin&replicaSet=atlas-h19s4z-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
        //  database: 'Puzzle_word_number'
    }
};
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async() => {
    if (!_connection) {
	try {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        _db = await _connection.db(mongoConfig.database);
	} catch (e) {
	    console.log('Could not connect database');
	    process.exit(0);
	}
    }

    return _db;
};