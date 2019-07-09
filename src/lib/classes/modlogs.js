const { MessageEmbed, Collection } = require('discord.js');
module.exports = class ModLog {

    constructor() {
        this.guild = null;
        this.client = null;

        this.action = null;
        this.user = null;
        this.moderator = null;
        this.duration = null;
        this.reason = null;
        this.removed_by = null;
        this.date_given = null;
        this.automatic = false;

        this.case = null;
    }
    
    static setGuild(guild) {
        this.guild = guild;
        this.client = this.guild.client;
        return this;
    }

    static setAction(action) {
        this.action = action;
        return this;
    }

    static setUser(user) {
        this.user = {
            id: user.id,
            tag: user.tag,
            displayAvatarURL: user.displayAvatarURL()
        };
        return this;
    }

    static setAutomatic(bool = false) {
        this.automatic = bool;
        return this;
    }

    static setRemovedBy(user) {
        this.removed_by = {
            id: user.id,
            tag: user.tag,
            displayAvatarURL: user.displayAvatarURL()
        };;
        return this;
    }

    // Here we get all the info about the executing Moderator

    static setModerator(user) {
        this.moderator = {
            id: user.id,
            tag: user.tag,
            displayAvatarURL: user.displayAvatarURL()
        };
        return this;
    }

    static setReason(reason = null) {
        if (reason instanceof Array) reason = reason.join(' ');
        this.reason = reason;
        return this;
    }

    static setDateGiven(date = new Date()) {
        if (typeof (date) !== 'number' || !date instanceof Date) date = new Date();
        this.date_given = date;
        return this;
    }

    // Checks if the modlog channel still exsists if not it throws an error to the console

    static async send() {
        const guild_settings = this.guild.settings;
        const channel = guild_settings.get('moderations.modlog_channel');
        //if (!channel) throw 'The modlog channel does not exist or has not been setup, did it get deleted?';
        this.date_given = new Date();
        if (!this.automatic) await this.addCase();
        if (channel && this.guild.channels.has(channel)) this.guild.channels.get(channel).send({ embed: this.embed });
        return new ModLog();
    }

    // Here we build the modlog embed

    get embed() {
        const users = this.client.users;
        const embed = new MessageEmbed()
            .setAuthor(this.moderator.tag, this.moderator.displayAvatarURL)
            .setColor(ModLog.color(this.action))
            .setDescription([
                `**Member**: ${this.user.tag} (${this.user.id})`,
                `**Action**: ${this.action[0].toUpperCase() + this.action.slice(1)}`,
                this.removed_by ? `**Removed By**: ${users.has(this.removed_by.id) ? users.get(this.removed_by.id) : this.removed_by.tag}` : undefined,
                this.duration ? `**Duration**: ${this.duration}` : undefined,
                this.reason ? `**Reason**: ${this.reason}` : undefined
            ].filter((value) => value !== undefined))
            .setFooter(`Case #${this.case}`)
            .setTimestamp(this.date_given);
        return embed;
    }

    // Here we get the case number and create a modlog provider entry

    async addCase() {
        const guild_settings = this.guild.settings;
        const punishments = guild_settings.get('moderations.punishments');
        this.case = (punishments.length ? Math.max(...punishments.map((moderation) => moderation.case)) : punishments.length) + 1;
        const { errors } = await guild_settings.update('moderations.punishments', this.pack, { arrayAction: 'add' });
        if (errors.length) throw errors[0];
        return this.case;
    }

/*    static async removeCase() {
        const guild_settings = this.guild.settings;
        this.case = guild_settings.get('moderations.punishments').length;
        const { errors } = await guild_settings.update('moderations.punishments', this.pack, { arrayAction: 'add' });
        if (errors.length) throw errors[0];
        return this.case;
    }*/

    static viewPunishment(message, caseNumber) {
        caseNumber = parseInt(caseNumber);
        const punishments = ModLog._getPunishments(message.guild);
        if (!punishments.has(caseNumber)) throw new MessageEmbed().setColor(15684432).setDescription(`There is no punishment for case #${caseNumber}.`);
        const punishment = punishments.get(caseNumber);
        return message.channel.send(new MessageEmbed()
            .setAuthor(punishment.moderator.tag, punishment.moderator.displayAvatarURL)
            .setColor(ModLog.color(punishment.action))
            .setDescription([
                `**Member**: ${punishment.user.tag} (${punishment.user.id})`,
                `**Action**: ${punishment.action[0].toUpperCase() + punishment.action.slice(1)}`,
                punishment.duration ? `**Duration**: ${punishment.duration}` : undefined,
                punishment.reason ? `**Reason**: ${punishment.reason}` : undefined
            ].filter((value) => value !== undefined))
            .setFooter(`Case #${punishment.case}`)
            .setTimestamp(punishment.date_given)
        );
    }

    static viewPunishments(message, user) {
        const count = { warn: 0, mute: 0, kick: 0, ban: 0 };
        const { warn, mute, kick, ban } = count;
        const users_punishments = ModLog._getPunishments(message.guild).filter((punishment) => punishment.user.id === user.id);
        if (!users_punishments.length) throw new MessageEmbed().setColor(15684432).setDescription('This user has no punishments!');
        users_punishments.filter((punishment) => ['warn', 'mute', 'kick', 'ban'].includes(punishment.action)).map((punishment) => count[punishment.action] += 1);
        return message.channel.send(new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .setColor(240116)
            .setDescription(users_punishments.map((punishment) => `\`Case #${punishment.case}\` - **${punishment.action}**${punishment.reason ? ` - ${punishment.reason}` : ''}`))
            .setFooter(`Warned: ${warn} | Muted: ${mute} | Kicked: ${kick} | Banned: ${ban}`)
        );
    }

    static _getPunishments(guild) {
        const collection = new Collection();
        guild.settings.get('moderations.punishments').map((moderation) => collection.set(moderation.case, moderation));
        return collection;
    }

    // Here we pack all the info together

    get pack() {
        return {
            action: this.action,
            user: this.user,
            moderator: this.moderator,
            duration: this.duration,
            date_given: this.date_given,
            reason: this.reason,
            removed_by: this.removed_by,
            case: this.case
        };
    }

    // And here we just define the color for a certain type of offence or action

    static color(action) {
        switch (action) {
            case 'ban': return 16724253;
            case 'un-ban':
            case 'unban': return 6730090;
            case 'warn': return 16771899;
            case 'kick': return 16747777;
            case 'mute': return 65506;
            case 'un-mute':
            case 'unmute': return 6730090;
            case 'soft-ban':
            case 'softban': return 15014476;
            case 'temp-ban':
            case 'tempban': return 15684432;
            default: return 16777215;
        }
    }

};