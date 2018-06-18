const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.application) {
		tableload.application = {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: '',
			status: 'false'
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

    const templates = [];
	const embed = new Discord.RichEmbed()
	.setColor('#ABCDEF');

	try {
		for (var i = 0; i < tableload.application.template.length; i++) {
			templates.push(tableload.application.template[i]);
		}
		embed.addField(lang.listentry_current, templates.join("\n"), true);
		return msg.channel.send({ embed: embed });
	} catch (error) {
		return msg.channel.send(lang.listentry_error);
    }
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'listentry',
	description: 'Shows all entries that exist in the template',
	usage: 'listentry ',
	example: ['listentry'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
