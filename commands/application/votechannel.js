const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.application) {
		tableload.application = {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: ''
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	const channelid = msg.channel.id;
	const channelName = client.channels.get(channelid).name;

	tableload.application.votechannel = channelid;
	msg.channel.send(`All applications will now be posted in the #**${channelName} ** channel and can be rated accordingly!`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'votechannel',
	description: 'Creates a channel in which all new applications will be posted and can be rated accordingly',
	usage: 'votechannel',
	example: ['votechannel'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
