exports.run = async client => {
	const Discord = require('discord.js');

	client.guildconfs.defer.then(() => {
		console.log(client.guildconfs.size + "keys loaded for all discord servers");
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

	const marketconfs = {
		crate: ['📁', '14', '12'],
		cratekey: ['🔑', '75', '68'],
		pickaxe: ['⛏', '70', '62'],
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
		clock: ['⏰', '15', '13'],
		inventoryslotticket: ['📩', '200', '180'],
		rose: ['🌹', '10', '8'],
		umbrella: ['☂', '30', '27'],
		hamburger: ['🍔', '45', '40'],
		croissant: ['🥐', '9', '8'],
		basketball: ['🏀', '50', '45'],
		watch: ['⌚', '190', '171'],
		projector: ['📽', '623', '560'],
		flashlight: ['🔦', '80', '72'],
		bed: ['🛏', '236', '212'],
		hammer: ['🔨', '50', '45'],
		book: ['📖', '11', '10'],
		mag: ['🔍', '12', '10'],
		banana: ['🍌', '4', '3'],
		tractor: ['🚜', '15000', '13500'],
		syringe: ['💉', '132', '119'],
		gun: ['🔫', '674', '608'],
		knife: ['🔪', '87', '78']
	};

	const defaultuserdbsettings = {
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
			clock: 0,
			rose: 0,
			umbrella: 0,
			hamburger: 0,
			croissant: 0,
			basketball: 0,
			watch: 0,
			projector: 0,
			flashlight: 0,
			bed: 0,
			hammer: 0,
			book: 0,
			mag: 0,
			banana: 0,
			inventoryslotticket: 0,
			tractor: 0,
			syringe: 0,
			gun: 0,
			knife: 0
		},
		inventoryslots: 30,
		premium: {
			status: false,
			bought: [],
			end: ''
		}
	};

	const botconfspremium = {};

	console.log(`LENXOBOT: Ready to serve in ${client.channels.size} channels on ${client.guilds.size}, for a total of ${client.users.size} users.`);

		client.user.setPresence({
			game: {
				name: `?help | www.lenoxbot.com`,
				type: 0
			}
		});

	await client.guilds.filter(g => !client.guildconfs.has(g.id)).forEach(g => client.guildconfs.set(g.id, defaultSettings));
	await client.users.filter(g => !client.userdb.has(g.id)).forEach(g => client.userdb.set(g.id, defaultuserdbsettings));

    await client.users.filter(u => !client.redeem.has(u.id)).forEach(u => client.redeem.set(u.id, redeemconfs));

	await client.users.filter(u => client.userdb.get(u.id) ? client.userdb.get(u.id).jobstatus === true : undefined).forEach(u => {
		client.users.get(u.id).send('We are very sorry, but we have to tell you that your job has just been canceled due to a bot restart!');
		const userdb = client.userdb.get(u.id);
		userdb.jobstatus = false;
		client.userdb.set(u.id, userdb);
	});

	await client.channels.filter(ch => ch.type === 'text' && ch.permissionsFor(client.user).has('READ_MESSAGES')).map(ch => ch.fetchMessages({
		limit: 100
	}));

	if (!client.botconfs.has('blackbanlist')) client.botconfs.set('blackbanlist', botconfsdefault);
	if (!client.botconfs.has('botconfs')) client.botconfs.set('botconfs', botconfs);
	await client.botconfs.set('market', marketconfs);
	if (!client.botconfs.has('premium')) client.botconfs.set('premium', botconfspremium);

	await client.botconfs.set('botstats', {
		botguildscount: client.guilds.size,
		botmemberscount: client.users.size
	});

	const embed = new Discord.RichEmbed()
		.setTitle('Botrestart')
		.setDescription('The bot had a restart and is back again!\nEveryone can now execute commands!')
		.setColor('#99ff66')
		.setAuthor(client.user.tag, client.user.displayAvatarURL);

	if (client.user.id === '354712333853130752') {
		await client.channels.get('413750421341863936').send({
			embed
		});
	}

	if (client.user.id === '354712333853130752') {
		setInterval(() => {
			client.dbl.postStats(client.guilds.size);
		}, 1800000);
	}

	setInterval(() => {
		client.guilds.filter(g => client.guilds.has(g.id)).forEach(g => {
			const tableload = client.guildconfs.get(g.id);
			if (tableload.premium) {
				if (client.guildconfs.get(g.id).premium.status === true) {
					if (new Date().getTime() >= Date.parse(tableload.premium.end)) {
						tableload.premium.status = false;
						tableload.premium.bought = [];
						tableload.premium.end = '';
						client.guildconfs.set(g.id, tableload);
					}
				}
			}
		});
	}, 86400000);

	setInterval(() => {
		client.users.filter(g => client.userdb.has(g.id)).forEach(g => {
			const userdb = client.userdb.get(g.id);
			if (userdb.premium) {
				if (client.userdb.get(g.id).premium.status === true) {
					if (new Date().getTime() >= Date.parse(userdb.premium.end)) {
						userdb.premium.status = false;
						userdb.premium.bought = [];
						userdb.premium.end = '';
						client.userdb.set(g.id, userdb);
					}
				}
			}
		});
	}, 86400000);
};