const Discord = require('discord.js');
exports.run = async (client, oldMember, newMember) => {
	const tableconfig = client.guildconfs.get(newMember.guild.id);

	if (tableconfig.language === '') {
		tableconfig.language = 'en';
		client.guildconfs.set(newMember.guild.id, tableconfig);
	}

	var lang = require(`../languages/${tableconfig.language}.json`);

	if (oldMember.nickname !== newMember.nickname) {
		if (!tableconfig.nicknamelog) {
			tableconfig.nicknamelog = [];
			await client.guildconfs.set(newMember.guild.id, tableconfig);
		}

		tableconfig.nicknamelog.push(newMember.id);
		tableconfig.nicknamelog.push(oldMember.nickname === null ? lang.guildmemberupdateevent_nonickname : oldMember.nickname);
		tableconfig.nicknamelog.push(newMember.nickname === null ? lang.guildmemberupdateevent_nonickname : newMember.nickname);
		tableconfig.nicknamelog.push(new Date().getTime());
		await client.guildconfs.set(newMember.id, tableconfig);
	}

	/*
	if (oldMember.roles.size < newMember.roles.size && oldMember.guild.id === '352896116812939264') {
		for (const role of newMember.roles.map(x => x.id)) {
			if (!oldMember.roles.has(role)) {
				if (oldMember.guild.roles.get(role).name.toLowerCase() === 'patreon') {
					const botconfspremiumload = await client.botconfs.get('premium');
					botconfspremiumload.keys.numberofuserkeys = botconfspremiumload.keys.numberofuserkeys + 1;
					await client.botconfs.set('premium', botconfspremiumload);
					oldMember.send(`Hey, \n\nWe thank you very much for your donation! \nAs a little thank you, you now get the promised Premium Key: \`${botconfspremiumload.keys.numberofuserkeys}\` \nYou can use this premium userkey with \`?useractivatekey {key}\`\n\nIf you have donated more than a dollar, please contact Monkeyyy11#0001 and you will get the remaining keys! \n\nThank you again! \n-LenoxBot Team`);

					const embed = new Discord.RichEmbed()
						.setDescription(`This user got a premium userkey (Code: ${botconfspremiumload.keys.numberofuserkeys})!`)
						.setAuthor(oldMember.user.tag, oldMember.user.displayAvatarURL)
						.setTimestamp()
						.setColor('#66ff33')
						.setTitle('New Userkey created!');
					await client.channels.get('419877966265319424').send({
						embed
					});
				}
			}
		}
	}
	*/

	if (tableconfig.guildmemberupdatelog === 'false') return;

	const messagechannel = client.channels.get(tableconfig.guildmemberupdatelogchannel);

	if (oldMember.nickname !== newMember.nickname) {
		const embed = new Discord.RichEmbed()
			.setColor('#FE2E2E')
			.setTimestamp()
			.setAuthor(lang.guildmemberupdateevent_nicknamechanged)
			.addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`)
			.addField(`📤${lang.guildmemberupdateevent_oldnickname}`, oldMember.nickname === null ? lang.guildmemberupdateevent_membernonickname : oldMember.nickname)
			.addField(`📥 ${lang.guildmemberupdateevent_newnickname}`, newMember.nickname === null ? lang.guildmemberupdateevent_nicknamereset : newMember.nickname);
		messagechannel.send({
			embed: embed
		});
	}


	if (oldMember.roles.size < newMember.roles.size) {
		const embed = new Discord.RichEmbed()
			.setColor('#FE2E2E')
			.setTimestamp()
			.setAuthor(lang.guildmemberupdateevent_roleassigned)
			.addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`);
		for (const role of newMember.roles.map(x => x.id)) {
			if (!oldMember.roles.has(role)) {
				embed.addField(`📥 ${lang.guildmemberupdateevent_role}`, `${oldMember.guild.roles.get(role).name}`);
			}
		}
		messagechannel.send({
			embed
		});
	}

	if (oldMember.roles.size > newMember.roles.size) {
		const embed = new Discord.RichEmbed()
			.setColor('#FE2E2E')
			.setTimestamp()
			.setAuthor(lang.guildmemberupdateevent_roleremoved)
			.addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`);
		for (const role of oldMember.roles.map(x => x.id)) {
			if (!newMember.roles.has(role)) {
				embed.addField(`📥 ${lang.guildmemberupdateevent_role}`, `${oldMember.guild.roles.get(role).name}`);
			}
		}
		messagechannel.send({
			embed
		});
	}
};