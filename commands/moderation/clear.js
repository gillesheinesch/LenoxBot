exports.run = async(client, msg, args, lang) => {
	const Discord = require('discord.js');
	const tableload = client.guildconfs.get(msg.guild.id);
	
	if (args.slice().length === 0) return msg.reply(lang.clear_error);
	if (isNaN(args.slice().join(" "))) return msg.reply(lang.clear_number).then(m => m.delete(10000));

	let messagecount = parseInt(args.join(' '));

	if (messagecount > 100) return msg.reply(lang.clear_max100).then(m => m.delete(10000));
	if (messagecount < 2) return msg.reply(lang.clear_min2).then(m => m.delete(10000));

	if (tableload.commanddel === 'false') {
		await msg.delete();
	}

	await msg.channel.fetchMessages({ limit: messagecount }).then(messages => msg.channel.bulkDelete(messages));

	var messagesdeleted = lang.clear_messagesdeleted.replace('%messagecount', messagecount);
	const messageclearembed = new Discord.RichEmbed()
	.setColor('#99ff66')
	.setDescription(`✅ ${messagesdeleted}`);
	msg.channel.send({ embed: messageclearembed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['purge'],
    userpermissions: ['MANAGE_MESSAGES']
};
exports.help = {
	name: 'clear',
	description: 'Deletes for you the last X messages that were sent in the current channel',
	usage: 'clear {2-100}',
	example: ['clear 50'],
	category: 'moderation',
    botpermissions: ['MANAGE_MESSAGES', 'SEND_MESSAGES']
};
