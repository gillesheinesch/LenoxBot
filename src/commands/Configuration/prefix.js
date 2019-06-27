const { Command } = require("klasa");

module.exports = class extends Command {
	constructor (...args) {
		super(...args, {
			runIn: ["text"],
			description: language => language.get('COMMAND_PREFIX_DESCRIPTION'),
			usage: "[reset|prefix:str{,12}]",
			requiredPermissions: ['EMBED_LINKS'],
			cooldown: 5,
			aliases: ['set-prefix']
		});
	}

	async run (message, [new_prefix]) {
		const prefix = message.guildSettings.get('prefix');
		const { broke, permission } = await this.client.permissionLevels.run(message, 6);
		if (!new_prefix) return message.send({
			embed: {
				color: 0x3669FA,
				description: message.language.get('SETTING_CURRENT_SERVER_PREFIX', prefix),
				footer: {
					text: message.language.get('SETTING_PREFIX_CAN_ALSO_MENTION')
				}
			}
		});
		if (permission) {
			if (['reset','default'].includes(new_prefix)) return this._reset(message);
			if (prefix === new_prefix) throw message.language.get('COMMAND_CONF_NOCHANGE');
			await settings.update("prefix", new_prefix);
			return message.send({
				embed: {
					color: 0x43B581,
					description: message.language.get('SETTING_PREFIX_YOU_CAN_NOW_USE', new_prefix),
					footer: {
						text: message.language.get('SETTING_PREFIX_ILL_ANSWER_TO_MENTIONS')
					}
				}
			});
		} else {
			throw message.language.get('INHIBITOR_PERMISSIONS');
		}
	};

	async _reset(message) {
		const settings = message.guild.settings;
		await settings.reset('prefix');
		return message.send({
			embed: {
				color: 0x43B581,
				description: message.language.get('SETTING_RESET_PREFIX')
			}
		});
	};
};