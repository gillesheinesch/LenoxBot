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
    }
    
    async init(client) {
        this.dbClient.connect(function(err) {
            assert.strictEqual(null, err);
            console.log("Connected to mongodb");

            this.db = this.dbClient.db("lenoxbot");

            client.guilds.every(function(guild) {
                const settingsCollection = db.collection('guildSettings');
                
                //Load
            });
        });
    }

    getDatabase() {
        return this.db;
    }
}