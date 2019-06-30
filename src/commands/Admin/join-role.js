const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_JOINROLE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_JOINROLE_EXTENDEDHELP'),
			usage: '<add|remove|list:default> [GuildRole:role]',
			requiredPermissions: ['SEND_MESSAGES'],
			permissionLevel: 10,
			subcommands: true
		});
		this.guildOnlyArgs = ['role'];
	}

	async add(message, [role]) {
		if (!role) return message.reply(message.language.get('COMMAND_JOINROLE_NOINPUT'));
		const settings = this.client.settings;
		const joinrole_settings = settings.get('joinroles');
		if (joinrole_settings.includes(role.id)) return message.reply(message.language.get('COMMAND_JOINROLE_ALREADYADDED'));
		if (joinrole_settings.length >= 5) return message.reply(message.language.get('COMMAND_JOINROLE_MAXIMUM'));
		await settings.update('joinroles', role.id, { action: 'add' });
		return message.reply(message.language.get('COMMAND_JOINROLE_ROLEADDED'));
	}

	async remove(message, [role]) {
		if (!role) return message.reply(message.language.get('COMMAND_JOINROLE_NOINPUTREMOVE'));
		const settings = this.client.settings;
		const joinrole_settings = settings.get('joinroles');
		if (!joinrole_settings.includes(role.id)) return message.reply(message.language.get('COMMAND_JOINROLE_NOTADDED'));
		await settings.update('joinroles', role.id, { action: 'remove' });
		return message.reply(message.language.get('COMMAND_JOINROLE_ROLEREMOVED'));
	}

	async list(message) {
		const settings = this.client.settings;
		const joinrole_settings = settings.get('joinroles');
		if (!joinrole_settings.length) return message.reply(message.language.get('COMMAND_JOINROLE_NOJOINROLES'));
		const joinroleEmbed = new MessageEmbed()
			.setTimestamp()
			.setTitle(message.language.get('COMMAND_JOINROLE_EMBEDTITLE'))
			.setColor('BLUE');
		const arrayForEmbedDescription = [];
		for (let index = 0; index < joinrole_settings.length; index++) {
			if (!message.guild.roles.has(joinrole_settings[index])) {
				const indexOfTheRole = joinrole_settings.indexOf(joinrole_settings[index]);
				const currentJoinroles = joinrole_settings;
				currentJoinroles.splice(indexOfTheRole, 1);
				await settings.update('joinroles', currentJoinroles, { action: 'remove' });
			}
			if (joinrole_settings.length !== 0) {
				const joinrole = message.guild.roles.get(joinrole_settings[index]);
				arrayForEmbedDescription.push(`${joinrole.name} (${joinrole.id})`);
			}
		}
		joinroleEmbed.setDescription(arrayForEmbedDescription.join('\n'));
		return message.channel.send({
			embed: joinroleEmbed
		});
	}
};
