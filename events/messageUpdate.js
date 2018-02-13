const Discord = require('discord.js');
exports.run = async(client, oldMsg, msg) => {
	const tableconfig = client.guildconfs.get(msg.guild.id);

	if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(msg.guild.id, tableconfig);
	}

	var lang = require(`../languages/${tableconfig.language}.json`);
	
    if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply(lang.messageevent_error);

	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableconfig.messageupdatelog === 'true') {
    const messagechannel = client.channels.get(tableconfig.messageupdatelogchannel);
    if (oldMsg.cleanContent !== msg.cleanContent) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.messageupdateevent_updated)
    .addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
    .addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
    .addField(`📎 ${lang.messagedeleteevent_mid}:`, msg.id)
    .addField(`📤 ${lang.messageupdateevent_old}:`, oldMsg.cleanContent.substring(0, 960) + ' ...')
    .addField(`📥 ${lang.messageupdateevent_new}:`, msg.cleanContent.substring(0, 960) + ' ...');
    messagechannel.send({ embed: embed });
	}
}
	if (msg.content.startsWith(tableload.prefix)) {
	var command = msg.content.split(' ')[0].slice(tableload.prefix.length).toLowerCase();
	var args = msg.content.split(' ').slice(1);
	let cmd;
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	}
	if (cmd) {
		const banlistembed = new Discord.RichEmbed()
		.setColor('#FF0000')
		.setDescription(lang.messageevent_banlist)
		.addField(lang.messageevent_support, 'https://discord.gg/PjZM36X')
		.addField(lang.messageevent_banappeal, 'http://bit.ly/2wQ2SYF')
		.setAuthor(`${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL);

		const blacklistembed = new Discord.RichEmbed()
		.setColor('#FF0000')
		.setDescription(lang.messageevent_blacklist)
		.addField(lang.messageevent_support, 'https://discord.gg/PjZM36X')
		.addField(lang.messageevent_banappeal, 'http://bit.ly/2wQ2SYF')
		.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL);

		const botconfsload = client.botconfs.get('blackbanlist');
		for (var i = 0; i < botconfsload.banlist.length; i++) {
			if (msg.guild.id === botconfsload.banlist[i]) return msg.channel.send({ embed: banlistembed });
	}
		for (var i = 0; i < botconfsload.blacklist.length; i++) {
			if (msg.author.id === botconfsload.blacklist[i]) return msg.channel.send({ embed: blacklistembed });
	}

	const botconfig = client.botconfs.get('botconfs');
	const activityembed = new Discord.RichEmbed()
	.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL)
	.addField('Command', `${tableload.prefix}${command} ${args.join(" ")}`)
	.addField('Guild', `${msg.guild.name} (${msg.guild.id})`)
	.setTimestamp();
	if (botconfig.activity === true) {
		const messagechannel = client.channels.get(botconfig.activitychannel);
		messagechannel.send({ embed: activityembed });
	}

	var botnopermission = lang.messageevent_botnopermission.replace('%missingpermissions', cmd.help.botpermissions.join(', '));
	var usernopermission = lang.messageevent_usernopermission.replace('%missingpermissions', cmd.conf.userpermissions.join(', '));
	if (cmd.help.botpermissions.every(perm => msg.guild.me.hasPermission(perm)) === false) return msg.channel.send(botnopermission);
	if (cmd.conf.userpermissions.every(perm => msg.member.hasPermission(perm)) === false) return msg.channel.send(usernopermission);


	if (cmd.conf.enabled === false) return msg.reply(lang.messageevent_commanddisabled);

		cmd.run(client, msg, args, lang);
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
	} else {
		const input = msg.content.split(' ').slice();
		if (tableload.chatfilter.chatfilter === 'true' && tableload.chatfilter.array.length !== 0) {
			for (var i = 0; i < tableload.chatfilter.array.length; i++) {
				for (let index = 0; index < input.length; index++) {
					if (input[index].toLowerCase() === tableload.chatfilter.array[i].toLowerCase()) {
						if (tableload.chatfilterlog === 'true') {
							const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', msg.author.tag);
						
							const embed = new Discord.RichEmbed()
							.addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
							.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
							.addField(`📥 ${lang.messagereactionaddevent_message}:`, msg.cleanContent)
							.setColor('#FF0000')
							.setAuthor(chatfilterembed);
						
							try {
								await msg.guild.channels.get(tableload.chatfilterlogchannel).send({ embed });
							} catch (error) {
								return undefined;
							}
						}
						await msg.delete();
		
						const messagedeleted = lang.messageevent_messagedeleted.replace('%author', msg.author);
						msg.channel.send(messagedeleted);
					}
				}
			}
		}
}
	} else {
		const input = msg.content.split(' ').slice();
		if (tableload.chatfilter.chatfilter === 'true' && tableload.chatfilter.array.length !== 0) {
			for (var i = 0; i < tableload.chatfilter.array.length; i++) {
				for (let index = 0; index < input.length; index++) {
					if (input[index].toLowerCase() === tableload.chatfilter.array[i].toLowerCase()) {
						if (tableload.chatfilterlog === 'true') {
							const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', msg.author.tag);
						
							const embed = new Discord.RichEmbed()
							.addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
							.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
							.addField(`📥 ${lang.messagereactionaddevent_message}:`, msg.cleanContent)
							.setColor('#FF0000')
							.setAuthor(chatfilterembed);
						
							try {
								await msg.guild.channels.get(tableload.chatfilterlogchannel).send({ embed });
							} catch (error) {
								return undefined;
							}
						}
						await msg.delete();
		
						const messagedeleted = lang.messageevent_messagedeleted.replace('%author', msg.author);
						msg.channel.send(messagedeleted);
					}
				}
			}
		}
	}
};
