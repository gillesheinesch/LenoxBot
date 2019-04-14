const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');
const Discord = require('discord.js');

module.exports = class restartCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'restart',
			group: 'botowner',
			memberName: 'restart',
			description: 'Restarts the bot',
			format: 'restart',
			aliases: ['reboot'],
			examples: ['restart'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		if (!settings.owners.includes(msg.author.id) || !settings.administrators.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

		await msg.channel.send(lang.restart_message);

		const restartEmbed = new Discord.RichEmbed()
			.setTitle('LenoxBot will now have a restart! We will inform you as soon as LenoxBot is back!')
			.setColor('RED')
			.setTimestamp()
			.setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL);

		if (msg.client.user.id === '354712333853130752') {
			await msg.client.channels.get('497400107109580801').send({
				embed: restartEmbed
			});
		}

		process.exit(42);
	}
};
