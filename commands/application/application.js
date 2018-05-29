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
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.application.status === 'false') return msg.channel.send(lang.toggleapplication_error);

	var addentry = lang.application_addentry.replace('%prefix', tableload.prefix);
	if (tableload.application.template.length === 0) return msg.channel.send(addentry);

	var votechannel = lang.application_votechannel.replace('%prefix', tableload.prefix);
	if (tableload.application.votechannel === '') return msg.channel.send(votechannel);

	var reactionnumber = lang.application_reactionnumber.replace('%prefix', tableload.prefix);
	if (tableload.application.reactionnumber === '') return msg.channel.send(reactionnumber);

	var undefinedmessages = lang.application_undefinedmessages.replace('%prefix', tableload.prefix);
	if (tableload.application.acceptedmessage === '' || tableload.application.rejectedmessage === '') return msg.channel.send(undefinedmessages);

	var newapplication = lang.application_newapplication.replace('%author', msg.author);
	msg.channel.send(newapplication);

	var array = [];

	for (var i = 0; i < tableload.application.template.length; i++) {
		try {
			await msg.channel.send(`${msg.author}, ${tableload.application.template[i]}`);
			var response = await msg.channel.awaitMessages(msg2 => msg2.attachments.size === 0 && msg.author.id === msg2.author.id && !msg2.author.bot, {
				maxMatches: 1,
				time: 300000,
				errors: ['time']
			});
			array.push(response.first().content);
			await response.first().delete();
		} catch (error) {
			var timeerror = lang.application_timeerror.replace('%prefix', tableload.prefix);
			return msg.channel.send(timeerror);
		}
	}

	var temparray = [];
	for (var i = 0; i < tableload.application.template.length; i++) {
		temparray.push(`${tableload.application.template[i]} \n${array[i]}`);
	}

	var content = temparray.join("\n\n");
	
	const confs = {
		guildid: msg.guild.id,
		authorid: msg.author.id,
		applicationid: tableload.application.applicationid + 1,
		date: msg.createdTimestamp,
		acceptedorrejected: '',
		status: "open",
		content: content,
		yes: [],
		no: []
	};

	tableload.application.applicationid = tableload.application.applicationid + 1;
	tableload.application.applications[tableload.application.applicationid] = confs;

	await client.guildconfs.set(msg.guild.id, tableload);

	msg.channel.send(lang.application_applicatiosent);

	const channel = msg.guild.channels.get(tableload.application.votechannel);

	var newapplicationembed = lang.application_newapplicationembed.replace('%authortag', msg.author.tag);
	const embed = new Discord.RichEmbed()
		.setColor('#669900')
		.setAuthor(newapplicationembed, msg.author.displayAvatarURL);

	for (var i = 0; i < tableload.application.template.length; i++) {
		embed.addField(tableload.application.template[i], array[i]);
	}

	try {
		var message = await channel.send({
			embed
		});

		await message.react('👍');
		await message.react('👎');

		var collector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '👍' || reaction.emoji.name === '👎');
		collector.on('collect', r => {
			if (r.emoji.name === '👍' && r.count >= tableload.application.reactionnumber) {
				try {
					if (tableload.application.role !== '') {
						const role = msg.guild.roles.get(tableload.application.role);
						msg.member.addRole(role);
					}

					msg.member.send(tableload.application.acceptedmessage);

					if (tableload.application.archivechannel === true) {
						try {
							var statusaccepted = lang.application_statusaccepted.replace('%authortag', msg.author.tag);
							var acceptedembed = new Discord.RichEmbed()
								.setColor('#669900')
								.setAuthor(statusaccepted, msg.author.displayAvatarURL);

							for (var i = 0; i < tableload.application.template.length; i++) {
								acceptedembed.addField(tableload.application.template[i], array[i]);
							}

							const archive = msg.guild.channels.get(tableload.application.archivechannellog);
							archive.send({
								embed: acceptedembed
							});
						} catch (error) {
							var archivechannelnotexist = lang.application_archivechannelnotexist.replace('%prefix', tableload.prefix);
							msg.channel.send(archivechannelnotexist);
						}
					}
					message.delete();
				} catch (error) {
					return channel.send(lang.application_error);
				}
			} else if (r.emoji.name === '👎' && r.count >= tableload.application.reactionnumber) {
				msg.member.send(tableload.application.rejectedmessage);

				if (tableload.application.denyrole !== '') {
					const role = msg.guild.roles.get(tableload.application.denyrole);
					msg.member.addRole(role);
				}

				if (tableload.application.archivechannel === true) {
					try {
						var statusdenied = lang.application_statusdenied.replace('%authortag', msg.author.tag);
						var deniedembed = new Discord.RichEmbed()
							.setColor('#669900')
							.setAuthor(statusdenied, msg.author.displayAvatarURL);

						for (var i = 0; i < tableload.application.template.length; i++) {
							deniedembed.addField(tableload.application.template[i], array[i]);
						}

						const archive = msg.guild.channels.get(tableload.application.archivechannellog);
						archive.send({
							embed: deniedembed
						});
					} catch (error) {
						var archivechannelnotexist = lang.application_archivechannelnotexist.replace('%prefix', tableload.prefix);
						msg.channel.send(archivechannelnotexist);
					}
				}
				message.delete();
			}
		});
	} catch (error) {
		var votechannelnotexist = lang.application_votechannelnotexist.replace('%prefix', tableload.prefix);
		return msg.channel.send(votechannelnotexist);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['apply'],
	userpermissions: []
};
exports.help = {
	name: 'application',
	description: 'Creates a new application on this server',
	usage: 'application',
	example: ['application'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
