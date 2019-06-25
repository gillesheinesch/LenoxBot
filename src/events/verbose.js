const { Event } = require('klasa');

module.exports = class extends Event {

	run(log) {
		try {
			this.client.console.verbose(log);
			if (this.client.ready && this.client.channels.has(process.env.VERBOSE_CONSOLE_LOG)) this.client.channels.get(process.env.VERBOSE_CONSOLE_LOG).send(null, {
				embed: {
					color: 65330,
					timestamp: new Date(),
					title: 'Verbose',
					description: `\`\`\`\n${log.replace(/(?:\u001b\[(?:[0-9]+(?:\;[0-9]+)?)\m)/g, '')}\n\`\`\``
				}
			});
		} catch (error) {
			return console.error(error.stack ? error.stack : error.toString());
		}
	}

	init() {
		if (!this.client.options.consoleEvents.verbose) this.disable();
	}

};