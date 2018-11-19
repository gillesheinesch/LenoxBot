const Discord = require("discord.js");
const mongodb = require("mongodb");
const assert = require("assert");
const Commando = require("discord.js-commando");

module.exports = class LenoxBotSettingsProvider extends Commando.SettingProvider { 

    constructor(settings) {
        super();
        const url = `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/?authMechanism=DEFAULT`;

        this.dbClient = new mongodb.MongoClient(url);
        this.guildSettings = new Map();
        this.listeners = new Map();
    }
    
    async init(client) {
        this.dbClient.connect(function(err) {
            assert.strictEqual(null, err);
            console.log("Connected to mongodb");

            this.db = this.dbClient.db("lenoxbot");
            const settingsCollection = db.collection('guildSettings');

            settingsCollection.createIndex("guildId", {unique: true});

            client.guilds.every(function(guild) {
                settingsCollection.findOne({'guildId': guild.id}).then((err, result) => {
                    if(err) {
                        //Can't find DB make new one.

                    }

                    this.guildSettings.set(guild.id, result.settings);
                })
            });
        });

        this.listeners
        .set('commandPrefixChange', (guild, prefix) => this.set(guild, 'prefix', prefix))
        .set('commandStatusChange', (guild, command, enabled) => this.set(guild, `cmd-${command.name}`, enabled))
        .set('groupStatusChange', (guild, group, enabled) => this.set(guild, `grp-${group.id}`, enabled))
        .set('guildCreate', guild => {
            const settings = this.guildSettings.get(guild.id);
            if(!settings) return;
            this.setupGuild(guild.id, settings);
        })
        .set('commandRegister', command => {
            for(const [guild, settings] of this.guildSettings) {
                if(guild !== 'global' && !client.guilds.has(guild)) continue;
                this.setupGuildCommand(client.guilds.get(guild), command, settings);
            }
        })
        .set('groupRegister', group => {
            for(const [guild, settings] of this.guildSettings) {
                if(guild !== 'global' && !client.guilds.has(guild)) continue;
                this.setupGuildGroup(client.guilds.get(guild), group, settings);
            }
        });
        for(const [event, listener] of this.listeners) client.on(event, listener);
    }

    async destroy() {
        // Remove all listeners from the client
		for(const [event, listener] of this.listeners) this.client.removeListener(event, listener);
        this.listeners.clear();
    }

    async set(guild, key, val) {
        guild = this.constructor.getGuildID(guild);
        let settings = this.guildSettings.get(guild);
        if(!settings) {
			settings = {};
			this.guildSettings.set(guild, settings);
        }

        settings[key] = val;
        const settingsCollection = this.db.collection('guildSettings');

        await settingsCollection.save({'guildId': guild, 'settings': settings});
        return val;
    }

    async remove(guild, key, val) {
        guild = this.constructor.getGuildID(guild);
        let settings = this.guildSettings.get(guild);
        if(!settings) {
			settings = {};
			this.guildSettings.set(guild, settings);
        }

        const val = settings[key];
        settings[key] = undefined;
        const settingsCollection = this.db.collection('guildSettings');

        await settingsCollection.save({'guildId': guild, 'settings': settings});
        return val;
    }

    
	async clear(guild) {
		guild = this.constructor.getGuildID(guild);
		if(!this.settings.has(guild)) return;
        this.settings.delete(guild);
        const settingsCollection = this.db.collection('guildSettings');
		await this.settingsCollection.deleteOne({'guildId': guild});
    }

    get(guild, key, defVal) {
        const settings = this.guildSettings.get(this.constructor.getGuildID(guild));
        return settings ? typeof settings[key] !== 'undefined' ? settings[key] : defVal : defVal;
    }

    getDatabase() {
        return this.db;
    }

    /**
     * Sets the guild up in the db for usage.
     * @param {snowflake} guildId 
     * @param {object containing properties} settings 
     */
    setupGuild(guildId, settings) {

    }

    setupGuildCommand(guildId, command, setting) {

    }

    setupGuildGroup(guildId, command, setting) {

    }
}