require('dotenv').config();
const path = require('path');
const shard = false;

module.exports = {
	Client: require(path.resolve(__dirname, './lib/LenoxClient')),
	ModLog: require(path.resolve(__dirname, './lib/classes/modlogs')),
	Music: require(path.resolve(__dirname, './lib/classes/music'))
};

module.exports = require(`./${shard ? 'shard' : 'bot'}`);
