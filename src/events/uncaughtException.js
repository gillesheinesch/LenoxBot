const { Event } = require('klasa');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, { emitter: process });
	}

	run(err) {
		if (!err) return;
		const errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
		if (this.client.ready && this.client.channels.has(process.env.ERROR_CONSOLE_LOG)) {
			this.client.channels.get(process.env.ERROR_CONSOLE_LOG).send(null, {
				embed: {
					color: 15684432,
					timestamp: new Date(),
					title: 'Uncaught Exception',
					description: `\`\`\`x86asm\n${errorMsg.slice(0, 2048)}\n\`\`\``,
					fields: [
						{
							name: 'Error Name:',
							value: `\`${err.name || 'N/A'}\``
						}, {
							name: 'Error Message:',
							value: `\`${err.message || 'N/A'}\``
						}
					]
				}
			}).catch(console.error);
		}
		this.client.emit('error', `Uncaught Exception Error: \n${errorMsg}`);
	}

	init() {
		if (this.client.options.production) this.disable();
	}
};
