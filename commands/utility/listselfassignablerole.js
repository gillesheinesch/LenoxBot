const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class listselfassignableroleCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'listselfassignablerole',
			group: 'utility',
			memberName: 'listselfassignablerole',
			description: 'Shows you a list of all roles that allows users to assign themselves',
			format: 'listselfassignablerole',
			aliases: ['lsar'],
			examples: ['listselfassignablerole'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Selfassignableroles',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');

		const roles = [];

		const help = lang.listselfassignablerole_help.replace('%prefix', prefix);
		const embed = new Discord.RichEmbed()
			.setColor('#ABCDEF')
			.setFooter(help);
		try {
			for (let i = 0; i < msg.client.provider.getGuild(msg.message.guild.id, 'selfassignableroles').length; i++) {
				roles.push(msg.guild.roles.get(msg.client.provider.getGuild(msg.message.guild.id, 'selfassignableroles')[i]).name);
			}
			embed.addField(lang.listselfassignablerole_embed, roles.join('\n'), true);
			return msg.channel.send({ embed: embed });
		} catch (error) {
			return msg.channel.send(lang.listselfassignablerole_nolroles);
		}
	}
};
