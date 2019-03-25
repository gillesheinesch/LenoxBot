const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class languagefinderCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'languagefinder',
			group: 'staff',
			memberName: 'languagefinder',
			description: 'Allows the staffs of the bot to find out the language of a Discord server',
			format: 'languagefinder {guildid}',
			aliases: [],
			examples: ['languagefinder 352896116812939264'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const guild = msg.client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const content = args.slice().join(' ');
		if (!content || isNaN(content)) return msg.reply(lang.languagefinder_noguildid);

		if (!msg.client.provider.getGuild(msg.message.guild.id, 'language')) return msg.channel.send(lang.languagefinder_nofetch);

		const guildload = msg.client.guilds.get(content);
		const requestedby = lang.languagefinder_requestedby.replace('%authortag', msg.author.tag);
		const embed = new Discord.RichEmbed()
			.setColor('BLUE')
			.setThumbnail(guildload.iconURL)
			.addField(lang.languagefinder_embedfield1, `${guildload.owner.user.tag} (${guildload.owner.id})`)
			.addField(lang.languagefinder_embedfield2, msg.client.provider.getGuild(msg.message.guild.id, 'language').toUpperCase())
			.setFooter(requestedby)
			.setAuthor(`${guildload.name} (${guildload.id})`);

		return msg.client.channels.get('497395598182318100').send({ embed: embed });
	}
};
