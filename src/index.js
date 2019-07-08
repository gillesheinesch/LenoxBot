require('dotenv').config();
const shard = false;

module.exports = {
	Client: require('./lib/LenoxClient'),
	ModLog: require('./lib/classes/modlogs')
};

module.exports = require(`./${shard ? 'shard' : 'bot'}`);
