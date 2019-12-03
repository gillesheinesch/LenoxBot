const CommandError = require('./Error');
const Embed = require('../Embed');

const { error_color } = require('../../utils/Constants');

module.exports = class Command {
    constructor(client, options) {
        this.constructor.validate(client, options);
        this.client = client;

        // Misc
        this.name = options.name;
        this.aliases = options.aliases || [];
        this.description = options.description || "No command description";
        this.category = options.category || "general";
        this.usage = options.usage || [];
        this.example = options.example || [];

        // Behind
        this.hidden = options.hidden || false;
        this.premiumOnly = options.premiumOnly || false;
        this.voteOnly = options.voteOnly || false;
        this.guildOnly = options.guildOnly || false;
        this.nsfwOnly = options.nsfwOnly || false;
        this.developerOnly = options.developerOnly || false;
        this.managerOnly = options.managerOnly || false;
        this.guildOwnerOnly = options.guildOwnerOnly || false;
        this.voiceChannelOnly = options.voiceChannelOnly || false;
        this.sameVoiceChannelOnly = options.sameVoiceChannelOnly || false;

        // Other
        this.cooldownTime = options.cooldownTime || 3;
        this.cooldownFeedback = options.cooldownFeedback || false;
        this.cooldownMap = this.cooldownTime > 0 ? new Map() : null;

        this.clientPermissions = options.clientPermissions || [];
        this.userPermissions = options.userPermissions || [];
    }

    async run() { }

    async $run(context, args) {
        try {
            await this.run(context, args);
        } catch (err) {
            this.error(context, err);
        }
    }

    error ({ t, language, channel, prefix }, error) {
        const usage = this.usage.length === 0 ? '' : this.usage.map(u => `${prefix}${this.name} ${u}`).join('\n');

        if (error instanceof CommandError) {
          const embed = error.embed || new Embed()
                .setTitle(error.message)
                .setDescription(error.showUsage ? `**${t('commons.usage', language)}:** \n\`${usage}\`` : '');

          return channel.send(embed.setColor(error_color));
        }

        console.error(error);
    }

    static validate(client, options) {
        if (!client) return console.log('No client provided');

        if (typeof options !== 'object') return console.log('Options have to be a object!');
        if (typeof options.name !== 'string' && options.name.length > 20) return console.log('Command name must be a string with a maximum of 20 characters!');
        if (options.aliases && (!Array.isArray(options.aliases)) || options.aliases.some(a => typeof a !== 'string') && options.aliases.some(a => a.toLowerCase())) return console.log('Aliases must be in an array of lowercase strings!');
        if (options.description && typeof options.description !== 'string') return console.log('Description must be a string!');
        if (options.category && typeof options.category !== 'string' && options.category !== options.category.toLowerCase()) return console.log('Category must be a lowercase string!');
        if (options.usage && !Array.isArray(options.usage)) return console.log('Usage must be an array!');
        if (options.example && !Array.isArray(options.example)) return console.log('Example must be an array!');
        if (options.hidden && typeof options.hidden !== 'boolean') return console.log('Hidden must be a Boolean!');
        if (options.premiumOnly && typeof options.premiumOnly !== 'boolean') return console.log('Premiumonly must be a Boolean!');
        if (options.guildOnly && typeof options.guildOnly !== 'boolean') return console.log('GuildOnly has to be a Boolean!');
        if (options.nsfwOnly && typeof options.nsfwOnly !== 'boolean') return console.log('NSFWOnly has to be a Boolean!');
        if (options.developerOnly && typeof options.developerOnly !== 'boolean') return console.log('DeveloperOnly has to be a Boolean!');
        if (options.managerOnly && typeof options.managerOnly !== 'boolean') return console.log('ManagerOnly has to be a Boolean!');
        if (options.guildOnly && typeof options.guildOwnerOnly !== 'boolean') return console.log('GuildOwnerOnly has to be a Boolean!');
        if (options.voiceChannelOnly && typeof options.voiceChannelOnly !== 'boolean') return console.log('VoiceChannelOnly has to be a Boolean!');
        if (options.sameVoiceChannelOnly && typeof options.sameVoiceChannelOnly !== 'boolean') return console.log('SameVoiceChannelOnly has to be a Boolean!');
        if (options.voteOnly && typeof options.voteOnly !== 'boolean') return console.log('VoteOnly has to be a Boolean!');

        if (options.clientPermissions) {
            if (!Array.isArray(options.clientPermissions)) return console.log('..');
            for (const perm of options.clientPermissions) {
                const permissions = require('../../assets/permissions');

                if (permissions[perm]) return console.error(`Invalid client perms: ${perm}`);
            }
        }
        if (options.userPermissions) {
            if (!Array.isArray(options.userPermissions)) return console.log('..');
            for (const perm of options.userPermissions) {
                const permissions = require('../../assets/permissions');

                if (permissions[perm]) return console.error(`Invalid user perms: ${perm}`);
            }
        }
    }
};

