const { Event } = require('klasa');

module.exports = class extends Event {
	run(guild, user) {
		/*if (this.client.ready) {
			if (guild.guild.get('moderations.modlogs_enabled')) {
				new ModLog(guild)
					.setAction('ban')
					.setModerator(message.author)
					.setUser(user)
					.setReason(reason)
					.send()
			}
		}*/
	}
};