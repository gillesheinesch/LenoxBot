const Discord = require('discord.js');
exports.run = (client, oldMsg, msg) => {
    const tableconfig = client.guildconfs.get(msg.guild.id);
    if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply('You must run the commands on a Discord server on which the Discord Bot is available');
	const tableload = client.guildconfs.get(msg.guild.id);
	if (!msg.content.startsWith(tableload.prefix)) return;
	var command = msg.content.split(' ')[0].slice(tableload.prefix.length).toLowerCase();
	var args = msg.content.split(' ').slice(1);
	let cmd;
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	}
	if (cmd) {
		cmd.run(client, msg, args);
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
	}
    if (tableconfig.messageupdatelog === 'false') return;
    const messagechannel = client.channels.get(tableconfig.messageupdatelogchannel);
    if (oldMsg.cleanContent !== msg.cleanContent) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Message updated!')
    .addField(`🗣 Author:`, msg.author.tag)
    .addField(`📲 Channel:`, `#${msg.channel.name} (${msg.channel.id})`)
    .addField(`📎 MessageID:`, msg.id)
    .addField(`📤 Old Message:`, oldMsg.cleanContent)
    .addField(`📥 New Message:`, msg.cleanContent);
    messagechannel.send({ embed: embed });
    }
};
