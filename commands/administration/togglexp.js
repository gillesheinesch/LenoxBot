const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const validation = ['list', 'add', 'remove'];
	const tableload = client.guildconfs.get(msg.guild.id);
	const margs = msg.content.split(' ');
	const input = args.slice();
	let channel;

	if (!input || input.length === 0) return msg.reply(lang.togglexp_noinput);

	for (let i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'add') {
				try {
					channel = msg.guild.channels.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
					if (channel === null) throw new Error('undefined');
				} catch (error) {
					return msg.channel.send(lang.togglexp_notexist);
				}
				if (channel.type !== 'text') return msg.reply(lang.togglexp_notextchannel);

				if (tableload.togglexp.channelids.length !== 0) {
					for (let index = 0; index < tableload.togglexp.channelids.length; index++) {
						if (tableload.togglexp.channelids[index] === channel.id) return msg.reply(lang.togglexp_alreadyadd);
					}
				}
				tableload.togglexp.channelids.push(channel.id);
				client.guildconfs.set(msg.guild.id, tableload);

				const add = lang.togglexp_add.replace('%channelname', channel.name);
				return msg.reply(add);
			} else if (margs[1].toLowerCase() === 'remove') {
				if (tableload.togglexp.channelids.length === 0) return msg.reply(lang.togglexp_nochannel);

				let channel2;
				try {
					channel2 = msg.guild.channels.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
					if (channel2 === null) throw new Error('undefined');
				} catch (error) {
					return msg.channel.send(lang.togglexp_notexist);
				}
				if (channel2.type !== 'text') return msg.reply(lang.togglexp_notextchannel);

				for (let index2 = 0; index2 < tableload.togglexp.channelids.length; index2++) {
					if (channel2.id === tableload.togglexp.channelids[index2]) {
						tableload.togglexp.channelids.splice(index2, 1);
						client.guildconfs.set(msg.guild.id, tableload);

						const remove = lang.togglexp_remove.replace('%channelname', channel2.name);
						return msg.reply(remove);
					}
				}
				return msg.reply(lang.togglexp_notinthelist);
			} else if (margs[1].toLowerCase() === 'list') {
				if (tableload.togglexp.channelids.length === 0) return msg.reply(lang.togglexp_nochannel);

				const array = [];

				for (let index3 = 0; index3 < tableload.togglexp.channelids.length; index3++) {
					try {
						const channelname = msg.guild.channels.get(tableload.togglexp.channelids[index3]).name;
						array.push(`${channelname} (${tableload.togglexp.channelids[index3]})`);
					} catch (error) {
						tableload.togglexp.channelids.splice(index3, 1);
						client.guildconfs.set(msg.guild.id, tableload);
					}
				}
				const embed = new Discord.RichEmbed()
					.setColor('#ff9933')
					.setDescription(array.join('\n'))
					.setAuthor(lang.togglexp_embed);

				return msg.channel.send({
					embed
				});
			}
		}
	}
	return msg.reply(lang.togglexp_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'XP',
	aliases: [],
	userpermissions: ['MANAGE_GUILD'],
	dashboardsettings: true
};
exports.help = {
	name: 'togglexp',
	description: 'Add channels in which you can not win XP',
	usage: 'togglexp {add/remove/list} [channelname]',
	example: ['togglexp add spam', 'togglexp remove spam', 'togglexp list'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
