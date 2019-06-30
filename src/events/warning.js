const { Event } = require('klasa');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, { emitter: process });
	}

	run(warning) {
		try {
			if (!this.client.ready) return console.warn(warning.toString());
			if (this.client.channels.has(process.env.WARNING_CONSOLE_LOG)) {
				this.client.channels.get(process.env.WARNING_CONSOLE_LOG).send(null, {
					embed: {
						color: 12696890,
						timestamp: new Date(),
						title: 'Process Warning',
						description: warning.stack ? `\`\`\`x86asm\n${warning.stack}\n\`\`\`` : '`N/A`',
						fields: [
							{
								name: 'Warning:',
								value: `\`${warning.toString() || 'N/A'}\``
							}, {
								name: 'Warning Name:',
								value: `\`${warning.name || 'N/A'}\``
							}, {
								name: 'Warning Message:',
								value: `\`${warning.message || 'N/A'}\``
							}
						]
					}
				});
			}
		} catch (error) {
			console.error(error.toString());
		}
	}
};
