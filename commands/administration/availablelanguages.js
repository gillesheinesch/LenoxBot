const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class availablelanguagesCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'availablelanguages',
			group: 'administration',
			memberName: 'availablelanguages',
			description: 'Shows you a list in which language the bot is available and can be changed',
			format: 'availablelanguages',
			aliases: [],
			examples: ['availablelanguages'],
			category: 'administration',
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Localization',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const embed = new Discord.RichEmbed()
			.setColor('BLUE')
			.setDescription(lang.availablelanguages_descriptionembed)
			.setAuthor(lang.availablelanguages_languages);

		msg.channel.send({ embed });
	}
};
