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
			archivechannellog: ''
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	var addtemplate = lang.application_addtemplate.replace('%prefix', tableload.prefix);
	if (tableload.application.template.length === 0) return msg.channel.send(addtemplate);

	var role = lang.application_role.replace('%prefix', tableload.prefix);
	if (tableload.application.role === '') return msg.channel.send(role);

	var votechannel = lang.application_votechannel.replace('%prefix', tableload.prefix);
	if (tableload.application.votechannel === '') return msg.channel.send(votechannel);

	var reactionnumber = lang.application_reactionnumber.replace('%prefix', tableload.prefix);
	if (tableload.application.reactionnumber === '') return msg.channel.send(reactionnumber);

	var newapplication = lang.application_newapplication.replace('%author', msg.author);
	msg.channel.send(newapplication);
	
	var array = [];

	for (var i = 0; i < tableload.application.template.length; i++) {
		try {
			await msg.channel.send(`${msg.author}, ${tableload.application.template[i]}`);
				var response = await msg.channel.awaitMessages(msg2 => msg2.attachments.size === 0 && msg.author.id === msg2.id && !msg2.author.bot && msg2.content.length < 200, {
					maxMatches: 1,
					time: 300000,
					errors: ['time']
				});
				await array.push(response.first().content);
			} catch (error) {
				var timeerror = lang.application_timeerror.replace('%prefix', tableload.prefix);
				return msg.channel.send(timeerror);
			}
		}

	const channel = msg.guild.channels.get(tableload.application.votechannel);

	var newapplicationembed = lang.application_newapplicationembed.replace('%authortag', msg.author.tag);
	const embed = new Discord.RichEmbed()
		.setColor('#669900')
		.setAuthor(newapplicationembed, msg.author.displayAvatarURL);

	for (var i = 0; i < tableload.application.template.length; i++) {
		embed.addField(tableload.application.template[i], array[i]);
	}

	try {
		var message = await channel.send({ embed });
		
		await message.react('👍');
		await message.react('👎');

		var collector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '👍' || reaction.emoji.name === '👎');
		collector.on('collect', r => {
			if (r.emoji.name === '👍' && r.count >= tableload.application.reactionnumber) {
				try {
					const role = msg.guild.roles.get(tableload.application.role);
					msg.member.addRole(role);

					var accepted = lang.application_accepted.replace('%guildname', msg.guild.name);
					msg.member.send(accepted);

					if (tableload.application.archive === true) {
						try {
							var statusaccepted = lang.application_statusaccepted.replace('%authortag', msg.author.tag);
							var acceptedembed = new Discord.RichEmbed()
							.setColor('#669900')
							.setAuthor(statusaccepted, msg.author.displayAvatarURL);

							for (var i = 0; i < tableload.application.template.length; i++) {
								acceptedembed.addField(tableload.application.template[i], array[i]);
							}

								const archive = msg.guild.channels.get(tableload.application.archivechannel);
								archive.send({ embed: acceptedembed });
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
					  var deniedembed = lang.application_denied.replace('%guildname', msg.guild.name);
					msg.member.send(denied);

					if (tableload.application.archive === true) {
						try {
							var statusdenied = lang.application_statusdenied.replace('%authortag', msg.author.tag);
							var denied = new Discord.RichEmbed()
							.setColor('#669900')
							.setAuthor(statusdenied, msg.author.displayAvatarURL);

							for (var i = 0; i < tableload.application.template.length; i++) {
								deniedembed.addField(tableload.application.template[i], array[i]);
							}

								const archive = msg.guild.channels.get(tableload.application.archivechannel);
								archive.send({ embed: deniedembed });
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
	aliases: [],
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
