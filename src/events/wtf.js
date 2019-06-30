const { Event } = require('klasa');

module.exports = class extends Event {
	run(failure) {
		try {
			this.client.console.wtf(failure.stack ? failure.stack : failure);
			if (this.client.ready && this.client.channels.has(process.env.WTF_CONSOLE_LOG)) {
				this.client.channels.get(process.env.WTF_CONSOLE_LOG).send(null, {
					embed: {
						color: 15684432,
						timestamp: new Date(),
						title: 'WTF',
						description: `\`\`\`\n${typeof (failure) === 'string' ? failure.replace(/(?:\u001b\[(?:[0-9]+(?:\;[0-9]+)?)\m)/g, '') : failure.toString().replace(/(?:\u001b\[(?:[0-9]+(?:\;[0-9]+)?)\m)/g, '')}\n\`\`\``
					}
				});
			}
		} catch (error) {
			return console.error(error.stack ? error.stack : error.toString());
		}
	}

	init() {
		if (!this.client.options.consoleEvents.wtf) this.disable();
	}
};
