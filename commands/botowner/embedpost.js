exports.run = async (client, msg, args, lang) => {
	const Discord = require('discord.js');
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	const validation = ['discordrules'];
	const margs = msg.content.split(" ");

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == 'discordrules') {
				const rules = ['**1.** No spam, advertising or NSFW content! Nobody likes trolls so please do not do that as well.',
					'**2.** This server only deal with LenoxBot and nothing else. We do not give support for anything that has nothing to do with LenoxBot',
					'**3.** If you need help and no one is currently online, you can use @help. Please do not use @help without justification. Example of how to use @help correctly: "@help why is the bot offline?"',
					'**4.** If you have questions, please try to provide as much information as possible so that we can help you quickly',
					'**5.** Please do not mark team members to get a quicker answer to your question. Direct messages are also included. It\'s much better to ask your question (s) in Public Channel. Most of the time you get a faster answer!',
					'**6.** If your discord name is not easy to mention, please change your nickname to a name that is easier to mark!',
					'**7.** Respect the channel category language. For each language in which the bot is available, there is a separate channel category in which only this language may be spoken!',
					'**8.** Writing in caps is prohibited',
					'**9.** Disrespectful or offensive messages to a Discord User are prohibited!'
				];
				const embed = new Discord.RichEmbed()
					.setDescription(rules.join("\n\n"))
					.setColor('#ff0000')
					.setAuthor('📌 Please read each of these rules before using this discord server.');
				return msg.channel.send({
					embed
				});
			}
		}
	}
	return msg.reply('No such an embed');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'embedpost',
	description: 'Leave a self-assignable role',
	usage: 'leave {rolename}',
	example: ['leave Member'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']
};