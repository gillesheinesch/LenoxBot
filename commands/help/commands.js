const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'botowner', 'moderation', 'staff', 'application', 'currency', 'partner', 'tickets', 'customcommands'];
	const margs = msg.content.split(" ");

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			for (var index = 0; index < validation.length; index++) {
				if (margs[1].toLowerCase() == validation[index]) {
					var commandShortDescriptions = [];
					var embed = new Discord.RichEmbed()
						.setColor('#009900');

					var commands = client.commands.filter(c => c.help.category === validation[index]).array();

					for (var i = 0; i < commands.length; i++) {
						if (!commandShortDescriptions.includes(commands[i].conf.shortDescription)) {
							commandShortDescriptions.push(commands[i].conf.shortDescription);
						}
					}

					for (var index2 = 0; index2 < commandShortDescriptions.length; index2++) {
						var newCommands = commands.filter(c => c.conf.shortDescription.toLowerCase() === commandShortDescriptions[index2].toLowerCase());
						embed.addField(lang[`commands_${commandShortDescriptions[index2].toLowerCase()}`] ? lang[`commands_${commandShortDescriptions[index2].toLowerCase()}`] : commandShortDescriptions[index2], `\`\`\`asciidoc\n${newCommands.map(cmd => `${tableload.prefix}${cmd.help.name} :: ${lang[`${cmd.help.name}_description`]}`).join("\n")}\`\`\``);
					}

					const message = await msg.channel.send({
						embed: embed
					})

					if (client.commands.filter(c => c.help.category === validation[index]).array().length <= 20) return undefined;

					await message.react('◀');
					await message.react('▶');

					var first = 0;
					var second = 20;

					var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
						time: 60000
					});
					collector.on('collect', r => {
						var reactionadd = client.commands.filter(c => c.help.category === validation[index]).array().slice(first + 20, second + 20).length;
						var reactionremove = client.commands.filter(c => c.help.category === validation[index]).array().slice(first - 20, second - 20).length;

						if (r.emoji.name === '▶' && reactionadd !== 0) {
							r.remove(msg.author.id);
							var newCommands = client.commands.filter(c => c.help.category === validation[index]).array().slice(first + 20, second + 20);
							var newCommandShortDescriptions = [];
							var newEmbed = new Discord.RichEmbed()
								.setColor('#009900');

							for (var i = 0; i < newCommands.length; i++) {
								if (!newCommandShortDescriptions.includes(newCommands[i].conf.shortDescription)) {
									newCommandShortDescriptions.push(newCommands[i].conf.shortDescription);
								}
							}

							for (var index2 = 0; index2 < newCommandShortDescriptions.length; index2++) {
								var new2Commands = newCommands.filter(c => c.conf.shortDescription.toLowerCase() === newCommandShortDescriptions[index2].toLowerCase());
								newEmbed.addField(lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] ? lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] : newCommandShortDescriptions[index2], `\`\`\`asciidoc\n${new2Commands.map(cmd => `${tableload.prefix}${cmd.help.name} :: ${lang[`${cmd.help.name}_description`]}`).join("\n")}\`\`\``);
							}

							first = first + 20;
							second = second + 20;

							message.edit({
								embed: newEmbed
							});
						} else if (r.emoji.name === '◀' && reactionremove !== 0) {
							r.remove(msg.author.id);
							var newCommands = client.commands.filter(c => c.help.category === validation[index]).array().slice(first - 20, second - 20);
							var newCommandShortDescriptions = [];
							var newEmbed = new Discord.RichEmbed()
								.setColor('#009900');

							for (var i = 0; i < newCommands.length; i++) {
								if (!newCommandShortDescriptions.includes(newCommands[i].conf.shortDescription)) {
									newCommandShortDescriptions.push(newCommands[i].conf.shortDescription);
								}
							}

							for (var index2 = 0; index2 < newCommandShortDescriptions.length; index2++) {
								var new2Commands = newCommands.filter(c => c.conf.shortDescription.toLowerCase() === newCommandShortDescriptions[index2].toLowerCase());
								newEmbed.addField(lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] ? lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] : newCommandShortDescriptions[index2], `\`\`\`asciidoc\n${new2Commands.map(cmd => `${tableload.prefix}${cmd.help.name} :: ${lang[`${cmd.help.name}_description`]}`).join("\n")}\`\`\``);
							}

							first = first - 20;
							second = second - 20;

							message.edit({
								embed: newEmbed
							});
						}
					});
					collector.on('end', (collected, reason) => {
						message.react('❌');
					});
					return undefined;
				}
			}
		}
	}
	var error = lang.commands_error.replace('%prefixmodules', `\`${tableload.prefix}modules\``);
	msg.channel.send(error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: "Help",
	aliases: ['cmds'],
	userpermissions: [],
	dashboardsettings: false
};
exports.help = {
	name: 'commands',
	description: 'All commands of a module',
	usage: 'commands {name of the module}',
	example: ['commands help', 'commands administration'],
	category: 'help',
	botpermissions: ['SEND_MESSAGES']
};