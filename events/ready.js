exports.run = async client => {
	client.guildconfs.defer.then(() => {
		// all data is loaded now.
		console.log(client.guildconfs.size + "keys loaded");
	});
	client.starboard.defer.then(() => {
		// all data is loaded now.
		console.log(client.starboard.size + "keys loaded");
	});
	client.botconfs.defer.then(() => {
		// all data is loaded now.
		console.log(client.botconfs.size + "keys loaded");
	});
	client.wait(20000);
	const defaultSettings = {
		prefix: '?',
		modlog: 'false',
		modlogchannel: '',
		messagedellog: 'false',
		messagedellogchannel: '',
		messageupdatelog: 'false',
		messageupdatelogchannel: '',
		channelupdatelog: 'false',
		channelupdatelogchannel: '',
		channelcreatelog: 'false',
		channelcreatelogchannel: '',
		channeldeletelog: 'false',
		channeldeletelogchannel: '',
		guildmemberupdatelog: 'false',
		guildmemberupdatelogchannel: '',
		presenceupdatelog: 'false',
		presenceupdatelogchannel: '',
		welcomelog: 'false',
		welcomelogchannel: '',
		guildupdatelog: '',
		guildupdatelogchannel: '',
		byelog: 'false',
		byelogchannel: '',
		rolecreatelog: 'false',
		rolecreatelogchannel: '',
		roledeletelog: 'false',
		roledeletelogchannel: '',
		roleupdatelog: 'false',
		roleupdatelogchannel: '',
		welcome: 'false',
		welcomechannel: '',
		welcomemsg: '',
		bye: 'false',
		byechannel: '',
		byemsg: '',
		commanddel: 'false',
		announce: 'false',
		announcechannel: '',
		selfassignableroles: [],
		minigames: 'false',
		modules: {
			fun: 'true',
			help: 'true',
			moderation: 'true',
			music: 'true',
			nsfw: 'true',
			searches: 'true',
			utility: 'true'
		},
		nicknamelog: [],
		warnlog: []
	};

	const botconfsdefault = {
		blacklist: [],
		banlist: []
	};

	const botconfs = {
		activity: false,
		activitychannel: ''
	};
	
	console.log(`LENXOBOT: Ready to serve in ${client.channels.size} channels on ${client.guilds.size}, for a total of ${client.users.size} users.`);
	await client.user.setPresence({ game: { name: `?help in ${client.guilds.size} guilds`, type: 0 } });
	await client.guilds.filter(g => !client.guildconfs.has(g.id)).forEach(g => client.guildconfs.set(g.id, defaultSettings));
	await client.channels.filter(ch => ch.type === 'text' && ch.permissionsFor(client.user).has('READ_MESSAGES')).map(ch => ch.fetchMessages({ limit: 100 }));
	if (!client.botconfs.has('blackbanlist')) client.botconfs.set('blackbanlist', botconfsdefault);
	if (!client.botconfs.has('botconfs')) client.botconfs.set('botconfs', botconfs);

	const snekfetch = require('snekfetch');
	snekfetch.post(`https://discordbots.org/api/bots/stats`)
	  .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1NDcxMjMzMzg1MzEzMDc1MiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTA5NjU3MTkzfQ.dDleV67s0ESxSVUxKxeQ8W_z6n9YwrDrF9ObU2MKgVE')
	  .send({ server_count: client.guilds.size })
	  .then(() => console.log('Updated discordbots.org stats.'))
	 .catch(err => console.error(`Whoops something went wrong: ${err.body}`));
};
