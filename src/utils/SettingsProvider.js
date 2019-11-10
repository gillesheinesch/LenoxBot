const mongodb = require('mongodb');
const Commando = require('discord.js-commando');
const settings = require('../settings.json');
const guildsettingskeys = require('../guildsettings-keys.json');
const usersettingskeys = require('../usersettings-keys.json');
const botsettingskeys = require('../botsettings-keys.json');

class LenoxBotSettingsProvider extends Commando.SettingProvider {
  constructor(settings) {
    super();
    this.url = `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/?authMechanism=DEFAULT&authSource=admin`;

    this.guildSettings = new Map();
    this.userSettings = new Map();
    this.botSettings = new Map();
    this.listeners = new Map();
    this.isReady = false;
  }

  async init(client) {
    try {
      this.dbClient = await mongodb.MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to mongodb');
    }
    catch (err) {
      console.log(err);
      process.exit(-1);
    }

    this.client = client;
    if (settings.NODE_ENV === 'production') {
      this.db = this.dbClient.db('lenoxbot');
    }
    else {
      this.db = this.dbClient.db('betalenoxbot');
    }
    const guildSettingsCollection = this.db.collection('guildSettings');
    const { guildSettings } = this;
    const userSettingsCollection = this.db.collection('userSettings');
    const { userSettings } = this;
    const botSettingsCollection = this.db.collection('botSettings');
    const { botSettings } = this;

    await guildSettingsCollection.createIndex('guildId', { unique: true });
    await userSettingsCollection.createIndex('userId', { unique: true });
    await botSettingsCollection.createIndex('botconfs', { unique: true });

    /* eslint guard-for-in: 0 */
    for (const guild in client.guilds.array()) {
      try {
        const result = await guildSettingsCollection.findOne({ guildId: client.guilds.array()[guild].id });
        let settings;

        if (!result) {
          // Can't find DB make new one.
          settings = guildsettingskeys;
          guildSettingsCollection.insertOne({ guildId: client.guilds.array()[guild].id, settings });
        }

        if (result && result.settings) {
          settings = result.settings;
        }

        guildSettings.set(client.guilds.array()[guild].id, settings);
      }
      catch (err) {
        console.warn(`Error while creating document of guild ${client.guilds.array()[guild].id}`);
        console.warn(err);
      }
    }

    try {
      const result = await guildSettingsCollection.findOne({ guildId: 'global' });
      let settings;

      if (!result) {
        // Could not load global, do new one
        settings = {};
        guildSettingsCollection.insertOne({ guildId: 'global', settings });
        this.setupGuild('global', settings);
      }

      if (result && result.settings) {
        settings = result.settings;
      }

      guildSettings.set('global', settings);
    }
    catch (err) {
      console.warn('Error while creating guild global document');
      console.warn(err);
    }

    for (const user in client.users.array()) {
      try {
        const result = await userSettingsCollection.findOne({ userId: client.users.array()[user].id });
        let settings;

        if (!result) {
          // Can't find DB make new one.
          settings = usersettingskeys;
          userSettingsCollection.insertOne({ userId: client.users.array()[user].id, settings });
        }

        if (result && result.settings) {
          settings = result.settings;
        }

        userSettings.set(client.users.array()[user].id, settings);
      }
      catch (err) {
        console.warn(`Error while creating document of user ${client.users.array()[user].id}`);
        console.warn(err);
      }
    }

    try {
      const result = await userSettingsCollection.findOne({ userId: 'global' });
      let settings;

      if (!result) {
        // Could not load global, do new one
        settings = {};
        userSettingsCollection.insertOne({ userId: 'global', settings });
      }

      if (result && result.settings) {
        settings = result.settings;
      }

      userSettings.set('global', settings);
    }
    catch (err) {
      console.warn('Error while creating user global document');
      console.warn(err);
    }

    try {
      const result = await botSettingsCollection.findOne({ botconfs: 'botconfs' });
      let settings;

      if (!result) {
        // Can't find DB make new one.
        settings = botsettingskeys;
        botSettingsCollection.insertOne({ botconfs: 'botconfs', settings });
      }

      if (result && result.settings) {
        settings = result.settings;
      }

      botSettings.set('botconfs', settings);
    }
    catch (err) {
      console.warn('Error while creating document of botconfs');
      console.warn(err);
    }

    try {
      const result = await botSettingsCollection.findOne({ botconfs: 'global' });
      let settings;

      if (!result) {
        // Could not load global, do new one
        settings = {};
        botSettingsCollection.insertOne({ botconfs: 'global', settings });
      }

      if (result && result.settings) {
        settings = result.settings;
      }

      botSettings.set('global', settings);
    }
    catch (err) {
      console.warn('Error while creating botconfsglobal document');
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
      .set('guildCreate', (guild) => {
        const settings = this.guildSettings.get(guild.id);
        if (!settings) return;
        this.setupGuild(guild.id, settings);
      })
      .set('commandRegister', (command) => {
        for (const [guild, settings] of this.guildSettings) {
          if (guild !== 'global' && !client.guilds.has(guild)) continue;
          this.setupGuildCommand(client.guilds.get(guild), command, settings);
        }
      })
      .set('groupRegister', (group) => {
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

  async fetchGuild(guildId, key) {
    let settings = this.guildSettings.get(guildId);

    if (!settings) {
      const result = await this.db.collection('guildSettings').findOne({ guildId });

      if (result && result.settings) {
        settings = result.settings;
      }
    }

    if (key) {
      return settings[key];
    }

    return settings;
  }

  async fetchUser(userId, key) {
    let settings = this.userSettings.get(userId);

    if (!settings) {
      const result = await this.db.collection('userSettings').findOne({ userId });

      if (result && result.settings) {
        settings = result.settings;
      }
    }

    if (key) {
      return settings[key];
    }

    return settings;
  }

  async fetchBotSettings(index, key, key2) {
    const result = await this.db.collection('botSettings').findOne({ botconfs: index });

    let settings;

    if (result && result.settings) {
      settings = result.settings;
    }

    if (key && !key2) {
      return settings[key];
    }

    if (key2) {
      return settings[key][key2];
    }
    return settings;
  }

  async setGuildComplete(guild, val) {
    guild = this.constructor.getGuildID(guild);
    this.guildSettings.set(guild, val);

    const settingsCollection = this.db.collection('guildSettings');

    await settingsCollection.updateOne({ guildId: guild }, { $set: { settings: val } });
    return val;
  }

  async setGuild(guild, key, val) {
    guild = this.constructor.getGuildID(guild);
    let settings = this.guildSettings.get(guild);
    if (!settings) {
      settings = {};
      this.guildSettings.set(guild, settings);
    }

    settings[key] = val;
    const settingsCollection = this.db.collection('guildSettings');

    await settingsCollection.updateOne({ guildId: guild }, { $set: { settings } });
    return val;
  }

  async removeGuild(guild, key, val) {
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
      settings
    });
    return val;
  }

  async clearGuild(guild) {
    guild = this.constructor.getGuildID(guild);

    if (!this.guildSettings.has(guild)) return;

    this.guildSettings.delete(guild);
    const settingsCollection = this.db.collection('guildSettings');
    await settingsCollection.deleteOne({
      guildId: guild
    });
  }

  getGuild(guild, key, defVal) {
    const settings = this.guildSettings.get(this.constructor.getGuildID(guild));

    if (!key && !defVal) {
      return settings;
    }

    return settings ? typeof settings[key] === 'undefined' ? defVal : settings[key] : defVal;
  }

  async setBotconfsComplete(botconfs, val) {
    let settings = this.botSettings.get('botconfs');
    if (!settings) {
      settings = {};
      this.botSettings.set('botconfs', settings);
    }

    const settingsCollection = this.db.collection('botSettings');

    await settingsCollection.updateOne({ botconfs }, { $set: { settings: val } });
    return val;
  }

  async setUserComplete(user, val) {
    let settings = this.userSettings.get(user);
    if (!settings) {
      settings = {};
      this.userSettings.set(user, settings);
    }

    const settingsCollection = this.db.collection('userSettings');

    await settingsCollection.updateOne({ userId: user }, { $set: { settings: val } });
    return val;
  }

  async setUser(user, key, val) {
    let settings = this.userSettings.get(user);
    if (!settings) {
      settings = {};
      this.userSettings.set(user, settings);
    }

    settings[key] = val;
    const settingsCollection = this.db.collection('userSettings');

    await settingsCollection.updateOne({ userId: user }, { $set: { settings } });
    return val;
  }

  async removeUser(user, key, val) {
    let settings = this.userSettings.get(user);
    if (!settings) {
      settings = {};
      this.userSettings.set(user, settings);
    }

    val = settings[key];
    settings[key] = undefined;
    const settingsCollection = this.db.collection('userSettings');

    await settingsCollection.save({
      userId: user,
      settings
    });
    return val;
  }

  async clearUser(user) {
    if (!this.settings.has(user)) return;
    this.settings.delete(user);
    const settingsCollection = this.db.collection('userSettings');
    await settingsCollection.deleteOne({
      userId: user
    });
  }

  getUser(user, key, defVal) {
    const settings = this.userSettings.get(user);

    if (!key && !defVal) {
      return settings;
    }

    return settings ? typeof settings[key] === 'undefined' ? defVal : settings[key] : defVal;
  }

  async setBotsettings(index, key, val) {
    let settings = this.botSettings.get(index);
    if (!settings) {
      settings = {};
    }

    settings[key] = val;
    const settingsCollection = this.db.collection('botSettings');

    await settingsCollection.updateOne({ botconfs: index }, { $set: { settings } });
    return val;
  }

  async removeBotsettings(index, key, val) {
    let settings = this.botSettings.get(index);
    if (!settings) {
      settings = {};
    }

    val = settings[key];
    delete settings[key];
    const settingsCollection = this.db.collection('botSettings');

    await settingsCollection.updateOne({ botconfs: index }, { $set: { settings } });
    return val;
  }


  async clearBotsettings(index) {
    const settingsCollection = this.db.collection('botSettings');
    await settingsCollection.deleteOne({
      botconfs: index
    });
  }

  getBotsettings(index, key, defVal) {
    const settings = this.botSettings.get(index);

    if (!key && !defVal) {
      return settings;
    }
    
    return settings ? typeof settings[key] === 'undefined' ? defVal : settings[key] : defVal;
  }

  async reloadBotSettings() {
    try {
      const result = await this.db.collection('botSettings').findOne({ botconfs: 'botconfs' });
      let settings;

      if (!result) {
        // Can't find DB make new one.
        settings = botsettingskeys;
        await this.db.collection('botSettings').insertOne({ botconfs: 'botconfs', settings });
      }

      if (result && result.settings) {
        settings = result.settings;
      }

      await this.db.collection('botSettings').updateOne({ botconfs: 'botconfs' }, { $set: { settings } });

      this.botSettings.set('botconfs', settings);
    }
    catch (err) {
      console.warn('Error while creating document of bot settings');
      console.warn(err);
    }
  }

  async reloadGuild(id, type, value) {
    try {
      const result = await this.db.collection('guildSettings').findOne({ guildId: id });
      let settings;

      if (!result) {
        // Can't find DB make new one.
        settings = guildsettingskeys;
        await this.db.collection('guildSettings').insertOne({ guildId: id, settings });
      }

      if (result && result.settings) {
        settings = result.settings;
      }

      await this.db.collection('guildSettings').updateOne({ guildId: id }, { $set: { settings } });

      if (type === 'prefix') {
        const guild = this.client.guilds.get(id) || null;
        guild._commandPrefix = value;
      }

      this.guildSettings.set(id, settings);
    }
    catch (err) {
      console.warn(`Error while creating document of guild ${id}`);
      console.warn(err);
    }
  }

  async reloadUser(id) {
    try {
      const result = await this.db.collection('userSettings').findOne({ userId: id });
      let settings;

      if (!result) {
        // Can't find DB make new one.
        settings = usersettingskeys;
        await this.db.collection('userSettings').insertOne({ userId: id, settings });
      }

      if (result && result.settings) {
        settings = result.settings;
      }

      await this.db.collection('userSettings').updateOne({ userId: id }, { $set: { settings } });

      this.userSettings.set(id, settings);
    }
    catch (err) {
      console.warn(`Error while creating document of user ${id}`);
      console.warn(err);
    }
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
    }
    else {
      command._globalEnabled = settings[`cmd-${command.name}`];
    }
  }

  setupGuildGroup(guild, group, settings) {
    if (typeof settings[`grp-${group.id}`] === 'undefined') return;
    if (guild) {
      if (!guild._groupsEnabled) guild._groupsEnabled = {};
      guild._groupsEnabled[group.id] = settings[`grp-${group.id}`];
    }
    else {
      group._globalEnabled = settings[`grp-${group.id}`];
    }
  }
}

module.exports = LenoxBotSettingsProvider;
