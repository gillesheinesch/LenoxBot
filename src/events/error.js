const { Event } = require('klasa');

module.exports = class extends Event {
	run(error) {
		try {
			this.client.console.error(error);
			if (this.client.ready && this.client.channels.has(process.env.ERROR_CONSOLE_LOG)) this.client.channels.get(process.env.ERROR_CONSOLE_LOG).send(null, {
				embed: {
					color: 15684432,
					timestamp: new Date(),
					title: 'Error',
					description: error.stack ? `\`\`\`x86asm\n${error.stack}\n\`\`\`` : `\`${error.toString()}\``
				}
			});
		} catch (error) {
			return console.error(error.stack ? error.stack : error.toString());
		}
	}

	init() {
		if (!this.client.options.consoleEvents.error) this.disable();
	}
};