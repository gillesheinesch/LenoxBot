const { Event } = require('klasa');

module.exports = class extends Event {

	run(members, guild) {
		if (this.client.ready) console.log(`received ${members.size} members from ${guild.name}`);
	}
}; // using this event just to handle member chunks when they are recieved