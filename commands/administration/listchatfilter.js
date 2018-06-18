const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
    const array = [];
	
	if (!tableload.chatfilter) {
		tableload.chatfilter = {
			chatfilter: 'false',
			array: []
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.chatfilter.array.length === 0) return msg.channel.send(lang.listchatfilter_error);

	const embed = new Discord.RichEmbed()
    .setColor('#ABCDEF');

		for (var i = 0; i < tableload.chatfilter.array.length; i++) {
			array.push(tableload.chatfilter.array[i]);
		}
        embed.addField(lang.listchatfilter_embed, array.join("\n"), true);
        
		return msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],

    

    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true

};
exports.help = {
	name: 'listchatfilter',
	description: 'Lists all chat filter entries',
	usage: 'listchatfilter',
	example: ['listchatfilter'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
