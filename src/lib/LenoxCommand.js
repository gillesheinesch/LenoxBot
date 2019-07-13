const { MessageEmbed, Permissions } = require('discord.js');
const { Command } = require('klasa');

class LenoxCommand extends Command {
	constructor(store, file, directory, options = {}) {
		super(store, file, directory, options);
		this.userPermissions = new Permissions(options.userPermissions).freeze();
	}

	async redirectDisplay(message, display, time = 120000) {
		const settings = message.guildSettings;
		if (settings.get('bot.redirect') && settings.get('bot.channel') && message.channel.id !== settings.get('bot.channel')) {
			message.channel.send(
				new MessageEmbed()
					.setColor(0x3669FA)
					.setDescription(`This command would be too spammy for this channel!\nPlease go to <#${settings.get('bot.channel')}> to see the results.`)
					.setFooter('This message self-destructs in 10 seconds')
			).then(m => m.delete({ timeout: 10000 }));
			const channel = message.guild.channels.get(settings.get('bot.channel'));
			if (channel) {
				await channel.send(`${message.author},`);
				return display.pages.length === 1
					? display.run(await channel.send('Loading...'), { time, stop: false, jump: false, firstLast: false })
					: (message.channel.permissionsFor(message.guild.me).has('ADD_REACTIONS') && message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES'))
						? display.run(
							await channel.send('Loading...'),
							{ time, stop: display.pages.length > 1, filter: (reaction, user) => user === message.author, jump: false, firstLast: false }
						)
						: display.run(await channel.send('Loading...'), { time, stop: false, jump: false, firstLast: false });
			}
		}
		return display.pages.length === 1
			? display.run(await message.send('Loading...'), { time, stop: false, jump: false, firstLast: false })
			: (message.channel.permissionsFor(message.guild.me).has('ADD_REACTIONS') && message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES'))
				? display.run(await message.send('Loading...'), { time, stop: display.pages.length > 1, filter: (reaction, user) => user === message.author, jump: false, firstLast: false })
				: display.run(await message.send('Loading...'), { time, stop: false, jump: false, firstLast: false });
	}
}

module.exports = LenoxCommand;