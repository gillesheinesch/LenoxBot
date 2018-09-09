const Discord = require('discord.js');
const moment = require('moment');
const sql = require('sqlite');
sql.open('../lenoxbotscore.sqlite');
require('moment-duration-format');
exports.run = async (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	const now = new Date().getTime();
	const margs = msg.content.split(' ');
	const validation = ['creditsevent', 'extracreditsevent', 'birthdaybadge'];
	const tableload = await client.guildconfs.get(msg.guild.id);

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == 'creditsevent') {
				var normalevent = [];

				const creditseventembeddescription = lang.startevent_creditseventembeddescription.replace('%prefix', tableload.prefix);
				const endsdate = lang.startevent_endsdate.replace('%date', new Date(now + 86400000));
				const embed = new Discord.RichEmbed()
					.setDescription(creditseventembeddescription)
					.setColor('#ff5050')
					.setFooter(endsdate)
					.setAuthor(lang.startevent_creditseventembedauthor);

				const message = await msg.channel.send({
					embed
				});

				await message.react('✅');

				const normaleventcollector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '✅' && !user.bot, {
					time: 86400000
				});
				normaleventcollector.on('collect', r => {
					if (!normalevent.includes(r.users.last().id)) {
						normalevent.push(r.users.last().id);

						sql.get(`SELECT * FROM medals WHERE userId ="${r.users.last().id}"`).then(row => {
							if (!row) {
								sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [r.users.last().id, 0]);
							}
							sql.run(`UPDATE medals SET medals = ${row.medals + 100} WHERE userId = ${r.users.last().id}`);
						}).catch(error => {
							console.error(error);
							sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
								sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [r.users.last().id, 0]);
							});
						});
					}
				});
				normaleventcollector.on('end', (collected, reason) => {
					message.delete();
				});
			} else if (margs[1].toLowerCase() == 'extracreditsevent') {
				var extramedalevent = [];

				const extracreditseventembeddescription = lang.startevent_extracreditseventembeddescription.replace('%prefix', tableload.prefix);
				const endsdate = lang.startevent_endsdate.replace('%date', new Date(now + 86400000));
				const embed = new Discord.RichEmbed()
					.setDescription(extracreditseventembeddescription)
					.setColor('#ff5050')
					.setFooter(endsdate)
					.setAuthor(lang.startevent_extracreditseventembedauthor);

				const message = await msg.channel.send({
					embed
				});

				await message.react('✅');

				const extramedaleventcollector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '✅' && !user.bot, {
					time: 86400000
				});
				extramedaleventcollector.on('collect', r => {
					if (!extramedalevent.includes(r.users.last().id)) {
						extramedalevent.push(r.users.last().id);

						sql.get(`SELECT * FROM medals WHERE userId ="${r.users.last().id}"`).then(row => {
							if (!row) {
								sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [r.users.last().id, 0]);
							}
							sql.run(`UPDATE medals SET medals = ${row.medals + 500} WHERE userId = ${r.users.last().id}`);
						}).catch(error => {
							console.error(error);
							sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
								sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [r.users.last().id, 0]);
							});
						});
					}
				});
				extramedaleventcollector.on('end', (collected, reason) => {
					message.delete();
				});
			} else if (margs[1].toLowerCase() == 'birthdaybadge') {
				var eventArray = [];

				const endsdate = lang.startevent_endsdate.replace('%date', new Date(now + 86400000));
				const embed = new Discord.RichEmbed()
					.setDescription(lang.startevent_birthdaybadgeembeddescription)
					.setColor('#ff5050')
					.setFooter(lang.endsdate)
					.setAuthor(lang.startevent_birthdaybadgeembedauthor);

				const message = await msg.channel.send({
					embed
				});

				await message.react('🎈');

				const birthdaybadgecollector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '🎈' && !user.bot, {
					time: 86400000
				});
				birthdaybadgecollector.on('collect', async r => {
					if (!eventArray.includes(r.users.last().id)) {
						eventArray.push(r.users.last().id);

						const userdb = await client.userdb.get(r.users.last().id);

						if (!userdb.badges) {
							userdb.badges = [];
							await client.userdb.set(r.users.last().id, userdb);
						}

						const badgeSettings = {
							name: 'Birthday2018',
							rarity: 1,
							staff: false,
							date: Date.now()
						};

						for (let index = 0; index < userdb.badges.length; index++) {
							if (userdb.badges[index].name.toLowerCase() === 'birthday2018') return undefined;
						}

						client.users.get(r.users.last().id).send(lang.startevent_birthdaybadgemessage);

						userdb.badges.push(badgeSettings);
						await client.userdb.set(r.users.last().id, userdb);
					}
				});
				birthdaybadgecollector.on('end', (collected, reason) => {
					message.delete();
				});
			}
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'startevent',
	description: 'Starts a special bot event',
	usage: 'startevent {birthdaybadge, creditsevent, extracreditsevent}',
	example: ['startevent birthdaybadge', 'startevent creditsevent', 'startevent extracreditsevent'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
