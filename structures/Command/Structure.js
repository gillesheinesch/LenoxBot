module.exports = class Command {
    constructor(client, options) {
        this.constructor.validate(client, options);
        this.client = client,

            this.name = options.name,
            this.aliases = options.aliases || [],
            this.description = options.description || "No command description",
            this.category = options.category || "general",
            this.usage = options.usage || null,
            this.example = options.example || null,
            this.hidden = options.hidden || false,
            this.premiumOnly = options.premiumOnly || false,
            this.voteOnly = options.voteOnly || false,
            this.guildOnly = options.guildOnly || false,
            this.nsfwOnly = options.nsfwOnly || false,
            this.developerOnly = options.developerOnly || false,
            this.managerOnly = options.managerOnly || false,
            this.guildOwnerOnly = options.guildOwnerOnly || false,
            this.cooldown = options.cooldown || 3,
            this.voiceChannelOnly = options.voiceChannelOnly || false,
            this.sameVoiceChannelOnly = options.sameVoiceChannelOnly || false,
            this.clientPermissions = options.clientPermissions || false,
            this.userPermissions = options.userPermissions || false,
    }
    
    async run() {};

    async _run (context, args) {
        try {
            await this.run(context, args);
        } catch (err) {
            console.error(err);
        }
    }

    static validate(client, options) {
        if (!client) return console.log('No client...');

        if (typeof options !== 'object') return console.log('Options have to be a object!');
        if (typeof options.name !== 'string') return console.log('Command name must be a string!');
        if (options.aliases) {
            if (options.aliases && (!Array.isArray(options.aliases)) || options.aliases.some(a => typeof a !== 'string')) return console.log('Aliases must be in an Array of Strings!');
            if (options.aliases && options.aliases.some(a => a.toLowerCase())) return console.log('Aliases must be lowercase');
        };
        if (options.description) {
            if (typeof options.description !== 'string') return console.log('Description must be a string!');
        }
        if (options.category) {
            if (typeof options.category !== 'string') return console.log('Category must be a string!');
            if (options.category !== options.category.toLowerCase()) return console.log('Category must be lowercase!');
        }
        if (options.usage) {
            if (typeof options.usage !== 'string') return console.log('Usage must be a string!');
            if (options.usage !== options.usage.toLowerCase()) return console.log('Usage must be lowercase');
        }
        if (options.example) {
            if (typeof options.example !== 'string') return console.log('Example must be a string!');
            if (options.example !== options.example.toLowerCase()) return console.log('Example must be lowercase');
        }
        if (options.hidden) {
            if (typeof options.hidden !== 'boolean') return console.log('Hidden must be a Boolean!');
        }
        if (options.premiumOnly) {
            if (typeof options.premiumOnly !== 'boolean') return console.log('Premiumonly must be a Boolean!');
        }
        if (options.guildOnly) {
            if (typeof options.guildOnly !== 'boolean') return console.log('GuildOnly has to be a Boolean!');
        }
        if (options.nsfwOnly) {
            if (typeof options.nsfwOnly !== 'boolean') return console.log('NSFWOnly has to be a Boolean!');
        }
        if (options.developerOnly) {
            if (typeof options.developerOnly !== 'boolean') return console.log('DeveloperOnly has to be a Boolean!');
        }
        if (options.managerOnly) {
            if (typeof options.managerOnly !== 'boolean') return console.log('ManagerOnly has to be a Boolean!');
        }
        if (options.guildOnly) {
            if (typeof options.guildOwnerOnly !== 'boolean') return console.log('GuildOwnerOnly has to be a Boolean!');
        }
        if (options.voiceChannelOnly) {
            if (typeof options.voiceChannelOnly !== 'boolean') return console.log('VoiceChannelOnly has to be a Boolean!');
        }
        if (options.sameVoiceChannelOnly) {
            if (typeof options.sameVoiceChannelOnly !== 'boolean') return console.log('SameVoiceChannelOnly has to be a Boolean!');
        }
        if (options.voteOnly) {
            if (typeof options.voteOnly !== 'boolean') return console.log('VoteOnly has to be a Boolean!');
        }
        if (options.clientPermissions) {
            if (!Array.isArray(options.clientPermissions)) return console.log('..');
            for (const perm of options.clientPermissions) {
                const permissions = require('../../public/assets/permissions.json');

                if (permissions[perm]) return console.error(`Invalid client perms: ${perm}`);
            }
        }
        if (options.userPermissions) {
            if (!Array.isArray(options.userPermissions)) return console.log('..');
            for (const perm of options.userPermissions) {
                const permissions = require('../../public/assets/permissions.json');

                if (permissions[perm]) return console.error(`Invalid user perms: ${perm}`);
            }
        }
    }
}

