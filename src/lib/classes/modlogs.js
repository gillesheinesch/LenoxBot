const { MessageEmbed } = require('discord.js');
module.exports = class ModLog {

    constructor(guild) {
        this.guild = guild;
        this.client = guild.client;

        this.type = null;
        this.user = null;
		this.moderator = null;
		this.duration = null;
        this.reason = null;

        this.case = null;
    }

    setType(type) {
        this.type = type;
        return this;
    }

    setUser(user) {
        this.user = {
            id: user.id,
            tag: user.tag
        };
        return this;
    }

    // Here we get all the info about the executing Moderator

    setModerator(user) {
        this.moderator = {
            id: user.id,
            tag: user.tag,
            avatar: user.displayAvatarURL()
        };
        return this;
    }

    setReason(reason = null) {
        if (reason instanceof Array) reason = reason.join(' ');
        this.reason = reason;
        return this;
    }

    // Checks if the modlog channel still exsists if not it throws an error to the console

    async send() {
        const channel = this.guild.channels.get(this.guild.settings.channels.modlog);
        if (!channel) throw 'The modlog channel does not exist, did it get deleted?';
        await this.getCase();
        return channel.send({ embed: this.embed });
    }

    // Here we build the modlog embed

    get embed() {
        const embed = new MessageEmbed()
            .setAuthor(this.moderator.tag, this.moderator.avatar)
            .setColor(ModLog.colour(this.type))
            .setDescription([
                `**Type**: ${this.type[0].toUpperCase() + this.type.slice(1)}`,
                `**User**: ${this.user.tag} (${this.user.id})`,
                `**Reason**: ${this.reason || `Use \`${this.guild.settings.prefix}reason ${this.case}\` to claim this log.`}`
            ])
            .setFooter(`Case ${this.case}`)
            .setTimestamp();
        return embed;
    }

    // Here we get the case number and create a modlog provider entry

    async getCase() {
        this.case = this.guild.settings.modlogs.length;
        const { errors } = await this.guild.settings.update('modlogs', this.pack);
        if (errors.length) throw errors[0];
        return this.case;
    }

    // Here we pack all the info together

    get pack() {
        return {
            action: this.action,
            user: this.user.id,
			moderator: this.moderator.id,
			duration: this.duration,
            reason: this.reason,
            case: this.case
        };
    }

    // And here we just define the color for a certain type of offence or action

    static color(type) {
        switch (type) {
            case 'ban': return 16724253;
            case 'unban': return 6730090;
			case 'warn': return 16771899;
			case 'kick': return 16747777;
			case 'mute': return 65506;
			case 'unmute': return 6730090;
			case 'softban': return 15014476;
			case 'tempban': return 15684432;
            default: return 16777215;
        }
    }

};