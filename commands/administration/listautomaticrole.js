const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class listautomaticroleCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'listautomaticrole',
			group: 'administration',
			memberName: 'listautomaticrole',
			description: 'Lists all auto assignable roles',
			format: 'listautomaticrole',
			aliases: ['lar'],
			examples: ['listautomaticrole'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['ADMINISTRATOR'],
			shortDescription: 'Automaticroles',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const roles = [];
		const points = [];

		if (!msg.client.provider.getGuild(msg.message.guild.id, 'ara')) {
			await msg.client.provider.setGuild(msg.message.guild.id, 'ara', []);
		}

		const embed = new Discord.RichEmbed()
			.setColor('#ABCDEF');

		try {
			for (let i = 0; i < msg.client.provider.getGuild(msg.message.guild.id, 'ara').length; i += 2) {
				roles.push(msg.guild.roles.get(msg.client.provider.getGuild(msg.message.guild.id, 'ara')[i]).name);
			}
			embed.addField(lang.listautomaticrole_embed, roles.join('\n'), true);

			for (let i = 1; i < msg.client.provider.getGuild(msg.message.guild.id, 'ara').length; i += 2) {
				points.push(msg.client.provider.getGuild(msg.message.guild.id, 'ara')[i]);
			}
			embed.addField(lang.listautomaticrole_points, points.join('\n'), true);
			return msg.channel.send({ embed: embed });
		} catch (error) {
			return msg.channel.send(lang.listautomaticrole_error);
		}
	}
};
