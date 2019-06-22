const mongodb = require('mongodb');
const settings = require('../../settings');
const mongoUrl = `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/?authMechanism=DEFAULT&authSource=admin`;

let db;
async function dbInit() {
	const dbClient = await mongodb.MongoClient.connect(mongoUrl, {
		useNewUrlParser: true
	});

	db = dbClient.db('lenoxbot');
}

async function botSettingsCollection() {
	if (!db) {
		await dbInit();
	}
	return db.collection('botSettings');
}

module.exports = {
	botSettingsCollection: botSettingsCollection
};

