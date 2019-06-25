const { Event } = require('klasa');

module.exports = class extends Event {

	run(data) {
		try {
			this.client.console.log(data);
			if (this.client.ready && this.client.channels.has(process.env.LOGS_CONSOLE_LOG)) this.client.channels.get(process.env.LOGS_CONSOLE_LOG).send(null, {
				embed: {
					color: 54527,
					timestamp: new Date(),
					title: 'Log',
					description: `\`\`\`\n${data.replace(/(?:\u001b\[(?:[0-9]+(?:\;[0-9]+)?)\m)/g, '')}\n\`\`\``
				}
			});
		} catch (error) {
			return console.error(error.stack ? error.stack : error.toString());
		}
	}

	init() {
		if (!this.client.options.consoleEvents.log) this.disable();
	}

};