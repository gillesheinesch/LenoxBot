const { Command } = require('klasa');
const axios = require('axios');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PLAY_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_PLAY_EXTENDEDHELP'),
			usage: '<query:str>'
		});
		this.MESSAGE_CHAR_LIMIT = 2000;
	}

	async run(message, [query]) {
		//
	}
};
