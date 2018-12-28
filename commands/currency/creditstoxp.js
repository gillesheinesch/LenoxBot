const LenoxCommand = require('../LenoxCommand.js');

module.exports = class creditstoxpCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'credits',
			group: 'currency',
			memberName: 'credits',
			description: 'Shows you the credits of you or another user',
			format: 'credits [@USER]',
			aliases: ['balance', 'c'],
			examples: ['credits', 'credits @Monkeyyy11#7584'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'Credits',
			dashboardsettings: false
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const creditsAmount = args.slice(0, 1);

		if (isNaN(creditsAmount)) return msg.reply(lang.creditstoxp_nan);
		if (Number(creditsAmount) <= 0) return msg.reply(lang.creditstoxp_under1);

		const creditsTableOfTheUser = msg.client.provider.getUser(msg.author.id, 'credits');
		if (creditsTableOfTheUser < parseInt(creditsAmount, 10)) return msg.channel.send(lang.creditstoxp_nocredits);

		let newCreditsCount = msg.client.provider.getUser(msg.author.id, 'credits');
		newCreditsCount -= parseInt(creditsAmount, 10);

		await msg.client.provider.setUser(msg.author.id, 'credits', newCreditsCount);

		/* await sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${msg.author.id}"`).then(row => {
			if (row) {
				const curLevel = Math.floor(0.3 * Math.sqrt(row.points + Math.round(parseInt(creditsAmount, 10) / 2)));
				if (curLevel > row.level) {
					row.level = curLevel;
					sql.run(`UPDATE scores SET points = ${row.points + Math.round(parseInt(creditsAmount, 10) / 2)}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);

					if (tableload.xpmessages === 'true') {
						const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', row.level);
						msg.channel.send(levelup);
					}
				}
				sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId = "${msg.author.id}"`).then(row2 => {
					for (let i = 1; i < tableload.ara.length; i += 2) {
						if (tableload.ara[i] < row2.points && !msg.member.roles.get(tableload.ara[i - 1])) {
							const role = msg.guild.roles.get(tableload.ara[i - 1]);
							msg.member.addRole(role);

							const automaticrolegotten = lang.messageevent_automaticrolegotten.replace('%rolename', role.name);
							msg.channel.send(automaticrolegotten);
						}
					}
				});
				sql.run(`UPDATE scores SET points = ${row.points + Math.round(parseInt(creditsAmount, 10) / 2)} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);
			} else {
				sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, msg.author.id, Math.round(parseInt(creditsAmount, 10) / 2), 0]);
			}
		}).catch(() => {
			sql.run('CREATE TABLE IF NOT EXISTS scores (guildid TEXT, userId TEXT, points INTEGER, level INTEGER)').then(() => {
				sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, msg.author.id, Math.round(parseInt(creditsAmount, 10) / 2), 0]);
			});
        });
        */

		const done = lang.creditstoxp_done.replace('%credits', `**${creditsAmount}**`).replace('%xp', `**${Math.round(parseInt(creditsAmount, 10) / 2)}**`);
		return msg.reply(done);
	}
};
