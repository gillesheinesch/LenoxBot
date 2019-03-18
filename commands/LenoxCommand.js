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
};
