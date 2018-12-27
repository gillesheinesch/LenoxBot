const Discord = require('discord.js');
const mongodb = require('mongodb');
const assert = require('assert');
const Commando = require('discord.js-commando');
const guildsettingskeys = require('../guildsettings-keys.json');
const usersettingskeys = require('../usersettings-keys.json');

class LenoxBotSettingsProvider extends Commando.SettingProvider {
	constructor(settings) {
		super();
		this.url = `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/?authMechanism=DEFAULT&authSource=admin`;

		this.guildSettings = new Map();
		this.userSettings = new Map();
		this.listeners = new Map();
		this.isReady = false;
	}

	async init(client) {
		try {
			this.dbClient = await mongodb.MongoClient.connect(this.url, { useNewUrlParser: true });
			console.log('Connected to mongodb');
		} catch (err) {
			console.log(err);
			process.exit(-1);
		}

		this.db = this.dbClient.db('lenoxbot');
		const guildSettingsCollection = this.db.collection('guildSettings');
		const guildSettings = this.guildSettings;
		const userSettingsCollection = this.db.collection('userSettings');
		const userSettings = this.userSettings;

		await guildSettingsCollection.createIndex('guildId', { unique: true });
		await userSettingsCollection.createIndex('userId', { unique: true });

		/* eslint guard-for-in: 0 */
		for (const guild in client.guilds.array()) {
			try {
				const result = await guildSettingsCollection.findOne({ guildId: client.guilds.array()[guild].id });
				let settings = undefined;

				if (!result) {
					// Can't find DB make new one.
					settings = guildsettingskeys;
					guildSettingsCollection.insertOne({ guildId: client.guilds.array()[guild].id, settings: settings });
				}

				if (result && result.settings) {
					settings = result.settings;
				}

				guildSettings.set(client.guilds.array()[guild].id, settings);
			} catch (err) {
				console.warn(`Error while creating document of guild ${client.guilds.array()[guild].id}`);
				console.warn(err);
			}
		}

		try {
			const result = await guildSettingsCollection.findOne({ guildId: 'global' });
			let settings = undefined;

			if (!result) {
				// Could not load global, do new one
				settings = {};
				guildSettingsCollection.insertOne({ guildId: 'global', settings: settings });
				this.setupGuild('global', settings);
			}

			if (result && result.settings) {
				settings = result.settings;
			}

			guildSettings.set('global', settings);
		} catch (err) {
			console.warn('Error while creating global document');
			console.warn(err);
		}

		for (const user in client.users.array()) {
			try {
				const result = await userSettingsCollection.findOne({ userId: client.users.array()[user].id });
				let settings = undefined;

				if (!result) {
					// Can't find DB make new one.
					settings = usersettingskeys;
					userSettingsCollection.insertOne({ userId: client.users.array()[user].id, settings: settings });
				}

				if (result && result.settings) {
					settings = result.settings;
				}

				userSettings.set(client.users.array()[user].id, settings);
			} catch (err) {
				console.warn(`Error while creating document of user ${client.users.array()[user].id}`);
				console.warn(err);
			}
		}

		try {
			const result = await userSettingsCollection.findOne({ userId: 'global' });
			let settings = undefined;

			if (!result) {
				// Could not load global, do new one
				settings = {};
				userSettingsCollection.insertOne({ userId: 'global', settings: settings });
			}

			if (result && result.settings) {
				settings = result.settings;
			}

			userSettings.set('global', settings);
		} catch (err) {
			console.warn('Error while creating global document');
			console.warn(err);
		}

		this.isReady = true;

		if (this.readyCallback) {
			this.readyCallback();
		}

		this.listeners
			.set('commandPrefixChange', (guild, prefix) => this.set(guild, 'prefix', prefix))
			.set('commandStatusChange', (guild, command, enabled) => this.set(guild, `cmd-${command.name}`, enabled))
			.set('groupStatusChange', (guild, group, enabled) => this.set(guild, `grp-${group.id}`, enabled))
			.set('guildCreate', guild => {
				const settings = this.guildSettings.get(guild.id);
				if (!settings) return;
				this.setupGuild(guild.id, settings);
			})
			.set('commandRegister', command => {
				for (const [guild, settings] of this.guildSettings) {
					if (guild !== 'global' && !client.guilds.has(guild)) continue;
					this.setupGuildCommand(client.guilds.get(guild), command, settings);
				}
			})
			.set('groupRegister', group => {
				for (const [guild, settings] of this.guildSettings) {
					if (guild !== 'global' && !client.guilds.has(guild)) continue;
					this.setupGuildGroup(client.guilds.get(guild), group, settings);
				}
			});
		for (const [event, listener] of this.listeners) client.on(event, listener);
	}

	destroy() {
		// Remove all listeners from the client
		for (const [event, listener] of this.listeners) this.client.removeListener(event, listener);
		this.listeners.clear();
	}

	async set(guild, key, val) {
		guild = this.constructor.getGuildID(guild);
		let settings = this.guildSettings.get(guild);
		if (!settings) {
			settings = {};
			this.guildSettings.set(guild, settings);
		}

		settings[key] = val;
		const settingsCollection = this.db.collection('guildSettings');

		await settingsCollection.updateOne({ guildId: guild }, { $set: { settings: settings } });
		return val;
	}

	async remove(guild, key, val) {
		guild = this.constructor.getGuildID(guild);
		let settings = this.guildSettings.get(guild);
		if (!settings) {
			settings = {};
			this.guildSettings.set(guild, settings);
		}

		val = settings[key];
		settings[key] = undefined;
		const settingsCollection = this.db.collection('guildSettings');

		await settingsCollection.save({
			guildId: guild,
			settings: settings
		});
		return val;
	}


	async clear(guild) {
		guild = this.constructor.getGuildID(guild);
		if (!this.settings.has(guild)) return;
		this.settings.delete(guild);
		const settingsCollection = this.db.collection('guildSettings');
		await this.settingsCollection.deleteOne({
			guildId: guild
		});
	}

	get(guild, key, defVal) {
		const settings = this.guildSettings.get(this.constructor.getGuildID(guild));
		return settings ? typeof settings[key] === 'undefined' ? defVal : settings[key] : defVal;
	}

	getDatabase() {
		return this.db;
	}

	whenReady(callback) {
		this.readyCallback = callback;
	}

	/**
	 * Sets the guild up in the db for usage.
	 * @param {snowflake} guildId
	 * @param {object containing properties} settings
	 */
	setupGuild(guild, settings) {
		if (typeof guild !== 'string') throw new TypeError('The guild must be a guild ID or "global".');
		guild = this.client.guilds.get(guild) || null;

		// Load the command prefix
		if (typeof settings.prefix !== 'undefined') {
			if (guild) guild._commandPrefix = settings.prefix;
			else this.client._commandPrefix = settings.prefix;
		}

		// Load all command/group statuses
		for (const command of this.client.registry.commands.values()) this.setupGuildCommand(guild, command, settings);
		for (const group of this.client.registry.groups.values()) this.setupGuildGroup(guild, group, settings);
	}

	setupGuildCommand(guild, command, settings) {
		if (typeof settings[`cmd-${command.name}`] === 'undefined') return;
		if (guild) {
			if (!guild._commandsEnabled) guild._commandsEnabled = {};
			guild._commandsEnabled[command.name] = settings[`cmd-${command.name}`];
		} else {
			command._globalEnabled = settings[`cmd-${command.name}`];
		}
	}

	setupGuildGroup(guild, group, settings) {
		if (typeof settings[`grp-${group.id}`] === 'undefined') return;
		if (guild) {
			if (!guild._groupsEnabled) guild._groupsEnabled = {};
			guild._groupsEnabled[group.id] = settings[`grp-${group.id}`];
		} else {
			group._globalEnabled = settings[`grp-${group.id}`];
		}
	}
}

module.exports = LenoxBotSettingsProvider;
