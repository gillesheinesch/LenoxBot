const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class msgoptionsCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'msgoptions',
			group: 'administration',
			memberName: 'msgoptions',
			description: 'Shows you a list of all available options for your welcome and bye msg',
			format: 'msgoptions',
			aliases: [],
			examples: ['msgoptions'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const validation = ['$usertag$', '$usermention$', '$username$', '$userid$', '$guildname$', '$guildid$'];

		const embed = new Discord.RichEmbed()
			.setColor('#7FFFD4')
			.setAuthor(lang.msgoptions_embed);

		for (let i = 0; i < validation.length; i++) {
			embed.addField(validation[i], lang[`msgoptions_${validation[i]}`]);
		}

		msg.channel.send({
			embed
		});
	}
};
