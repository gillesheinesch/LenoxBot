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

	if (tableload.application.template.length === 0) return msg.channel.send(`First, an administrator of this server has to set the entries for this template. This can be done by using ${tableload.prefix}addtemplate`);
	if (tableload.application.role === '') return msg.channel.send(`First, an administrator of this server has to set the role that a member will get if his application was accepted. This can be done by using ${tableload.prefix}role`);
	if (tableload.application.votechannel === '') return msg.channel.send(`First, an administrator of this server has to set the channel in which it's possible to vote for the application. This can be done by using ${tableload.prefix}votechannel`);
	if (tableload.application.reactionnumber === '') return msg.channel.send(`First, an administrator of this server has to set the number of required reactions for acceptance or refusal of an application. This can be done by using ${tableload.prefix}reactionnumber`);

	msg.channel.send(`${msg.author}, a new application was created. Please remember that every answer to the following questions can have up to 200 characters, otherwise it will be ignored! `);
	
	var array = [];

	for (var i = 0; i < tableload.application.template.length; i++) {
		try {
			await msg.channel.send(`${msg.author}, ${tableload.application.template[i]}`);
				var response = await msg.channel.awaitMessages(msg2 => msg2.attachments.size === 0 && !msg2.author.bot && msg2.content.length < 200, {
					maxMatches: 1,
					time: 60000,
					errors: ['time']
				});
				await array.push(response.first().content);
			} catch (error) {
				return msg.channel.send(`You didn't reply within 5 minutes, so your application was aborted now. If you want to write a new one, you can do this easily by using ${tableload.prefix}application.`);
			}
		}

	const channel = msg.guild.channels.get(tableload.application.votechannel);

	const embed = new Discord.RichEmbed()
		.setColor('#669900')
		.setAuthor(`New application by ${msg.author.tag}`, msg.author.displayAvatarURL);

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
					msg.member.send(`Congratulations! Your application on the ${msg.guild.name} server was successfully accepted.`);

					if (tableload.application.archive === true) {
						try {
							var accepted = new Discord.RichEmbed()
							.setColor('#669900')
							.setAuthor(`Status of the application: Accepted ✅, application by ${msg.author.tag}`, msg.author.displayAvatarURL);

							for (var i = 0; i < tableload.application.template.length; i++) {
								embed.addField(tableload.application.template[i], array[i]);
							}

								const archive = msg.guild.channels.get(tableload.application.archivechannel);
								archive.send({ embed: accepted });
							} catch (error) {
								msg.channel.send(`On this server, an archive channel was set, but it doesn't exist anymore. Set a new channel by using ${tableload.prefix}togglearchive`);
							}
					}
					message.delete();
				} catch (error) {
					return channel.send(`An error has occurred. Either the defined role for accepted applicants doesn't exist anymore or the bot hasn't enough permissions to give the role to the member.`);
				}
				  } else if (r.emoji.name === '👎' && r.count >= tableload.application.reactionnumber) {
					msg.member.send(`We apologise for that your application on the server ${msg.guild.name} was denied.`);

					if (tableload.application.archive === true) {
						try {
							var denied = new Discord.RichEmbed()
							.setColor('#669900')
							.setAuthor(`Status of the application: Denied ❌, application by ${msg.author.tag}`, msg.author.displayAvatarURL);

							for (var i = 0; i < tableload.application.template.length; i++) {
								embed.addField(tableload.application.template[i], array[i]);
							}

								const archive = msg.guild.channels.get(tableload.application.archivechannel);
								archive.send({ embed: denied });
						} catch (error) {
							msg.channel.send(`On this server, an archive channel was set, but it doesn't exist anymore. Set a new channel by using ${tableload.prefix}togglearchive`);
						}
					}
					message.delete();
				}
		});
	} catch (error) {
		return msg.channel.send(`On this server, a vote channel was set, but it doesn't exist anymore. Set a new channel by using ${tableload.prefix}votechannel`);
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
