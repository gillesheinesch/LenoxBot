exports.run = async client => {
	const Discord = require('discord.js');
	const chalk = require('chalk');

	client.guildconfs.defer.then(() => {
		console.log(chalk.red(client.guildconfs.size + "keys loaded for all discord servers"));
	});
	client.botconfs.defer.then(() => {
		console.log(chalk.red(client.botconfs.size + "keys loaded for all bot configs"));
	});
	client.redeem.defer.then(() => {
		console.log(chalk.red(client.redeem.size + "keys loaded for all redeem keys"));
	});
	client.userdb.defer.then(() => {
		console.log(chalk.red(client.userdb.size + "keys loaded for all user keys"));
	});

	const botconfsdefault = {
		blacklist: [],
		banlist: []
	};

	const botconfs = {
		activity: false,
		activitychannel: '',
		tickets: {},
		ticketid: 0
	};

	const redeemconfs = {
		redeemkey: '',
		redeemed: '',
		redeemkeyowner: ''
	};

	const marketconfs = {
		crate: ['📁', '14', '12', '14', '12'],
		cratekey: ['🔑', '75', '68', '75', '68'],
		pickaxe: ['⛏', '70', '62', '70', '62'],
		joystick: ['🕹', '60', '54', '60', '54'],
		house: ['🏠', '10000', '9000', '10000', '9000'],
		bag: ['👜', '15', '13', '15', '13'],
		diamond: ['💠', '2000', '1800', '2000', '1800'],
		dog: ['🐶', '25', '23', '25', '23'],
		cat: ['🐱', '25', '23', '25', '23'],
		apple: ['🍎', '5', '4', '5', '4'],
		football: ['⚽', '10', '9', '10', '9'],
		car: ['🚙', '6000', '5400', '6000', '5400'],
		phone: ['📱', '400', '360', '400', '360'],
		computer: ['💻', '1000', '900', '1000', '900'],
		camera: ['📷', '600', '540', '600', '540'],
		clock: ['⏰', '15', '13', '15', '13'],
		inventoryslotticket: ['📩', '200', '180', '200', '180'],
		rose: ['🌹', '10', '8', '10', '8'],
		umbrella: ['☂', '30', '27', '30', '27'],
		hamburger: ['🍔', '45', '40', '45', '40'],
		croissant: ['🥐', '9', '8', '9', '8'],
		basketball: ['🏀', '50', '45', '50', '45'],
		watch: ['⌚', '190', '171', '190', '171'],
		projector: ['📽', '623', '560', '623', '560'],
		flashlight: ['🔦', '80', '72', '80', '72'],
		bed: ['🛏', '236', '212', '236', '212'],
		hammer: ['🔨', '50', '45', '50', '45'],
		book: ['📖', '11', '10', '11', '10'],
		mag: ['🔍', '12', '10', '12', '10'],
		banana: ['🍌', '4', '3', '4', '3'],
		tractor: ['🚜', '15000', '13500', '15000', '13500'],
		syringe: ['💉', '132', '119', '132', '119'],
		gun: ['🔫', '674', '608', '674', '608'],
		knife: ['🔪', '87', '78', '87', '78']
	};

	const botconfspremium = {};

	client.user.setPresence({
		game: {
			name: `?help | www.lenoxbot.com`,
			type: 0
		}
	});

	await client.users.filter(u => !client.redeem.has(u.id)).forEach(u => client.redeem.set(u.id, redeemconfs));

	await client.users.filter(u => client.userdb.get(u.id) ? client.userdb.get(u.id).jobstatus === true : undefined).forEach(u => {
		client.users.get(u.id).send('We are very sorry, but we have to tell you that your job has just been canceled due to a bot restart!');
		const userdb = client.userdb.get(u.id);
		userdb.jobstatus = false;
		client.userdb.set(u.id, userdb);
	});

	if (!client.botconfs.has('blackbanlist')) client.botconfs.set('blackbanlist', botconfsdefault);
	if (!client.botconfs.has('botconfs')) client.botconfs.set('botconfs', botconfs);
	await client.botconfs.set('market', marketconfs);
	if (!client.botconfs.has('premium')) client.botconfs.set('premium', botconfspremium);

	setInterval(() => {
		client.botconfs.set('botstats', {
			botguildscount: client.guilds.size,
			botmemberscount: client.users.size,
			botmemberscountincrement: Math.floor(client.users.size / 170) + 1,
			botguildscountincrement: Math.floor(client.guilds.size / 170) + 1
		});
	}, 1800000);

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

	console.log(chalk.green(`LENXOBOT: Ready to serve in ${client.channels.size} channels on ${client.guilds.size}, for a total of ${client.users.size} users.`));
};
