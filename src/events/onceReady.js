const { Event, util } = require('klasa');
const { Team } = require('discord.js');
let retries = 0;

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true,
			event: 'ready'
		});
	}

	async run() {
		try {
			this.client.setMaxListeners(Infinity); // change the clients event listener max amount to get rid of the max event listener warnings
			try {
				await this.client.fetchApplication();
			} catch (err) {
				if (++retries === 3) return process.exit();
				this.client.emit('warning', `Unable to fetchApplication at this time, waiting 5 seconds and retrying. Retries left: ${retries - 3}`);
				await util.sleep(5000);
				return this.run();
			}
			if (!this.client.options.owners.length) {
				if (this.client.application.owner instanceof Team) this.client.options.owners.push(...this.client.application.owner.members.keys());
				else this.client.options.owners.push(this.client.application.owner.id);
			}

			const clientStorage = this.client.gateways.get('clientStorage');
			// Added for consistency with other datastores, Client#clients does not exist
			clientStorage.cache.set(this.client.user.id, this.client);
			this.client.settings = clientStorage.create(this.client, this.client.user.id);
			await this.client.gateways.sync();

			// Init the schedule
			await this.client.schedule.init();
			
			// Init all the pieces
			await Promise.all(this.client.pieceStores.filter(store => !['providers', 'extendables'].includes(store.name)).map(store => store.init()));
			util.initClean(this.client);
			global.starting = false;
			this.client.ready = true;

			this.client.user.setPresence({
				activity: {
					name: `${this.client.options.prefix}help | www.lenoxbot.com`,
					type: 0
				},
				status: 'online'
			}).then(() => {
				console.log('Successfully updated the bots presence.');
			}).catch(console.error);

			if (this.client.ready && this.client.channels.has(process.env.BOT_CONNECTION_LOG)) {
				this.client.channels.get(process.env.BOT_CONNECTION_LOG).send({
					embed: {
						color: 6732650,
						title: 'Ready',
						timestamp: new Date(),
						description: `Ready in: \`${parseInt(new Date() - global.startTime)}ms\``
					}
				}).catch(console.error);
			}

			if (this.client.options.readyMessage !== null) {
				this.client.emit('log', util.isFunction(this.client.options.readyMessage) ? this.client.options.readyMessage(this.client) : this.client.options.readyMessage);
			}

			return this.client.emit('klasaReady');
		} catch (error) {
			console.error(error.stack ? error.stack : error.toString());
		}
	}
};