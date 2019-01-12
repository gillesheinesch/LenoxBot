const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class prefixfinderCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'prefixfinder',
			group: 'staff',
			memberName: 'prefixfinder',
			description: 'Allows the staff of the bot to find out the prefix of a Discord server',
			format: 'prefixfinder {guildid}',
			aliases: [],
			examples: ['prefixfinder 332612123492483094'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const guild = msg.client.guilds.get('332612123492483094').roles.find(r => r.name.toLowerCase() === 'administrator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const content = args.slice().join(' ');
		if (!content || isNaN(content)) return msg.reply(lang.prefixfinder_noguildid);

		if (!msg.client.provider.getGuild(msg.message.guild.id, 'language')) return msg.channel.send(lang.prefixfinder_nofetch);

		const guildload = msg.client.guilds.get(content);
		const requestedby = lang.prefixfinder_requestedby.replace('%authortag', msg.author.tag);
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setThumbnail(guildload.iconURL)
			.addField(lang.prefixfinder_embedfield1, `${guildload.owner.user.tag} (${guildload.owner.id})`)
			.addField(lang.prefixfinder_embedfield2, msg.client.provider.getGuild(msg.message.guild.id, 'prefix'))
			.setFooter(requestedby)
			.setAuthor(`${guildload.name} (${guildload.id})`);

		return msg.client.channels.get('530079522532622396').send({ embed: embed });
	}
};
