const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const d = Math.random();
	const userdb = client.userdb.get(msg.author.id);

	if (userdb.inventory.pickaxe === 0) {
		const timestamps = client.cooldowns.get('mine');
		delete timestamps[msg.author.id];
		client.cooldowns.set('mine', timestamps);
		return msg.reply(lang.mine_nopicks);
	}

	if (d < 0.05) {
		const validationfor10procent = ['764', '983', '848'];
		const result = Math.floor(Math.random() * validationfor10procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + parseInt(validationfor10procent[result], 10)} WHERE userId = ${msg.author.id}`);
		});

		userdb.inventory.pickaxe -= 1;
		client.userdb.set(msg.author.id, userdb);

		const dugup = lang.mine_dugup.replace('%amount', `**${validationfor10procent[result]}**`);
		const embed = new Discord.RichEmbed()
			.setColor('#66ff33')
			.setDescription(dugup);
		return msg.channel.send({ embed });
	} else if (d < 0.1) {
		const validationfor30procent = ['439', '323', '356'];
		const result = Math.floor(Math.random() * validationfor30procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + parseInt(validationfor30procent[result], 10)} WHERE userId = ${msg.author.id}`);
		});

		userdb.inventory.pickaxe -= 1;
		client.userdb.set(msg.author.id, userdb);

		const dugup = lang.mine_dugup.replace('%amount', `**${validationfor30procent[result]}**`);

		const embed = new Discord.RichEmbed()
			.setColor('#66ff33')
			.setDescription(dugup);
		return msg.channel.send({ embed });
	} else if (d < 0.3) {
		const validationfor50procent = ['201', '178', '238', '199', '168', '101', '130', '135', '176'];
		const result = Math.floor(Math.random() * validationfor50procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + parseInt(validationfor50procent[result], 10)} WHERE userId = ${msg.author.id}`);
		});

		userdb.inventory.pickaxe -= 1;
		client.userdb.set(msg.author.id, userdb);

		const dugup = lang.mine_dugup.replace('%amount', `**${validationfor50procent[result]}**`);
		const embed = new Discord.RichEmbed()
			.setColor('#66ff33')
			.setDescription(dugup);
		return msg.channel.send({ embed });
	}
	const validationforrest = ['2', '98', '32', '72', '91', '85', '7', '15', '20', '28', '37'];
	const result = Math.floor(Math.random() * validationforrest.length);

	sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		}
		sql.run(`UPDATE medals SET medals = ${row.medals + parseInt(validationforrest[result], 10)} WHERE userId = ${msg.author.id}`);
	});

	userdb.inventory.pickaxe -= 1;
	client.userdb.set(msg.author.id, userdb);

	const dugup = lang.mine_dugup.replace('%amount', `**${validationforrest[result]}**`);
	const embed = new Discord.RichEmbed()
		.setColor('#66ff33')
		.setDescription(dugup);
	return msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Games',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true,
	cooldown: 180000
};
exports.help = {
	name: 'mine',
	description: 'With this command you can dig up minerals with your pickaxes',
	usage: 'mine',
	example: ['mine'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
