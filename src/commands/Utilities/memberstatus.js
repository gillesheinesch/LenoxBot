const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'View the status of members',
			extendedHelp: 'No extended help available.',
		});
	}

	async run(message) {
		const statusTypes = {
			online: 0,
			idle: 0,
			dnd: 0,
			offline: 0
		}

		for (const [id, member] of message.guild.members) {
			statusTypes[member.user.presence.status]++;
		}

		return message.send(new MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setColor('#99cc00')
			.setDescription([
				`📲 ${message.language.get('COMMAND_MEMBERSTATUS_ONLINE', statusTypes.online)}`,
				`🕗 ${message.language.get('COMMAND_MEMBERSTATUS_IDLE', statusTypes.idle)}`,
				`🔴 ${message.language.get('COMMAND_MEMBERSTATUS_DND', statusTypes.dnd)}`,
				`📵 ${message.language.get('COMMAND_MEMBERSTATUS_OFFLINE', statusTypes.offline)}`
			].join('\n'))
		)
	}

};
