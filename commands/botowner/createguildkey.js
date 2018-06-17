exports.run = async (client, msg, args, lang) => {
	const Discord = require('discord.js');
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	const botconfspremiumload = await client.botconfs.get('premium');
	botconfspremiumload.keys.numberofguildkeys = botconfspremiumload.keys.numberofguildkeys + 1;
	await client.botconfs.set('premium', botconfspremiumload);

	const embed = new Discord.RichEmbed()
	.setDescription(`This user has created a new serverkey (Code: ${botconfspremiumload.keys.numberofguildkeys})!`)
	.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
	.setTimestamp()
	.setColor('#cc99ff')
	.setTitle('New Serverkey created');
	await client.channels.get('419877966265319424').send({ embed });

	msg.reply(`Guildkey created: \`${botconfspremiumload.keys.numberofguildkeys}\``);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'createguildkey',
	description: 'Leave a self-assignable role',
	usage: 'leave {rolename}',
	example: ['leave Member'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']
};
