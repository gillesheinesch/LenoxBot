const Discord = require('discord.js');
exports.run = (client, member) => {
	const tableconfig = client.guildconfs.get(member.guild.id);

	if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(member.guild.id, tableconfig);
	}

	var lang = require(`../languages/${tableconfig.language}.json`);

	if (tableconfig.welcomelog === 'true') {
	const messagechannel = client.channels.get(tableconfig.welcomelogchannel);
	const embed = new Discord.RichEmbed()
	.setFooter(lang.guildmemberaddevent_userjoined)
	.setTimestamp()
	.setColor(0x00AE86)
	.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL);
	messagechannel.send({ embed: embed });
	}
	
	if (tableconfig.welcome === 'true') {
		if (tableconfig.welcomemsg.length < 1) return;
		const message = tableconfig.welcomemsg;
		const messagechannel = client.channels.get(tableconfig.welcomechannel);
		const newMessage = message.replace('$username$', member.user.username)
		.replace('$userid$', member.user.id)
		.replace('$guildname$', member.guild.name)
		.replace('$guildid$', member.guild.id);
		messagechannel.send(newMessage);
	}
};
