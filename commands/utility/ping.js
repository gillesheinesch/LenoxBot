const DiscordCommando = require('discord.js-commando');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class BotInfoCommand extends DiscordCommando.Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'utility',
			memberName: 'ping',
			description: 'Shows you how long the bot needs to send a message',
			guarded: true,
			guildOnly: true
		});
	}

	async run(msg) {
		const provider = msg.client.provider;

		const langSet = provider.get(msg.message.guild.id, 'language', 'en-US');
		const lang = require(`../../languages/${langSet}.json`);

		const message = await msg.channel.send('Ping?');
		const newmsg = lang.ping_ping.replace('%latency', message.createdTimestamp - msg.createdTimestamp).replace('%latencyapi', Math.round(msg.client.ping));
		message.edit(newmsg);
	}
};
