const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	if (msg.guild.roles.filter(r => r.name !== '@everyone').array().length === 0) return msg.channel.send(lang.roles_error);

	const textchannelsembed = new Discord.RichEmbed()
		.setDescription(`**📋 ${lang.roles_list}**\n${msg.guild.roles.filter(r => r.name !== '@everyone').array().slice(0, 15)
			.map(textchannel => `**#${textchannel.name}** (*${textchannel.id}*)`)
			.join('\n')}`)
		.setColor(3447003);

	const textchannels = await msg.channel.send({ embed: textchannelsembed });

	if (msg.guild.roles.filter(r => r.name !== '@everyone').array().length > 15) {
		const reaction1 = await textchannels.react('◀');
		const reaction2 = await textchannels.react('▶');

		let firsttext = 0;
		let secondtext = 15;

		const collector = textchannels.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
		collector.on('collect', r => {
			const reactionadd = msg.guild.roles.filter(role => role.name !== '@everyone').array().slice(firsttext + 15, secondtext + 15).length;
			const reactionremove = msg.guild.roles.filter(role => role.name !== '@everyone').array().slice(firsttext - 15, secondtext - 15).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				r.remove(msg.author.id);
				const guildchannels = msg.guild.roles.filter(role => role.name !== '@everyone').array().slice(firsttext + 15, secondtext + 15)
					.map(textchannel => `**#${textchannel.name}** (*${textchannel.id}*)`);

				firsttext += 15;
				secondtext += 15;

				const newembed = new Discord.RichEmbed()
					.setColor(3447003)
					.setDescription(`**📋 ${lang.roles_list}**\n${guildchannels.join('\n')}`);

				textchannels.edit({ embed: newembed });
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				r.remove(msg.author.id);
				const guildchannels = msg.guild.roles.filter(role => role.name !== '@everyone').array().slice(firsttext - 15, secondtext - 15)
					.map(textchannel => `**#${textchannel.name}** (*${textchannel.id}*)`);

				firsttext -= 15;
				secondtext -= 15;

				const newembed = new Discord.RichEmbed()
					.setColor(3447003)
					.setDescription(`**📋 ${lang.roles_list}**\n${guildchannels.join('\n')}`);

				textchannels.edit({ embed: newembed });
			}
		});
		collector.on('end', () => {
			reaction1.remove();
			reaction2.remove();
		});
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Information',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'roles',
	description: 'A list of all roles on your discord server',
	usage: 'roles',
	example: ['roles'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
