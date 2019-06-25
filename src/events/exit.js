const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { emitter: process });
	}

	run(code) {
		this.client.logger.info(`Process exited with exit code ${code}`);
		if (this.client.ready && this.client.channels.has(process.env.INFO_CONSOLE_LOG)) this.client.channels.get(process.env.INFO_CONSOLE_LOG).send(null, {
			embed: {
				color: 5892826,
				timestamp: new Date(),
				title: `Process Exited`,
				description: `\`Process exited with exit code ${code}\``
			}
		});
		this.client.shutdown();
	}

	init() {
		if (this.client.options.production) this.disable();
	}

};