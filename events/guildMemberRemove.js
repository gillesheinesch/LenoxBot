const Discord = require('discord.js');
exports.run = (client, member) => {
	if (client.user.id === member.id) return;

	const tableconfig = client.guildconfs.get(member.guild.id);

	if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(member.guild.id, tableconfig);
	}

	var lang = require(`../languages/${tableconfig.language}.json`);

	if (tableconfig.byelog === 'true') {
		const messagechannel = client.channels.get(tableconfig.byelogchannel);
		const embed = new Discord.RichEmbed()
		.setFooter(lang.guildmemberremoveevent_userleft)
		.setTimestamp()
		.setColor('#FF0000')
		.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL);
		messagechannel.send({ embed: embed });
	}

	if (tableconfig.bye === 'true') {
		if (tableconfig.byemsg.length < 1) return;
		const message = tableconfig.byemsg;
		const msgchannel = client.channels.get(tableconfig.byechannel);
		const newMessage = message.replace('$username$', member.user.username)
		.replace('$userid$', member.user.id)
		.replace('$guildname$', member.guild.name)
		.replace('$guildid$', member.guild.id);
		msgchannel.send(newMessage);
	}
};
