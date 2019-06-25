const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { emitter: process });
	}

	run(err) {
		if (!err || err.name === 'DiscordAPIError') return;
		if (this.client.ready && this.client.channels.has(process.env.ERROR_CONSOLE_LOG)) this.client.channels.get(process.env.ERROR_CONSOLE_LOG).send(null, {
			embed: {
				color: 15684432,
				timestamp: new Date(),
				title: 'Unhandled Rejection | Uncaught Promise error:',
				description: `\`\`\`x86asm\n${(err.stack || err.toString()).slice(0, 2048)}\n\`\`\``,
				fields: [
					{
						name: 'Error Message:',
						value: `\`${err.message || 'N/A'}\``
					}
				]
			}
		});
	}

	init() {
		if (this.client.options.production) this.disable();
	}

};