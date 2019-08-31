const { Event } = require("klasa");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			enabled: true,
			once: true
		});
	}

	async run() {
		this.client.setMaxListeners(Infinity); // change the clients event listener max amount

		this.client.user.setPresence({
			activity: {
				name: `${this.client.options.prefix}help | www.lenoxbot.com`,
				type: 0
			},
			status: 'online'
		}).then(() => {
			console.log('Successfully updated the bots presence.');
		}).catch(console.error);
	}
};
