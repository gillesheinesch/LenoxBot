const DiscordCommando = require('discord.js-commando');

module.exports = class LenoxCommand extends DiscordCommando.Command {
	constructor(client, info) {
		super(client, info);
		this.shortDescription = info.shortDescription || null;
		this.cooldown = info.cooldown || null;
		this.dashboardsettings = info.dashboardsettings || null;
		this.clientpermissions = info.clientpermissions || [];
		this.userpermissions = info.userpermissions || [];
	}

	hasPermission(message, ownerOverride = true) {
		if (!this.ownerOnly && !this.userpermissions) return true;
		if (ownerOverride && this.client.isOwner(message.author)) return true;

		const provider = message.client.provider;
		const langSet = provider.getGuild(message.guild.id, 'language', 'en-US');
		const lang = require(`../languages/${langSet}.json`);

		if (this.ownerOnly && (ownerOverride || !this.client.isOwner(message.author))) {
			return `${lang.botownercommands_error}`;
		}

		if (message.channel.type === 'text' && this.userpermissions) {
			const missing = message.channel.permissionsFor(message.author).missing(this.userpermissions);
			if (missing.length > 0) {
				const botnopermission = lang.messageevent_botnopermission.replace('%missingpermissions', missing.map(perm => missing[perm]).join(', '));
				if (missing.length === 1) {
					return `${botnopermission}`;
				}
				return `${botnopermission}`;
			}
		}

		return true;
	}
};
