require('dotenv').config();
const path = require('path');
const shard = false;

module.exports = {
	Client: require(path.resolve(__dirname, './lib/HighlightClient'))
};

module.exports = require(`./${shard ? 'shard' : 'bot'}`);