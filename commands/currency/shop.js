const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.botconfs.get('botconfs');
    const roles = [];
	const points = [];
	
	if (!tableload.shopitems) {
		tableload.shopitems = [];
		await client.botconfs.set('botconfs', tableload);
	}

	const embed = new Discord.RichEmbed()
    .setColor('#ABCDEF');

	try {
		for (var i = 0; i < tableload.shopitems.length; i += 2) {
			roles.push(msg.guild.roles.get(tableload.shopitems[i]).name);
		}
        embed.addField(lang.shop_embed, roles.join("\n"), true);
        
        for (var i = 1; i < tableload.shopitems.length; i += 2) {
			points.push(tableload.shopitems[i]);
        }
        embed.addField(lang.shop_price, points.join("\n"), true);
		return msg.channel.send({ embed: embed });
	} catch (error) {
		return msg.channel.send(lang.listautomaticrole_error);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['market'],
    userpermissions: []
};
exports.help = {
	name: 'shop',
	description: 'Shows you a list of all buyable roles (with medals)',
	usage: 'shoplist',
	example: ['shoplist'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
