const { Event } = require('klasa');

module.exports = class extends Event {

	run(debug) {
		try {
			if (this.client.ready) this.client.console.debug(debug);
			if (this.client.ready && this.client.channels.has(process.env.DEBUG_CONSOLE_LOG)) this.client.channels.get(process.env.DEBUG_CONSOLE_LOG).send(null, {
				embed: {
					color: 11272447,
					timestamp: new Date(),
					title: 'Debug',
					description: `\`\`\`\n${debug}\n\`\`\``
				}
			});
		} catch (error) {
			return console.error(error.stack ? error.stack : error.toString());
		}
	}

	init() {
		if (!this.client.options.consoleEvents.debug) this.disable();
	}

};