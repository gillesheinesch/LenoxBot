const { Event } = require('klasa');
const ModLog = require('../lib/classes/modlogs');

module.exports = class extends Event {
	run(guild, user) {
		if (this.client.ready) {
			if (guild.settings.get('moderations.modlogs_enabled')) {
				ModLog()
					.setAction('ban')
					.setUser(user)
					.send()
			}
		}
	}
};