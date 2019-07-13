const { Inhibitor, util } = require('klasa');
const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args);

		this.friendlyPerms = Object.keys(FLAGS).reduce((obj, key) => {
			obj[key] = util.toTitleCase(key.split('_').join(' '));
			return obj;
		}, {});
	}

	run(message, command) {
		if (message.channel.type === 'text') {
			const missing = message.channel.permissionsFor(message.author).missing(command.userPermissions, false);
			if (missing.length) throw new MessageEmbed()
				.setColor(15684432)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(message.language.get('INHIBITOR_MISSING_USER_PERMS', missing.map(key => this.friendlyPerms[key]).join('` `')))
				.setTimestamp()
		}
	}

};