const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
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
		client.guildconfs.set(msg.guild.id, tableload);
	}

	const embed = new Discord.RichEmbed()
		.setDescription(`${lang.applicationsettings_applicationstatus} \`${tableload.application.status === 'false' ? lang.applicationsettings_deactivated : lang.applicationsettings_activated}\` \n\
${lang.applicationsettings_reactionnnumber} \`${tableload.application.reactionnumber === '' ? lang.serverinfo_emojisnone : tableload.application.reactionnumber}\`\n\
${lang.applicationsettings_approverole} \`${tableload.application.role === '' ? lang.applicationsettings_norole : msg.guild.roles.get(tableload.application.role).name}\` \n\
${lang.applicationsettings_denyrole} \`${tableload.application.denyrole === '' ? lang.applicationsettings_norole : msg.guild.roles.get(tableload.application.denyrole).name}\` \n`)
		.addField(lang.applicationsettings_entries, tableload.application.template.length === 0 ? lang.serverinfo_emojisnone : tableload.application.template.join('\n'))
		.setAuthor(lang.applicationsettings_embedauthor)
		.setColor('#00ff00');

	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Settings',
	aliases: [],
	userpermissions: ['MANAGE_GUILD'],
	dashboardsettings: true
};
exports.help = {
	name: 'applicationsettings',
	description: 'Shows you all settings of the application system',
	usage: 'applicationsettings',
	example: ['applicationsettings'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
