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

	const channelid = msg.channel.id;
	const channelName = client.channels.get(channelid).name;

	tableload.application.votechannel = channelid;

	var set = lang.votechannel_set.replace('%channelname', `#**${channelName}**`);
	msg.channel.send(set);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],


    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true

};
exports.help = {
	name: 'votechannel',
	description: 'Sets a channel in which all new applications will be posted and can be rated accordingly',
	usage: 'votechannel',
	example: ['votechannel'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
