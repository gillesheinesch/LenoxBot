exports.run = async client => {
	client.guildconfs.defer.then(() => {
		console.log(client.guildconfs.size + "keys loaded for all discord servers");
	});
	client.starboard.defer.then(() => {
		console.log(client.starboard.size + "keys loaded for all starboard messages");
	});
	client.botconfs.defer.then(() => {
		console.log(client.botconfs.size + "keys loaded for all bot configs");
	});
	client.redeem.defer.then(() => {
		console.log(client.redeem.size + "keys loaded for all redeem keys");
	});
	client.userdb.defer.then(() => {
		console.log(client.userdb.size + "keys loaded for all user keys");
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
			utility: 'true',
			application: 'true'
		},
		application: {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: '',
			status: 'false'
		},
		nicknamelog: [],
		warnlog: [],
		language: 'en'
	};

	const botconfsdefault = {
		blacklist: [],
		banlist: []
	};

	const botconfs = {
		activity: false,
		activitychannel: ''
	};

	const redeemconfs = {
		redeemkey: '',
		redeemed: '',
		redeemkeyowner: ''
	};

	var array = [];
	const alluserslist = await client.users.forEach(r => array.push(r.id));
	const upvoteconfs = { allusers: array };

	const userconfs = {
		inventory: {
			crate: 0,
			cratekey: 0,
			pickaxe: 0,
			joystick: 0,
			house: 0,
			bag: 0,
			diamond: 0,
			dog: 0,
			cat: 0,
			apple: 0,
			football: 0,
			car: 0,
			phone: 0,
			computer: 0,
			camera: 0,
			clock: 0
		},
		description: ''
	};

	const marketconfs = {
		crate: ['📁', '8', '7'],
		cratekey: ['🔑', '75', '68'],
		pickaxe: ['⛏', '100', '90'],
		joystick: ['🕹', '60', '54'],
		house: ['🏠', '10000', '9000'],
		bag: ['👜', '15', '13'],
		diamond: ['💠', '2000', '1800'],
		dog: ['🐶', '25', '23'],
		cat: ['🐱', '25', '23'],
		apple: ['🍎', '5', '4'],
		football: ['⚽', '10', '9'],
		car: ['🚙', '6000', '5400'],
		phone: ['📱', '400', '360'],
		computer: ['💻', '1000', '900'],
		camera: ['📷', '600', '540'],
		clock: ['⏰', '15', '13']
	};

	console.log(`LENXOBOT: Ready to serve in ${client.channels.size} channels on ${client.guilds.size}, for a total of ${client.users.size} users.`);
	await client.user.setPresence({
		game: {
			name: `?help in ${client.guilds.size} guilds`,
			type: 0
		}
	});
	await client.guilds.filter(g => !client.guildconfs.has(g.id)).forEach(g => client.guildconfs.set(g.id, defaultSettings));

	await client.users.filter(u => !client.redeem.has(u.id)).forEach(u => client.redeem.set(u.id, redeemconfs));

	await client.users.filter(u => !client.userdb.has(u.id)).forEach(u => client.userdb.set(u.id, userconfs));

	await client.channels.filter(ch => ch.type === 'text' && ch.permissionsFor(client.user).has('READ_MESSAGES')).map(ch => ch.fetchMessages({
		limit: 100
	}));

	if (!client.botconfs.has('blackbanlist')) client.botconfs.set('blackbanlist', botconfsdefault);
	if (!client.botconfs.has('botconfs')) client.botconfs.set('botconfs', botconfs);
	if (!client.botconfs.has('market')) client.botconfs.set('market', marketconfs);
	if (!client.botconfs.has('upvote')) client.botconfs.set('upvote', upvoteconfs);

	if (client.user.id === '354712333853130752') {
		setInterval(() => {
			dbl.postStats(client.guilds.size);
		}, 1800000);
	}
};