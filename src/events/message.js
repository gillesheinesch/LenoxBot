const { Event } = require('klasa');

module.exports = class extends Event {
	async run(message) {
		try {
			if (this.client.ready) this.client.monitors.run(message);
		} catch (error) {
			console.error(error.stack ? error.stack : error.toString());
		}
	}

};