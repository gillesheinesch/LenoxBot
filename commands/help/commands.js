const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'botowner', 'moderation', 'staff', 'application', 'currency', 'partner', 'tickets', 'customcommands'];
	const margs = msg.content.split(' ');

	for (let i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			for (let index = 0; index < validation.length; index++) {
				if (margs[1].toLowerCase() === validation[index]) {
					if (validation[index] === 'botowner' && msg.author.id !== '238590234135101440') {
						return msg.channel.send(lang.botownercommands_error);
					}

					if (typeof client.guilds.get('352896116812939264') !== 'undefined') {
						const moderatorRole = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
						if (validation[index] === 'staff' && !msg.member.roles.get(moderatorRole)) {
							return msg.channel.send(lang.botownercommands_error);
						}
					}

					const commandShortDescriptions = [];
					const embed = new Discord.RichEmbed()
						.setDescription(lang[`modules_${validation[index].toLowerCase()}`] ? lang[`modules_${validation[index].toLowerCase()}`] : 'No description')
						.setColor('#009900');

					const commands = client.commands.filter(c => c.help.category === validation[index]).array();

					for (let index2 = 0; index2 < commands.length; index2++) {
						if (!commandShortDescriptions.includes(commands[index2].conf.shortDescription)) {
							commandShortDescriptions.push(commands[index2].conf.shortDescription);
						}
					}

					for (let index3 = 0; index3 < commandShortDescriptions.slice(0, 7).length; index3++) {
						const newCommands = commands.filter(c => c.conf.shortDescription.toLowerCase() === commandShortDescriptions[index3].toLowerCase());
						const shortDescriptionCheck = await lang[`commands_${commandShortDescriptions[index3].toLowerCase()}`];
						embed.addField(typeof shortDescriptionCheck === 'undefined' ? commandShortDescriptions[index3] : lang[`commands_${commandShortDescriptions[index3].toLowerCase()}`], `\`\`\`asciidoc\n${newCommands.map(cmd => `${tableload.prefix}${cmd.help.name} :: ${lang[`${cmd.help.name}_description`] ? lang[`${cmd.help.name}_description`] : cmd.help.description}`).join('\n')}\`\`\``);
					}

					const message = await msg.channel.send({
						embed: embed
					});

					if (commandShortDescriptions.length <= 7) return;
					const reaction1 = await message.react('◀');
					const reaction2 = await message.react('▶');

					let first = 0;
					let second = 7;

					const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
						time: 60000
					});
					collector.on('collect', r => {
						const reactionadd = commandShortDescriptions.slice(first + 7, second + 7).length;
						const reactionremove = commandShortDescriptions.slice(first - 7, second - 7).length;

						if (r.emoji.name === '▶' && reactionadd !== 0) {
							r.remove(msg.author.id);
							const newCommandShortDescriptions = commandShortDescriptions.slice(first + 7, second + 7);
							const newEmbed = new Discord.RichEmbed()
								.setColor('#009900');

							for (let index2 = 0; index2 < newCommandShortDescriptions.length; index2++) {
								const new2Commands = commands.filter(c => c.conf.shortDescription.toLowerCase() === newCommandShortDescriptions[index2].toLowerCase());
								newEmbed.addField(lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] ? lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] : newCommandShortDescriptions[index2], `\`\`\`asciidoc\n${new2Commands.map(cmd => `${tableload.prefix}${cmd.help.name} :: ${lang[`${cmd.help.name}_description`] ? lang[`${cmd.help.name}_description`] : cmd.help.description}`).join('\n')}\`\`\``);
							}

							first += 7;
							second += 7;

							message.edit({
								embed: newEmbed
							});
						} else if (r.emoji.name === '◀' && reactionremove !== 0) {
							r.remove(msg.author.id);
							const newCommandShortDescriptions = commandShortDescriptions.slice(first - 7, second - 7);
							const newEmbed = new Discord.RichEmbed()
								.setColor('#009900');

							for (let index2 = 0; index2 < newCommandShortDescriptions.length; index2++) {
								const new2Commands = commands.filter(c => c.conf.shortDescription.toLowerCase() === newCommandShortDescriptions[index2].toLowerCase());
								newEmbed.addField(lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] ? lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] : newCommandShortDescriptions[index2], `\`\`\`asciidoc\n${new2Commands.map(cmd => `${tableload.prefix}${cmd.help.name} :: ${lang[`${cmd.help.name}_description`] ? lang[`${cmd.help.name}_description`] : cmd.help.description}`).join('\n')}\`\`\``);
							}

							first -= 7;
							second -= 7;

							message.edit({
								embed: newEmbed
							});
						}
					});
					collector.on('end', () => {
						reaction1.remove();
						reaction2.remove();
					});
					return;
				}
			}
		}
	}
	const error = lang.commands_error.replace('%prefixmodules', `\`${tableload.prefix}modules\``);
	return msg.channel.send(error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Help',
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
