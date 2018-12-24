const DiscordCommando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class LenoxCommand extends DiscordCommando.Command {
    hasPermission(message, ownerOverride = true) {
		if(!this.ownerOnly && !this.userPermissions) return true;
        if(ownerOverride && this.client.isOwner(message.author)) return true;
        
        const provider = message.client.provider;
        const langSet = provider.get(message.guild.id, 'language', 'en-US');
		const lang = require(`../languages/${langSet}.json`);

		if(this.ownerOnly && (ownerOverride || !this.client.isOwner(message.author))) {
			return `${lang.botownercommands_error}`
		}

		if(message.channel.type === 'text' && this.userPermissions) {
			const missing = message.channel.permissionsFor(message.author).missing(this.userPermissions);
			if(missing.length > 0) {
				if(missing.length === 1) {
                    //return `The \`${this.name}\` command requires you to have the "${permissions[missing[0]]}" permission.`;
                    return `${lang.botownercommands_error}`;
				}
				/*return oneLine`
					The \`${this.name}\` command requires you to have the following permissions:
					${missing.map(perm => permissions[perm]).join(', ')}
                `;*/
                return `${lang.botownercommands_error}`;
			}
		}

		return true;
	}
}