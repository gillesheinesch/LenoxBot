const mongodb = require('mongodb');
const settings = require('../settings');

const mongoUrl = `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/?authMechanism=DEFAULT&authSource=admin`;

let db;
async function connectDB() {
  const dbClient = await mongodb.MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  if (settings.NODE_ENV === 'production') {
    db = dbClient.db('lenoxbot');
  }
  else {
    db = dbClient.db('betalenoxbot');
  }

  module.exports = db.collection('userSettings');
}

connectDB().catch((error) => {
  console.log(error);
});
