const { Event } = require('klasa');

module.exports = class extends Event {
	run(warning) {
		try {
			this.client.console.warn(warning);
			if (this.client.ready && this.client.channels.has(process.env.WARNING_CONSOLE_LOG)) this.client.channels.get(process.env.WARNING_CONSOLE_LOG).send(null, {
				embed: {
					color: 12696890,
					timestamp: new Date(),
					title: 'Warn',
					description: `\`\`\`\n${warning}\n\`\`\``
				}
			});
		} catch (error) {
			console.error(error.stack ? error.stack : error.toString());
		}
	}

	init() {
		if (!this.client.options.consoleEvents.warn) this.disable();
	}
};