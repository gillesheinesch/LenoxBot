const Discord = require('discord.js');
exports.run = async(client, msgf, args) => {
	const tableload = client.guildconfs.get(msgf.guild.id);

	if (!tableload.application) {
		tableload.application = {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: ''
		};
		await client.guildconfs.set(msgf.guild.id, tableload);
    }

    const templates = [];
	const embed = new Discord.RichEmbed()
	.setColor('#ABCDEF');

	try {
		for (var i = 0; i < tableload.application.template.length; i++) {
			templates.push(tableload.application.template[i]);
		}
		embed.addField('All current templates:', templates.join("\n"), true);
		return msgf.channel.send({ embed: embed });
	} catch (error) {
		return msg.channel.send('There are no defined entries in the template yet');
    }
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'listentry',
	description: 'Shows all entries that exist in the template',
	usage: 'listentry ',
	example: ['listentry'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
