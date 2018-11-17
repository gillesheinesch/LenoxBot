const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
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

	if (tableload.application.status === 'false') return msg.channel.send(lang.toggleapplication_error);

	const addentry = lang.application_addentry.replace('%prefix', tableload.prefix);
	if (tableload.application.template.length === 0) return msg.channel.send(addentry);

	const reactionnumber = lang.application_reactionnumber.replace('%prefix', tableload.prefix);
	if (tableload.application.reactionnumber === '') return msg.channel.send(reactionnumber);

	const undefinedmessages = lang.application_undefinedmessages.replace('%prefix', tableload.prefix).replace('%prefix', tableload.prefix);
	if (tableload.application.acceptedmessage === '' || tableload.application.rejectedmessage === '') return msg.channel.send(undefinedmessages);

	const newapplication = lang.application_newapplication.replace('%author', msg.author);
	msg.channel.send(newapplication);

	const array = [];

	for (let i = 0; i < tableload.application.template.length; i++) {
		try {
			await msg.channel.send(`${msg.author}, ${tableload.application.template[i]}`);
			const response = await msg.channel.awaitMessages(msg2 => msg2.attachments.size === 0 && msg.author.id === msg2.author.id && !msg2.author.bot, {
				maxMatches: 1,
				time: 300000,
				errors: ['time']
			});
			array.push(response.first().content);
			await response.first().delete();
		} catch (error) {
			const timeerror = lang.application_timeerror.replace('%prefix', tableload.prefix);
			return msg.channel.send(timeerror);
		}
	}

	const temparray = [];
	for (let i = 0; i < tableload.application.template.length; i++) {
		temparray.push(`${tableload.application.template[i]} \n${array[i]}`);
	}

	const content = temparray.join('\n\n');

	const confs = {
		guildid: msg.guild.id,
		authorid: msg.author.id,
		applicationid: tableload.application.applicationid + 1,
		date: msg.createdTimestamp,
		acceptedorrejected: '',
		status: 'open',
		content: content,
		yes: [],
		no: []
	};

	tableload.application.applicationid += 1;
	tableload.application.applications[tableload.application.applicationid] = confs;

	client.guildconfs.set(msg.guild.id, tableload);

	await msg.channel.send(lang.application_applicatiosent);

	if (tableload.application.notificationstatus === true) {
		const applicationembedanswer = lang.mainfile_applicationembed.replace('%ticketid', tableload.application.applicationid);
		const embed = new Discord.RichEmbed()
			.setURL(`https://lenoxbot.com/dashboard/${confs.guildid}/applications/${tableload.application.applicationid}/overview`)
			.setTimestamp()
			.setColor('#ccffff')
			.setTitle(lang.mainfile_applicationembedtitle)
			.setDescription(applicationembedanswer);

		try {
			client.channels.get(tableload.application.notificationchannel).send({
				embed
			});
		} catch (error) {
			'undefined';
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: ['apply'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'application',
	description: 'Creates a new application on this server',
	usage: 'application',
	example: ['application'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
