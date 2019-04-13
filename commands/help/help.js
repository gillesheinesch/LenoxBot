const LenoxCommand = require('../LenoxCommand.js');

module.exports = class helpCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'help',
			memberName: 'help',
			description: 'TODO: Setdescription',
			format: 'help {commandname}',
			aliases: ['h'],
			examples: ['help botinfo', 'help'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Help',
			dashboardsettings: false
		});
	}

	run(msg) {
		const Discord = require('discord.js');
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');
		let command = args[0];

		if (!args[0]) {
			const embed = new Discord.RichEmbed()
				.addField(lang.help_addthebot, `https://lenoxbot.com/invite/`)
				.addField(lang.help_discordserver, `https://lenoxbot.com/discord/`)
				.addField(lang.help_modulecommand, `${prefix}modules`)
				.addField(lang.help_commandscommand, `${prefix}commands {${lang.help_modulename}}`)
				.addField(lang.help_helpcommand, `${prefix}help {${lang.help_command}}`)
				.addField(lang.botinfo_website, 'https://lenoxbot.com/')
				.addField(lang.help_translation, 'https://crowdin.com/project/lenoxbot')
				.addField(lang.help_status, 'https://status.lenoxbot.com/')
				.setColor('#ff3300')
				.setAuthor(msg.client.user.username, msg.client.user.displayAvatarURL);

			return msg.channel.send({ embed });
		}

		if (msg.client.registry.commands.has(command)) {
			command = msg.client.registry.commands.get(command);

			if (command.groupID === 'botowner' && msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
			if (command.groupID === 'staff' && !msg.member.roles.get('386627285119402006')) return msg.channel.send(lang.botownercommands_error);

			const aliases = [];
			if (command.aliases.length !== 0) {
				for (let i = 0; i < command.aliases.length; i++) {
					aliases.push(`${prefix}${command.aliases[i]}`);
				}
			}

			const examples = [];
			if (command.examples.length !== 0) {
				for (let i = 0; i < command.examples.length; i++) {
					examples.push(`${prefix}${command.examples[i]}`);
				}
			}

			const category = lang.help_category.replace('%category', command.groupID);
			const commandembed = new Discord.RichEmbed()
				.setColor('BLUE')
				.setAuthor(`${prefix}${command.aliases.length === 0 ? command.name : `${command.name} / `} ${aliases.join(' / ')}`)
				.setDescription(lang[`${command.name}_description`])
				.addField(lang.help_usage, prefix + command.format)
				.addField(lang.help_permissions, command.userpermissions.length === 0 ? '/' : command.userpermissions.join(', '))
				.addField(lang.help_example, examples.length === 0 ? '/' : examples.join('\n'))
				.setFooter(category);

			return msg.channel.send({ embed: commandembed });
		} else {
			/* eslint guard-for-in: 0 */
			/* eslint no-else-return: 0 */
			for (let key = 0; key < msg.client.registry.commands.array().length; key++) {
				if (msg.client.registry.commands.array()[key].aliases.includes(command)) {
					command = msg.client.registry.commands.array()[key];

					if (command.groupID === 'botowner' && msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
					if (command.groupID === 'staff' && !msg.member.roles.get('386627285119402006')) return msg.channel.send(lang.botownercommands_error);

					const aliases = [];
					if (command.aliases.length !== 0) {
						for (let i = 0; i < command.aliases.length; i++) {
							aliases.push(`${prefix}${command.aliases[i]}`);
						}
					}

					const examples = [];
					if (command.examples.length !== 0) {
						for (let i = 0; i < command.examples.length; i++) {
							examples.push(`${prefix}${command.examples[i]}`);
						}
					}

					const category = lang.help_category.replace('%category', command.groupID);
					const aliasembed = new Discord.RichEmbed()
						.setColor('BLUE')
						.setAuthor(`${prefix}${command.aliases.length === 0 ? command.name : `${command.name} / `} ${aliases.join(' / ')}`)
						.setDescription(lang[`${command.name}_description`])
						.addField(lang.help_usage, prefix + command.format)
						.addField(lang.help_permissions, command.userpermissions.length === 0 ? '/' : command.userpermissions.join(', '))
						.addField(lang.help_example, examples.length === 0 ? '/' : examples.join('\n'))
						.setFooter(category);
					return msg.channel.send({ embed: aliasembed });
				}
			}
		}
		return msg.channel.send(lang.help_error);
	}
};
