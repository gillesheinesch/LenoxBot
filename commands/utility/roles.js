const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
    if (msg.guild.roles.filter(r => r.name !== '@everyone').array().length === 0) return msg.channel.send(lang.roles_error);

	const textchannelsembed = new Discord.RichEmbed()
	.setDescription(`**📋 ${lang.roles_list}**\n${msg.guild.roles.filter(r => r.name !== '@everyone').array().slice(0, 15).map(textchannel => `**#${textchannel.name}** (*${textchannel.id}*)`).join('\n')}`)
	.setColor(3447003);

	var textchannels = await msg.channel.send({ embed: textchannelsembed });

	if (msg.guild.roles.filter(r => r.name !== '@everyone').array().length > 15) {
	var reaction1 = await textchannels.react('◀');
	var reaction2 = await textchannels.react('▶');
		
	var firsttext = 0;
	var secondtext = 15;

	var collector = textchannels.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
	collector.on('collect', r => {
		var reactionadd = msg.guild.roles.filter(r => r.name !== '@everyone').array().slice(firsttext + 15, secondtext + 15).length;
		var reactionremove = msg.guild.roles.filter(r => r.name !== '@everyone').array().slice(firsttext - 15, secondtext - 15).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			r.remove(msg.author.id);
			const guildchannels = msg.guild.roles.filter(r => r.name !== '@everyone').array().slice(firsttext + 15, secondtext + 15).map(textchannel => `**#${textchannel.name}** (*${textchannel.id}*)`);

			firsttext = firsttext + 15;
			secondtext = secondtext + 15;

			const newembed = new Discord.RichEmbed()
			.setColor(3447003)
			.setDescription(`**📋 ${lang.roles_list}**\n${guildchannels.join("\n")}`);
		
			textchannels.edit({ embed: newembed });
	  	} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			r.remove(msg.author.id);
			const guildchannels = msg.guild.roles.filter(r => r.name !== '@everyone').array().slice(firsttext - 15, secondtext - 15).map(textchannel => `**#${textchannel.name}** (*${textchannel.id}*)`);

			firsttext = firsttext - 15;
			secondtext = secondtext - 15;
		
			const newembed = new Discord.RichEmbed()
			.setColor(3447003)
			.setDescription(`**📋 ${lang.roles_list}**\n${guildchannels.join("\n")}`);
		
			textchannels.edit({ embed: newembed });
		}
	});
		collector.on('end',(collected, reason) => {
			reaction1.remove();
			reaction2.remove();
		});
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: "Information",
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
