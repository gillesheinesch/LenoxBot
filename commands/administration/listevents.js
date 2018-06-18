const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const eventslist = ['Modlog', 'Messagedelete', 'Messageupdate', 'Channelupdate', 'Channelcreate', 'Channeldelete', 'Memberupdate', 'Presenceupdate', 'Rolecreate', 'Roledelete', 'Roleupdate', 'Userjoin', 'Userleft', 'Guildupdate', 'Chatfilter'];

    const embed = new Discord.RichEmbed()
    .setColor('0066CC')
	.setAuthor(lang.listevents_embed);
	
	for (var i = 0; i < eventslist.length; i++) {
		const x = eventslist[i].toLowerCase();
		embed.addField(eventslist[i], lang[`listevents_${x}`]);
	}

    msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
    userpermissions: ['MANAGE_GUILD']
=======
    userpermissions: ['MANAGE_GUILD'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'listevents',
	description: 'Lists you all events that you can log on your server',
	usage: 'listevents',
	example: ['listevents'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
