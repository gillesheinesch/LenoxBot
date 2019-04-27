const Discord = require('discord.js');
const settings = require('./settings.json');
const chalk = require('chalk');
const moment = require('moment');
require('moment-duration-format');

const shardingManager = new Discord.ShardingManager('./lenoxbot.js',
	{
		token: settings.token
	});

shardingManager.spawn().then(() => {
	console.log(chalk.green(`[ShardManager] Started ${shardingManager.totalShards} shards`));
}).catch(error => {
	console.log(error);
});
// Website:
async function run() {
	const express = require('express');
	const session = require('express-session');
	const passport = require('passport');
	const Strategy = require('passport-discord').Strategy;
	const handlebars = require('express-handlebars');
	const handlebarshelpers = require('handlebars-helpers')();

	const app = express();
	const path = require('path');
	const cookieParser = require('cookie-parser');
	const bodyParser = require('body-parser');
	const url = require('url');
	const mongodb = require('mongodb');

	const mongoUrl = `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/?authMechanism=DEFAULT&authSource=admin`;
	const dbClient = await mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true });
	const db = dbClient.db('lenoxbot');
	const guildSettingsCollection = db.collection('guildSettings');
	const userSettingsCollection = db.collection('userSettings');
	const botSettingsCollection = db.collection('botSettings');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		limit: '50mb',
		extended: false
	}));
	app.use(cookieParser());

	app.engine('handlebars', handlebars({
		defaultLayout: 'main',
		layoutsDir: `${__dirname}/views/layouts/`,
		helpers: handlebarshelpers
	}));

	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'handlebars');

	app.use(express.static('public'));

	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});

	const scopes = ['identify', 'guilds'];

	passport.use(new Strategy({
		clientID: settings.clientID_Auth,
		clientSecret: settings.clientSecret_Auth,
		callbackURL: settings.callbackURL_Auth,
		scope: scopes
	}, ((accessToken, refreshToken, profile, done) => {
		process.nextTick(() => done(null, profile));
	})));

	app.use(session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/loginpressedbutton', passport.authenticate('discord', {
		scope: scopes
	}));

	app.get('/callback',
		passport.authenticate('discord', {
			failureRedirect: '/error'
		}),
		(req, res) => {
			res.redirect('/servers');
		});

	app.listen(settings.websiteport, err => {
		if (err) return console.log(err);
		console.log(chalk.green('Website running on https://lenoxbot.com'));
	});
	// Check all user guild where user are owner and lenoxbot is

	// Script executes function on shard
	/** Executes a reload on the shards for synchronization
		 * @argument type the type of reloadable element - "guild", "user" or "botsettings"
		 * @argument id the id of the reloadable element, only usable on "guild" and "user"
		 */

	function islenoxboton(req) {
		const islenoxbot = [];
		if (req.user) {
			for (let i = 0; i < req.user.guilds.length; i++) {
				if (((req.user.guilds[i].permissions) & 8) === 8 && req.user.guilds[i].lenoxbot === true) {
					islenoxbot.push(req.user.guilds[i]);
				}
			}
		}
		return islenoxbot;
	}

	// Check all user guilds where lenoxbot is
	async function islenoxbotonNonPermission(req) {
		const islenoxbotNonPerm = [];
		if (req.user) {
			for (let i = 0; i < req.user.guilds.length; i++) {
				let result;
				await shardingManager.broadcastEval(`this.guilds.get('${req.params.guildid}')`).then(guildArray => {
					result = guildArray.find(g => g);
				});

				if (result && typeof result !== 'undefined') {
					req.user.guilds[i].lenoxbot = true;
				} else {
					req.user.guilds[i].lenoxbot = false;
				}

				if (req.user.guilds[i].lenoxbot === true) {
					islenoxbotNonPerm.push(req.user.guilds[i]);
				}
			}
		}
		return islenoxbotNonPerm;
	}

	// findGuild function for broadcasteval
	function permissionsCheck(guildconfs, guild, req, res, index) {
		if (guildconfs.settings.dashboardpermissionroles.length !== 0 && guild.ownerID !== req.user.id) {
			let allwhitelistedrolesoftheuser = 0;

			for (let index2 = 0; index2 < guildconfs.settings.dashboardpermissionroles.length; index2++) {
				if (!guild.members.find(r => r.userID === req.user.id)) return res.redirect('/servers');
				if (!guild.members.find(r => r.userID === req.user.id).roles.has(guildconfs.settings.dashboardpermissionroles[index2])) {
					allwhitelistedrolesoftheuser += 1;
				}
			}
			if (allwhitelistedrolesoftheuser === guildconfs.settings.dashboardpermissionroles.length) {
				return res.redirect('/servers');
			}
		} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
			return res.redirect('/servers');
		}
	}

	async function reloadGuild(guild, dashboardid) {
		await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
        if (this.guilds.get("${dashboardid}")) {
        const x = await this.provider.reloadGuild("${dashboardid}");
        return x;
        }
    })();
`);
	}

	app.get('/', async (req, res) => {
		try {
			const check = [];
			if (req.user) {
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (((req.user.guilds[i].permissions) & 8) === 8) {
						check.push(req.user.guilds[i]);
					}
				}
			}

			const islenoxbot = islenoxboton(req);

			const botConfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

			return res.render('index', {
				user: req.user,
				guilds: check,
				islenoxbot: islenoxbot,
				botguildscount: botConfs.settings.botstats.botguildscount,
				botmemberscount: botConfs.settings.botstats.botmemberscount,
				botcommands: botConfs.settings.botstats.botcommands
			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/home', (req, res) => {
		try {
			return res.redirect(url.format({
				pathname: `/`
			}));
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	// Temp get for test dynamic pages in static mode

	app.get('/test', (req, res) => {
		try {
			const islenoxbot = islenoxboton(req);
			return res.render('aatest', {
				user: req.user,
				islenoxbot: islenoxbot
			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/invite', (req, res) => res.redirect('https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8'));

	app.get('/discord', (req, res) => res.redirect('https://discordapp.com/invite/jmZZQja'));

	app.get('/status', (req, res) => res.redirect('https://status.lenoxbot.com/'));

	app.get('/policy', (req, res) => {
		try {
			return res.render('policy', {
				user: req.user

			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dataprotection', (req, res) => {
		try {
			return res.render('dataprotection', {
				user: req.user

			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/blog', (req, res) => res.redirect('https://medium.com/lenoxbot'));

	app.get('/ban', (req, res) => res.redirect('https://goo.gl/forms/NKoVsl8y5wOePCYT2'));

	app.get('/apply', (req, res) => res.redirect('https://goo.gl/forms/jOyjxAheOHaDYyoF2'));

	app.get('/survey', (req, res) => res.redirect('https://goo.gl/forms/2sS8U9JoYjeWHFF83'));

	app.get('/logout', (req, res) => {
		try {
			req.logOut();
			return res.redirect('home');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/leaderboards', async (req, res) => {
		try {
			const islenoxbot = islenoxboton(req);
			const islenoxbotnp = await islenoxbotonNonPermission(req);

			const userData = {};
			userData.loaded = false;

			let userArray = [];
			const arrayofUsers = await userSettingsCollection.find().toArray();

			for (let i = 0; i < arrayofUsers.length; i++) {
				if (!isNaN(arrayofUsers[i].settings.credits)) {
					await shardingManager.shards.get(0).eval(`
					(async () => {
						await this.users.fetch("${arrayofUsers[i].userId}").then(user => {
							return user;
						}).catch(err => {
							return undefined;
						})
					})();
				`).then(userResult => {
						console.log(userResult);
						const userCreditsSettings = {
							userId: arrayofUsers[i].userId,
							user: userResult ? userResult : arrayofUsers[i].userId,
							credits: Number(arrayofUsers[i].settings.credits)
						};
						if (arrayofUsers[i].userId !== 'global') {
							userArray.push(userCreditsSettings);
						}
					});
				}
			}

			userArray = userArray.sort((a, b) => {
				if (a.credits < b.credits) {
					return 1;
				}
				if (a.credits > b.credits) {
					return -1;
				}
				return 0;
			});

			for (let i = 0; i < userArray.length; i++) {
				await shardingManager.shards.get(0).eval(`
					(async () => {
						const user = await this.users.fetch("${arrayofUsers[i].userId}")
						if (user) return user;
					})();
				`).then(userResult => {
					if (userResult) {
						userArray[i].user = userResult;
					}
					if (req.user) {
						if (userArray[i].userId === req.user.id) {
							userData.place = i + 1;
							userData.credits = userArray[i].credits;
							userData.loaded = true;
						}
					}
				});
			}

			return res.render('leaderboard', {
				user: req.user,
				credits: userArray.slice(0, 100),
				userData: userData,
				islenoxbot: islenoxbot,
				islenoxbotnp: islenoxbotnp
			});
		} catch (error) {
			console.log(error);
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});
	/*

	app.get('/leaderboards/server/:id', async (req, res) => {
			try {
				const dashboardid = res.req.originalUrl.substr(21, 18);
				const userData = {};
				userData.loaded = false;

				const islenoxbot = islenoxboton(req);
				const islenoxbotnp = await islenoxbotonNonPermission(req);

				sql.open(`../${settings.sqlitefilename}.sqlite`);
				const scores = await sql.all(`SELECT * FROM scores WHERE guildId = "${dashboardid}" GROUP BY userId ORDER BY points DESC`);

				for (let i = 0; i < scores.length; i++) {
					if (client.users.get(scores[i].userId)) {
						scores[i].user = client.users.get(scores[i].userId);
					}
					if (req.user) {
						if (scores[i].userId === req.user.id) {
							userData.place = i + 1;
							userData.points = scores[i].points;
							userData.level = scores[i].level;
							userData.loaded = true;
						}
					}
				}

				return res.render('leaderboard-guild', {
					user: req.user,
					scores: scores.length === 0 ? null : scores.slice(0, 100),
					guild: client.guilds.get(dashboardid) ? client.guilds.get(dashboardid) : null,
					userData: userData,
					islenoxbot: islenoxbot,
					islenoxbotnp: islenoxbotnp
				});
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/profile/:id', async (req, res) => {
			try {
				const profileId = req.params.id;
				const userdb = await userSettingsCollection.findOne({ userId: profileId });
				const profileUser = await fetchUser(profileId);

				let isstaff = false;
				let ispremium = false;
				const teamroles = ['administrator', 'developer', 'moderator', 'test-moderator', 'documentation-proofreader', 'designer', 'translation-leader', 'translation-proofreader'];
				const guild = await shardingManager.broadcastEval(`client.guilds.get('352896116812939264')`);
				for (let i = 0; i < teamroles.length; i++) {
					const role = guild.roles.find(r => r.name.toLowerCase() === teamroles[i]);
					role.members.forEach(member => {
						if (member.user.id === profileId) {
							isstaff = true;
						}
					});
				}
				if (userdb.settings.premium.status) {
					ispremium = true;
				}
				if (!profileUser || !userdb) throw Error('User was not found!');

				if (!userdb.settings.description) {
					userdb.settings.description = 'No description 😢';
				}
				if (!userdb.settings.badges) {
					userdb.settings.badges = [];
				}

				let badges;
				if (userdb.settings.badges.length === 0) {
					badges = [];
				} else {
					const userBadges = userdb.settings.badges;
					badges = userBadges.sort((a, b) => {
						if (a.rarity < b.rarity) {
							return 1;
						}
						if (a.rarity > b.rarity) {
							return -1;
						}
						return 0;
					});
				}

				const badgesAndTitles = [];
				for (let i = 0; i < badges.length; i++) {
					const settingsForBadgesAndTitles = {
						emoji: badges[i].emoji,
						name: badges[i].name
					};
					badgesAndTitles.push(settingsForBadgesAndTitles);
				}

				const useridsArray = [];
				const userArray = [];
				const moneyArray = [];
				const tempArray = [];
				const globalrank = [];
				rows.forEach(row => {
					useridsArray.push(row.userId);
					const member = client.users.get(row.userId);
					userArray.push(member ? member.tag : row.userId);
					moneyArray.push(row.medals);
				});
				for (let i = 0; i < userArray.length; i++) {
					tempArray.push((i + 1));
				}

				for (let index = 0; index < userArray.length; index++) {
					if (useridsArray[index] === req.params.id) {
						globalrank.push(tempArray[index]);
					}
				}

				const rowCredits = userdb.settings.credits;

				const marketconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' }).settings.market;
				const lang = require('./languages/en-US.json');
				let check = 0;
				const array1 = [];
				// eslint-disable-next-line guard-for-in
				for (const i in userdb.settings.inventory) {
					if (userdb.settings.inventory[i] === 0) {
						check++;
					}
					if (userdb.settings.inventory[i] !== 0) {
						const itemSettings = {
							emoji: marketconfs[i][0],
							amount: userdb.settings.inventory[i],
							name: lang[`loot_${i}`]
						};
						array1.push(itemSettings);
					}
				}

				let socialmediaCheck = 0;
				for (const x in userdb.settings.socialmedia) {
					if (userdb.settings.socialmedia[x] === '') socialmediaCheck++;
				}
				const islenoxbot = islenoxboton(req);
				return res.render('profile', {
					user: req.user,
					profileUser: profileUser,
					userDescription: userdb.settings.description.length === 0 ? null : userdb.settings.description,
					badgesAndTitles: badgesAndTitles,
					userCredits: rowCredits.medals,
					// userCreditsGlobalRank: globalrank,
					inventoryItems: check === Object.keys(userdb.settings.inventory).length ? null : array1,
					userSocialmediaCheck: socialmediaCheck === Object.keys(userdb.settings.socialmedia).length ? null : true,
					userSocialmediaTwitch: userdb.settings.socialmedia.twitch === '' ? null : userdb.settings.socialmedia.twitch,
					userSocialmediaYoutube: userdb.settings.socialmedia.youtube === '' ? null : userdb.settings.socialmedia.youtube,
					userSocialmediaTwitter: userdb.settings.socialmedia.twitter === '' ? null : userdb.settings.socialmedia.twitter,
					userSocialmediaInstagram: userdb.settings.socialmedia.instagram === '' ? null : userdb.settings.socialmedia.instagram,
					userSocialmediaFacebook: userdb.settings.socialmedia.facebook === '' ? null : userdb.settings.socialmedia.facebook,
					userSocialmediaGithub: userdb.settings.socialmedia.github === '' ? null : userdb.settings.socialmedia.github,
					userSocialmediaPinterest: userdb.settings.socialmedia.pinterest === '' ? null : userdb.settings.socialmedia.pinterest,
					userSocialmediaReddit: userdb.settings.socialmedia.reddit === '' ? null : userdb.settings.socialmedia.reddit,
					isstaff: isstaff,
					ispremium: ispremium,
					islenoxbot: islenoxbot
				});
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		}); */

	app.get('/team', async (req, res) => {
		try {
			const islenoxbot = islenoxboton(req);
			const team = [];
			const teamroles = ['administrator', 'developer', 'moderator', 'test-moderator', 'documentation-proofreader', 'designer', 'translation-leader', 'translation-proofreader'];

			let guild;
			await shardingManager.broadcastEval(`this.guilds.get("352896116812939264")`)
				.then(guildArray => {
					guild = guildArray.find(g => g);
				});
			if (!guild) return res.redirect('/servers');

			const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("352896116812939264").members.array()`);
			guild.members = evaledMembers;

			const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("352896116812939264").roles.array()`);
			guild.roles = evaledRoles;

			const userAdded = [];
			for (let i = 0; i < teamroles.length; i++) {
				const teamSettings = {};
				const role = guild.roles.find(r => r.name.toLowerCase() === teamroles[i]);

				const evaledMembersFromRole = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("352896116812939264").roles.get("${role.id}").members.array()`);

				teamSettings.roleName = role.name;
				teamSettings.roleMembers = [];

				evaledMembersFromRole.forEach(async member => {
					const evaledUser = await shardingManager.shards.get(guild.shardID).eval(`
					(async () => {
						const user = await this.users.fetch("${member.userID}")
						if (user) return user;
					})();
				`);
					if (!userAdded.includes(member.userID)) {
						teamSettings.roleMembers.push(evaledUser);
						userAdded.push(member.userID);
					}
				});
				team.push(teamSettings);
			}

			return res.render('team', {
				user: req.user,
				team: team,
				islenoxbot: islenoxbot
			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/commands', async (req, res) => {
		try {
			const commandlist = await botSettingsCollection.findOne({ botconfs: 'botconfs' });
			const newcommandlist = [];
			// eslint-disable-next-line guard-for-in
			for (const key in commandlist.settings.commands) {
				newcommandlist.push(commandlist.settings.commands[key]);
			}

			const islenoxbot = islenoxboton(req);

			return res.render('commands', {
				user: req.user,
				islenoxbot: islenoxbot,
				commands: newcommandlist
			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/donate', (req, res) => {
		try {
			const check = [];
			if (req.user) {
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (((req.user.guilds[i].permissions) & 8) === 8) {
						check.push(req.user.guilds[i]);
					}
				}
			}
			const islenoxbot = islenoxboton(req);
			return res.render('donate', {
				user: req.user,
				guilds: check,
				islenoxbot: islenoxbot
			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/donationsuccess', (req, res) => {
		try {
			const islenoxbot = islenoxboton(req);
			return res.render('donationsuccess', {
				user: req.user,
				islenoxbot: islenoxbot
			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/documentation', (req, res) => res.redirect('https://docs.lenoxbot.com'));

	app.get('/nologin', (req, res) => {
		try {
			const check = [];
			if (req.user) {
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (((req.user.guilds[i].permissions) & 8) === 8) {
						check.push(req.user.guilds[i]);
					}
				}
			}

			return res.render('index', {
				notloggedin: true,
				user: req.user,
				guilds: check
			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/oauth2problem', (req, res) => {
		try {
			const check = [];
			if (req.user) {
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (((req.user.guilds[i].permissions) & 8) === 8) {
						req.user.guilds[i].lenoxbot = client.guilds.get(req.user.guilds[i].id) ? true : false;
						check.push(req.user.guilds[i]);
					}
				}
			}

			return res.render('oauth2problem', {
				user: req.user,
				guilds: check
			});
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/servers', async (req, res) => {
		try {
			if (req.user) {
				const check = [];

				for (let i = 0; i < req.user.guilds.length; i++) {
					const dashboardid = req.user.guilds[i].id;
					const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

					let guild;
					await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
						.then(guildArray => {
							guild = guildArray.find(g => g);
						});

					let evaledMembers;
					if (guild) {
						evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
						guild.members = evaledMembers;
					}


					if (guildconfs && guild) {
						if (!guildconfs.settings.dashboardpermissionroles) {
							guildconfs.settings.dashboardpermissionroles = [];
							await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
						}

						if (guildconfs.settings.dashboardpermissionroles.length !== 0 && guild.ownerID !== req.user.id) {
							let allwhitelistedrolesoftheuser = 0;

							for (let index2 = 0; index2 < guildconfs.settings.dashboardpermissionroles.length; index2++) {
								if (!guild.members.get(req.user.id)) return res.redirect('/servers');
								if (!guild.members.get(req.user.id).roles.has(guildconfs.settings.dashboardpermissionroles[index2])) {
									allwhitelistedrolesoftheuser += 1;
								}
							}
							if (allwhitelistedrolesoftheuser !== guildconfs.settings.dashboardpermissionroles.length) {
								req.user.guilds[i].lenoxbot = guild ? true : false;

								if (req.user.guilds[i].lenoxbot === true) {
									req.user.guilds[i].memberscount = guild.memberCount;
								}
								check.push(req.user.guilds[i]);
							}
						} else if (((req.user.guilds[i].permissions) & 8) === 8) {
							req.user.guilds[i].lenoxbot = guild ? true : false;

							if (req.user.guilds[i].lenoxbot === true) {
								req.user.guilds[i].memberscount = guild.memberCount;
							}

							check.push(req.user.guilds[i]);
						}
					} else if (((req.user.guilds[i].permissions) & 8) === 8) {
						req.user.guilds[i].lenoxbot = guild ? true : false;

						if (req.user.guilds[i].lenoxbot === true) {
							req.user.guilds[i].memberscount = guild.memberCount;
						}

						check.push(req.user.guilds[i]);
					}
				}
				const islenoxbot = islenoxboton(req);
				return res.render('servers', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot
				});
			}
			return res.redirect('nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});
	/*

		app.post('/tickets/:ticketid/submitticketanswer', (req, res) => {
			try {
				if (req.user) {
					const botconfs = client.botconfs.get('botconfs');
					if (botconfs.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');
					if (botconfs.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../error');

					const ticket = botconfs.tickets[req.params.ticketid];

					const length = Object.keys(ticket.answers).length + 1;

					req.body.newticketanswer = req.body.newticketanswer.replace(/(?:\r\n|\r|\n)/g, '<br>');

					ticket.answers[length] = {
						authorid: req.user.id,
						guildid: req.params.id,
						date: Date.now(),
						content: req.body.newticketanswer,
						timelineconf: ''
					};

					client.botconfs.set('botconfs', botconfs);

					if (client.guildconfs.get(ticket.guildid) && client.guildconfs.get(ticket.guildid).tickets.status === true) {
						const tableload = client.guildconfs.get(ticket.guildid);
						const lang = require(`./languages/${tableload.language}.json`);

						const ticketembedanswer = lang.mainfile_ticketembedanswer.replace('%ticketid', ticket.ticketid);
						const embed =
							.setURL(`https://lenoxbot.com/dashboard/${ticket.guildid}/tickets/${ticket.ticketid}/overview`)
							.setTimestamp()
							.setColor('#ccffff')
							.setTitle(lang.mainfile_ticketembedtitle)
							.setDescription(ticketembedanswer);

						try {
							client.channels.get(client.guildconfs.get(ticket.guildid).tickets.notificationchannel).send({
								embed
							});
						} catch (error) {
							'undefined';
						}
					}

					return res.redirect(url.format({
						pathname: `/tickets/${ticket.ticketid}/overview`,
						query: {
							submitticketanswer: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/tickets/:ticketid/submitnewticketstatus', (req, res) => {
			try {
				if (req.user) {
					const botconfs = client.botconfs.get('botconfs');
					if (botconfs.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');
					if (botconfs.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../error');
					if (botconfs.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');

					const ticket = botconfs.tickets[req.params.ticketid];

					if (ticket.status === req.body.newstatus) return res.redirect(`/tickets/${ticket.ticketid}/overview`);

					ticket.status = req.body.newstatus;

					const length = Object.keys(ticket.answers).length + 1;

					if (ticket.status === 'closed') {
						ticket.answers[length] = {
							authorid: req.user.id,
							guildid: req.params.id,
							date: Date.now(),
							content: `closed the ticket!`,
							timelineconf: '',
							toStatus: 'closed'
						};
					} else if (ticket.status === 'open') {
						ticket.answers[length] = {
							authorid: req.user.id,
							guildid: req.params.id,
							date: Date.now(),
							content: `opened the ticket!`,
							timelineconf: '',
							toStatus: 'open'
						};
					}

					client.botconfs.set('botconfs', botconfs);

					return res.redirect(url.format({
						pathname: `/tickets/${ticket.ticketid}/overview`,
						query: {
							submitnewticketstatus: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/tickets/:ticketid/overview', (req, res) => {
			try {
				if (req.user) {
					const botconfs = client.botconfs.get('botconfs');
					if (botconfs.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');
					if (botconfs.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../error');

					const ticket = botconfs.tickets[req.params.ticketid];

					botconfs.tickets[req.params.ticketid].newdate = moment(botconfs.tickets[req.params.ticketid].date).format('MMMM Do YYYY, h:mm:ss a');

					botconfs.tickets[req.params.ticketid].author = client.users.get(botconfs.tickets[req.params.ticketid].authorid).tag;

					for (const index in ticket.answers) {
						ticket.answers[index].author = client.users.get(ticket.answers[index].authorid) ? client.users.get(ticket.answers[index].authorid).tag : ticket.answers[index].authorid;
						ticket.answers[index].newdate = moment(ticket.answers[index].date).format('MMMM Do YYYY, h:mm:ss a');
					}
					const islenoxbot = islenoxboton(req);

					const sortableAnswers = [];
					for (const key in botconfs.tickets[req.params.ticketid].answers) {
						sortableAnswers.push(botconfs.tickets[req.params.ticketid].answers[key]);
					}

					let answers;
					if (Object.keys(botconfs.tickets[req.params.ticketid].answers).length === 0) {
						answers = false;
					} else {
						const answersOnTicket = sortableAnswers;
						answers = answersOnTicket.sort((a, b) => {
							if (a.date < b.date) {
								return 1;
							}
							if (a.date > b.date) {
								return -1;
							}
							return 0;
						});
					}

					return res.render('ticket', {
						user: req.user,

						islenoxbot: islenoxbot,
						ticket: ticket,
						answers: answers,
						status: botconfs.tickets[req.params.ticketid].status === 'open' ? true : false
					});
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		// ADMIN PANEL
		*/
	app.get('/dashboard/:id/overview', async (req, res) => {
		let guildconfs;
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildsettingskeys = require('./guildsettings-keys.json');
				guildsettingskeys.prefix = settings.prefix;

				/* if (guildconfs) {
					for (const key in guildsettingskeys) {
						if (!guildconfs.settings[key]) {
							guildconfs.settings[key] = guildsettingskeys[key];
						}
					}

					for (let i = 0; i < client.commands.array().length; i++) {
						if (!tableload.commands[client.commands.array()[i].help.name]) {
							tableload.commands[client.commands.array()[i].help.name] = {
								name: client.commands.array()[i].help.name,
								status: 'true',
								bannedroles: [],
								bannedchannels: [],
								cooldown: '3000',
								ifBlacklistForRoles: 'true',
								ifBlacklistForChannels: 'true',
								whitelistedroles: [],
								whitelistedchannels: []
							};
						}
						if (!tableload.commands[client.commands.array()[i].help.name].ifBlacklistForRoles) {
							tableload.commands[client.commands.array()[i].help.name].ifBlacklistForRoles = 'true';
							tableload.commands[client.commands.array()[i].help.name].ifBlacklistForChannels = 'true';
							tableload.commands[client.commands.array()[i].help.name].whitelistedroles = [];
							tableload.commands[client.commands.array()[i].help.name].whitelistedchannels = [];
						}
					}

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;
				} else {
					for (let i = 0; i < client.commands.array().length; i++) {
						if (!guildsettingskeys.commands[client.commands.array()[i].help.name]) {
							guildsettingskeys.commands[client.commands.array()[i].help.name] = {
								name: client.commands.array()[i].help.name,
								status: 'true',
								bannedroles: [],
								bannedchannels: [],
								cooldown: '3000',
								ifBlacklistForRoles: 'true',
								ifBlacklistForChannels: 'true',
								whitelistedroles: [],
								whitelistedchannels: []
							};
						}
						if (!guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForRoles) {
							guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForRoles = 'true';
							guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForChannels = 'true';
							guildsettingskeys.commands[client.commands.array()[i].help.name].whitelistedroles = [];
							guildsettingskeys.commands[client.commands.array()[i].help.name].whitelistedchannels = [];
						}
					}

					client.guildconfs.set(dashboardid, guildsettingskeys);
				}
				*/

				guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				let check;
				let logs;
				shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(async guildArray => {
						guild = guildArray.find(g => g);
						if (!guild) return undefined;

						const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
						guild.members = evaledMembers;

						if (guildconfs.settings.dashboardpermissionroles.length !== 0 && guild.ownerID !== req.user.id) {
							let allwhitelistedrolesoftheuser = 0;

							for (let index2 = 0; index2 < guildconfs.settings.dashboardpermissionroles.length; index2++) {
								if (!guild.members.find(r => r.userID === req.user.id)) return res.redirect('/servers');
								if (!guild.members.find(r => r.userID === req.user.id).roles.has(guildconfs.settings.dashboardpermissionroles[index2])) {
									allwhitelistedrolesoftheuser += 1;
								}
							}
							if (allwhitelistedrolesoftheuser === guildconfs.settings.dashboardpermissionroles.length) {
								return res.redirect('/servers');
							}
						} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
							return res.redirect('/servers');
						}

						if (!guild) return res.redirect('/servers');

						req.user.guilds[index].memberscount = guild.memberCount;
						req.user.guilds[index].memberscountincrement = Math.floor(guild.memberCount / 170) + 1;
						req.user.guilds[index].channelscount = guild.channels.length;
						req.user.guilds[index].channelscountincrement = Math.floor(guild.channels.length / 170) + 1;
						req.user.guilds[index].rolescount = guild.roles.length;
						req.user.guilds[index].rolescountincrement = Math.floor(guild.roles.length / 170) + 1;
						req.user.guilds[index].lenoxbotjoined = guild.members.find(r => r.userID === '354712333853130752') ? moment(guild.members.find(r => r.userID === '354712333853130752').joinedAt).format('MMMM Do YYYY, h:mm:ss a') : 'Undefined';
						req.user.guilds[index].prefix = guildconfs.settings.prefix;

						check = req.user.guilds[index];

						if (guildconfs.settings.globallogs) {
							const thelogs = guildconfs.settings.globallogs;
							logs = thelogs.sort((a, b) => {
								if (a.date < b.date) {
									return 1;
								}
								if (a.date > b.date) {
									return -1;
								}
								return 0;
							}).slice(0, 15);
						} else {
							logs = null;
						}

						const islenoxbot = islenoxboton(req);

						return res.render('dashboard', {
							user: req.user,
							guilds: check,
							islenoxbot: islenoxbot,
							logs: logs
						});
					});
			} else {
				return res.redirect('/nologin');
			}
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitlogs', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				permissionsCheck(guildconfs, guild, req, res, index);

				if (req.body[Object.keys(req.body)[0]] === 'false') {
					guildconfs.settings[Object.keys(req.body)[0]] = 'false';
				} else {
					guildconfs.settings[Object.keys(req.body)[0]] = 'true';
					guildconfs.settings[`${[Object.keys(req.body)[0]]}channel`] = guild.channels.find(c => c.name === `${req.body[Object.keys(req.body)[0]]}`).id;
				}

				guildconfs.settings.globallogs.push({
					action: `Changed the ${Object.keys(req.body)[0]} settings!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitselfassignableroles', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				if (req.body.newselfassignableroles) {
					const newselfassignableroles = req.body.newselfassignableroles;
					const array = [];

					if (Array.isArray(newselfassignableroles)) {
						for (let i = 0; i < newselfassignableroles.length; i++) {
							array.push(newselfassignableroles[i]);
						}
						guildconfs.settings.selfassignableroles = array;
					} else {
						array.push(newselfassignableroles);
						guildconfs.settings.selfassignableroles = array;
					}
				} else {
					guildconfs.settings.selfassignableroles = [];
				}

				guildconfs.settings.globallogs.push({
					action: `Updated self-assignable roles!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submittogglexp', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				permissionsCheck(guildconfs, guild, req, res, index);

				const newxpchannels = req.body.newxpchannels;
				const array = [];

				if (Array.isArray(newxpchannels)) {
					for (let i = 0; i < newxpchannels.length; i++) {
						array.push(guild.channels.find(c => c.name === newxpchannels[i]).id);
					}
					guildconfs.settings.togglexp.channelids = array;
				} else {
					array.push(guild.channels.find(c => c.name === newxpchannels).id);
					guildconfs.settings.togglexp.channelids = array;
				}

				guildconfs.settings.globallogs.push({
					action: `Updated togglexp-channels!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitbyemsg', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newbyemsg = req.body.newbyemsg;

				guildconfs.settings.byemsg = newbyemsg;

				guildconfs.settings.globallogs.push({
					action: `Changed the bye message!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitwelcomemsg', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newwelcomemsg = req.body.newwelcomemsg;

				guildconfs.settings.welcomemsg = newwelcomemsg;

				guildconfs.settings.globallogs.push({
					action: `Changed the welcome message!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitprefix', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newprefix = req.body.newprefix;

				guildconfs.settings.prefix = newprefix;

				guildconfs.settings.globallogs.push({
					action: `Changed the prefix of the bot!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
        if (this.guilds.get("${dashboardid}")) {
        const x = await this.provider.reloadGuild("${dashboardid}", "prefix", "${newprefix}");
        return x;
        }
    })();
`);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitlanguage', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newlanguage = JSON.parse(req.body.newlanguage);

				guildconfs.settings.language = newlanguage.alias;
				guildconfs.settings.momentLanguage = newlanguage.momentLanguage;

				guildconfs.settings.globallogs.push({
					action: `Changed the language of the bot!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/modules`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitcommanddeletion', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newcommanddeletion = req.body.newcommanddeletion;

				guildconfs.settings.commanddel = newcommanddeletion;

				guildconfs.settings.globallogs.push({
					action: `Changed the commanddeletion settings!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitmuterole', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newmuterole = req.body.newmuterole;

				guildconfs.settings.muterole = newmuterole;

				guildconfs.settings.globallogs.push({
					action: `Changed the muterole!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submittogglechatfilter', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newchatfilter = req.body.newchatfilter;

				guildconfs.settings.chatfilter.chatfilter = newchatfilter;

				guildconfs.settings.globallogs.push({
					action: `Toggled the chatfilter!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submittogglexpmessages', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newxpmessages = req.body.newxpmessages;

				guildconfs.settings.xpmessages = newxpmessages;

				guildconfs.settings.globallogs.push({
					action: `Toggled the XP messages!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitchatfilterarray', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			let index;
			if (req.user) {
				index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newchatfilterarray = req.body.newchatfilterarray.replace(/\s/g, '').split(',');

				for (let i = 0; i < newchatfilterarray.length; i++) {
					for (let index3 = 0; index3 < newchatfilterarray.length; index3++) {
						if (newchatfilterarray[i].toLowerCase() === newchatfilterarray[index3].toLowerCase() && i !== index3) {
							newchatfilterarray.splice(index3, 1);
						}
					}
				}

				guildconfs.settings.chatfilter.array = newchatfilterarray;

				guildconfs.settings.globallogs.push({
					action: `Updated the chatfilter entries!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submittogglewelcome', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newwelcome = req.body.newwelcome;

				if (newwelcome === 'false') {
					guildconfs.settings.welcome = 'false';
				} else {
					guildconfs.settings.welcome = 'true';
					guildconfs.settings.welcomechannel = newwelcome;
				}

				guildconfs.settings.globallogs.push({
					action: `Toggled the welcome message!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submittogglebye', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newbye = req.body.newbye;

				if (newbye === 'false') {
					guildconfs.settings.bye = 'false';
				} else {
					guildconfs.settings.bye = 'true';
					guildconfs.settings.byechannel = newbye;
				}

				guildconfs.settings.globallogs.push({
					action: `Toggled the bye message!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submittoggleannounce', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const newannounce = req.body.newannounce;

				if (newannounce === 'false') {
					guildconfs.settings.announce = 'false';
					guildconfs.settings.announcechannel = '';
				} else {
					guildconfs.settings.announce = 'true';
					guildconfs.settings.announcechannel = newannounce;
				}

				guildconfs.settings.globallogs.push({
					action: `Changed the announce settings!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitpermissionsticket', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				guildconfs.settings.dashboardticketpermissions = Number(req.body.newpermissionticket);

				guildconfs.settings.globallogs.push({
					action: `Changed the required permissions for the ticket panel!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitpermissionsapplication', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				guildconfs.settings.dashboardapplicationpermissions = Number(req.body.newpermissionapplication);

				guildconfs.settings.globallogs.push({
					action: `Changed the required permissions for the applications panel!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/administration/submitpermissionsdashboard', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				if (!guildconfs.settings.dashboardpermissionroles) {
					guildconfs.settings.dashboardpermissionroles = [];
				}

				if (req.body.newpermissiondashboard) {
					const newpermissiondashboard = req.body.newpermissiondashboard;
					const array = [];

					if (Array.isArray(newpermissiondashboard)) {
						for (let i = 0; i < newpermissiondashboard.length; i++) {
							array.push(newpermissiondashboard[i]);
						}
						guildconfs.settings.dashboardpermissionroles = array;
					} else {
						array.push(newpermissiondashboard);
						guildconfs.settings.dashboardpermissionroles = array;
					}
				} else {
					guildconfs.settings.dashboardpermissionroles = [];
				}

				guildconfs.settings.globallogs.push({
					action: `Changed the required permissions for the dashboard!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/administration`,
					query: {
						submitadministration: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/administration', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });
				const botconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
				guild.roles = evaledRoles;

				permissionsCheck(guildconfs, guild, req, res, index);

				req.user.guilds[index].prefix = guildconfs.settings.prefix;

				req.user.guilds[index].welcomemsg = guildconfs.settings.welcomemsg;
				req.user.guilds[index].byemsg = guildconfs.settings.byemsg;

				const channels = guild.channels.filter(textChannel => textChannel.type === `text`);

				if (guildconfs.settings.togglexp) {
					for (let i = 0; i < channels.length; i++) {
						if (guildconfs.settings.togglexp.channelids.includes(channels[i].id)) {
							channels[i].togglexpset = true;
						}
						if (guildconfs.settings.welcomechannel === channels[i].id) {
							channels[i].welcomeset = true;
						}
						if (guildconfs.settings.byechannel === channels[i].id) {
							channels[i].byeset = true;
						}
						if (guildconfs.settings.announcechannel === channels[i].id) {
							channels[i].announceset = true;
						}
					}
				}
				const roles = guild.roles.filter(r => r.name !== '@everyone');

				const check = req.user.guilds[index];
				for (let index2 = 0; index2 < roles.length; index2++) {
					if (guildconfs.settings.selfassignableroles.includes(roles[index2].id)) {
						roles[index2].selfassignablerolesset = true;
					}
					if (guildconfs.settings.muterole === roles[index2].id) {
						roles[index2].muteroleset = true;
					}
					if (guildconfs.settings.dashboardpermissionroles.includes(roles[index2].id)) {
						roles[index2].dashboardpermissionset = true;
					}
				}

				const commands = botconfs.settings.commands.filter(r => r.category === 'administration' && r.dashboardsettings === true);
				for (let i = 0; i < commands.length; i++) {
					const englishstrings = require('./languages/en-US.json');
					commands[i].description = englishstrings[`${commands[i].name}_description`];
					if (guildconfs.settings.commands[commands[i].name].status === 'true') {
						commands[i].enabled = true;
					} else {
						commands[i].enabled = false;
					}
					commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
					commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
					commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
					commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
				}

				const languages = [{
					name: 'english',
					alias: 'en-US',
					momentLanguage: 'en'
				},
				{
					name: 'german',
					alias: 'de-DE',
					momentLanguage: 'de'
				},
				{
					name: 'french',
					alias: 'fr-FR',
					momentLanguage: 'fr'
				},
				{
					name: 'spanish',
					alias: 'es-ES',
					momentLanguage: 'es'
				},
				{
					name: 'swiss',
					alias: 'de-CH',
					momentLanguage: 'de-CH'
				}];

				if (guildconfs.settings.language) {
					for (let index3 = 0; index3 < languages.length; index3++) {
						if (guildconfs.settings.language === languages[index3].alias) {
							languages[index3].set = true;
						}
					}
				}

				const confs = {};
				if (guildconfs.settings) {
					for (let i = 0; i < channels.length; i++) {
						if (channels[i].id === guildconfs.settings.modlogchannel) {
							if (guildconfs.settings.modlog === 'true') {
								channels[i].modlogset = true;
								confs.modlogset = true;
							} else {
								confs.modlogdeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.chatfilterlogchannel) {
							if (guildconfs.settings.chatfilterlog === 'true') {
								channels[i].chatfilterset = true;
								confs.chatfilterset = true;
							} else {
								confs.chatfilterdeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.messagedeletelogchannel) {
							if (guildconfs.settings.messagedeletelog === 'true') {
								channels[i].messagedeleteset = true;
								confs.messagedeleteset = true;
							} else {
								confs.messagedeletedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.messageupdatelogchannel) {
							if (guildconfs.settings.messageupdatelog === 'true') {
								channels[i].messageupdateset = true;
								confs.messageupdateset = true;
							} else {
								confs.messageupdatedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.channelupdatelogchannel) {
							if (guildconfs.settings.channelupdatelog === 'true') {
								channels[i].channelupdateset = true;
								confs.channelupdateset = true;
							} else {
								confs.channelupdatedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.channelcreatelogchannel) {
							if (guildconfs.settings.channeldeletelog === 'true') {
								channels[i].channelcreateset = true;
								confs.channelcreateset = true;
							} else {
								confs.channelcreatedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.channeldeletelogchannel) {
							if (guildconfs.settings.channeldeletelog === 'true') {
								channels[i].channeldeleteset = true;
								confs.channeldeleteset = true;
							} else {
								confs.channeldeletedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.memberupdatelogchannel) {
							if (guildconfs.settings.memberupdatelog === 'true') {
								channels[i].memberupdateset = true;
								confs.memberupdateset = true;
							} else {
								confs.memberupdatedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.presenceupdatelogchannel) {
							if (guildconfs.settings.presenceupdatelog === 'true') {
								channels[i].presenceupdateset = true;
								confs.presenceupdateset = true;
							} else {
								confs.presenceupdatedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.welcomelogchannel) {
							if (guildconfs.settings.welcomelog === 'true') {
								channels[i].welcomeset = true;
								confs.welcomeset = true;
							} else {
								confs.welcomelogdeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.byelogchannel) {
							if (guildconfs.settings.byelog === 'true') {
								channels[i].byeset = true;
								confs.byeset = true;
							} else {
								confs.byelogdeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.rolecreatelogchannel) {
							if (guildconfs.settings.rolecreatelog === 'true') {
								channels[i].rolecreateset = true;
								confs.rolecreateset = true;
							} else {
								confs.rolecreatedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.roledeletelogchannel) {
							if (guildconfs.settings.roledeletelog === 'true') {
								channels[i].roledeleteset = true;
								confs.roledeleteset = true;
							} else {
								confs.roledeletedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.roleupdatelogchannel) {
							if (guildconfs.settings.roleupdatelog === 'true') {
								channels[i].roleupdateset = true;
								confs.roleupdateset = true;
							} else {
								confs.roleupdatedeactivated = true;
							}
						}

						if (channels[i].id === guildconfs.settings.guildupdatelogchannel) {
							if (guildconfs.settings.guildupdatelog === 'true') {
								channels[i].guildupdateset = true;
								confs.guildupdateset = true;
							} else {
								confs.guildupdatedeactivated = true;
							}
						}
					}
				}

				const permissions = {
					administrator: {
						name: 'Administrator',
						number: 8
					},
					kickmembersbanmembers: {
						name: 'Kick Members & Ban Members (Standard)',
						number: 6
					},
					manageserver: {
						name: 'Manage Server',
						number: 32
					},
					managemessages: {
						name: 'Manage Messages',
						number: 8192
					}
				};

				// eslint-disable-next-line guard-for-in
				for (const x in permissions) {
					if (guildconfs.settings.dashboardticketpermissions === permissions[x].number) {
						permissions[x].ticketpermissionset = true;
					}
					if (guildconfs.settings.dashboardapplicationpermissions === permissions[x].number) {
						permissions[x].applicationpermissionset = true;
					}
				}
				const islenoxbot = islenoxboton(req);
				return res.render('dashboardadministration', {
					user: req.user,
					guilds: check,
					channels: channels,
					islenoxbot: islenoxbot,
					roles: roles,
					confs: confs,
					announcedeactivated: guildconfs.settings.announce === 'true' ? false : true,
					muteroledeactivated: guildconfs.settings.muterole === '' ? true : false,
					commanddeletionset: guildconfs.settings.commanddel === 'true' ? true : false,
					chatfilterset: guildconfs.settings.chatfilter.chatfilter === 'true' ? true : false,
					xpmesssagesset: guildconfs.settings.xpmessages === 'true' ? true : false,
					languages: languages,
					chatfilterarray: guildconfs.settings.chatfilter ? guildconfs.settings.chatfilter.array.join(',') : '',
					commands: commands,
					permissions: permissions,
					submitadministration: req.query.submitadministration ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/moderation/submittempbananonymous', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				if (!guildconfs.settings.muteanonymous) {
					guildconfs.settings.muteanonymous = 'false';
					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				}

				if (!guildconfs.settings.tempbananonymous) {
					guildconfs.settings.tempbananonymous = 'false';
					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				}

				guildconfs.settings.tempbananonymous = req.body.newtempbananonymous;

				guildconfs.settings.globallogs.push({
					action: `Changed the settings of the anonymous temporary ban!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/moderation`,
					query: {
						submitmoderation: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/moderation/submitmuteanonymous', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				if (!guildconfs.settings.muteanonymous) {
					guildconfs.settings.muteanonymous = 'false';
					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				}

				if (!guildconfs.settings.tempbananonymous) {
					guildconfs.settings.tempbananonymous = 'false';
					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				}

				guildconfs.settings.muteanonymous = req.body.newmuteanonymous;

				guildconfs.settings.globallogs.push({
					action: `Changed the settings of the anonymous mute!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/moderation`,
					query: {
						submitmoderation: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/moderation', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });
				const botconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
				guild.roles = evaledRoles;

				permissionsCheck(guildconfs, guild, req, res, index);

				const channels = guild.channels.filter(textChannel => textChannel.type === `text`);
				const check = req.user.guilds[index];

				const commands = botconfs.settings.commands.filter(r => r.category === 'moderation' && r.dashboardsettings === true);
				for (let i = 0; i < commands.length; i++) {
					const englishstrings = require('./languages/en-US.json');
					commands[i].description = englishstrings[`${commands[i].name}_description`];
					if (guildconfs.settings.commands[commands[i].name].status === 'true') {
						commands[i].enabled = true;
					} else {
						commands[i].enabled = false;
					}

					commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
					commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
					commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
					commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
				}

				const roles = guild.roles.filter(r => r.name !== '@everyone');

				if (!guildconfs.settings.muteanonymous) {
					guildconfs.settings.muteanonymous = 'false';
					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				}

				if (!guildconfs.settings.tempbananonymous) {
					guildconfs.settings.tempbananonymous = 'false';
					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				}

				const islenoxbot = islenoxboton(req);

				return res.render('dashboardmoderation', {
					user: req.user,
					muteanonymous: guildconfs.settings.muteanonymous === 'true' ? true : false,
					tempbananonymous: guildconfs.settings.tempbananonymous === 'true' ? true : false,
					guilds: check,
					islenoxbot: islenoxbot,
					channels: channels,
					roles: roles,
					commands: commands,
					submitmoderation: req.query.submitmoderation ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/help', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });
				const botconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
				guild.roles = evaledRoles;

				permissionsCheck(guildconfs, guild, req, res, index);

				const channels = [];
				const check = req.user.guilds[index];

				const commands = botconfs.settings.commands.filter(r => r.category === 'help' && r.dashboardsettings === true);
				for (let i = 0; i < commands.length; i++) {
					const englishstrings = require('./languages/en-US.json');
					commands[i].description = englishstrings[`${commands[i].name}_description`];
					if (guildconfs.settings.commands[commands[i].name].status === 'true') {
						commands[i].enabled = true;
					} else {
						commands[i].enabled = false;
					}

					commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
					commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
					commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
					commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
				}

				const roles = guild.roles.filter(r => r.name !== '@everyone');

				const islenoxbot = islenoxboton(req);
				return res.render('dashboardhelp', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot,
					channels: channels,
					roles: roles,
					commands: commands,
					submithelp: req.query.submithelp ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/music/submitchannelblacklist', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				permissionsCheck(guildconfs, guild, req, res, index);

				const newchannelblacklist = req.body.newchannelblacklist;
				const array = [];

				if (Array.isArray(newchannelblacklist)) {
					for (let i = 0; i < newchannelblacklist.length; i++) {
						array.push(guild.channels.find(c => c.name === newchannelblacklist[i]).id);
					}
					guildconfs.settings.musicchannelblacklist = array;
				} else {
					array.push(guild.channels.find(c => c.name === newchannelblacklist).id);
					guildconfs.settings.musicchannelblacklist = array;
				}

				guildconfs.settings.globallogs.push({
					action: `Updated blacklisted music-channels!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/music`,
					query: {
						submitmusic: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	/* app.post('/dashboard/:id/music/submitnewmusicaction', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
					let allwhitelistedrolesoftheuser = 0;

					for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
						if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
						if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
							allwhitelistedrolesoftheuser += 1;
						}
					}
					if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
						return res.redirect('/servers');
					}
				} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
					return res.redirect('/servers');
				}

				if (!guild) return res.redirect('/servers');

				const serverQueue = client.queue.get(dashboardid);

				if (req.body.newmusicaction === 'play') {
					if (serverQueue.playing === true) {
						serverQueue.playing = false;
						serverQueue.connection.dispatcher.pause();
					} else {
						serverQueue.playing = true;
						serverQueue.connection.dispatcher.resume();
					}
				} else if (req.body.newmusicaction === 'stop') {
					serverQueue.songs = [];
					serverQueue.connection.dispatcher.destroy();
				} else {
					serverQueue.connection.dispatcher.destroy();
				}

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/music`,
					query: {
						submitmusic: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});*/

	app.get('/dashboard/:id/music', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });
				const botconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
				guild.roles = evaledRoles;

				permissionsCheck(guildconfs, guild, req, res, index);

				const voicechannels = guild.channels.filter(textChannel => textChannel.type === `voice`);
				const channels = guild.channels.filter(textChannel => textChannel.type === `text`);
				const check = req.user.guilds[index];

				if (guildconfs.settings.musicchannelblacklist) {
					for (let i = 0; i < channels.length; i++) {
						if (guildconfs.settings.musicchannelblacklist.includes(channels[i].id)) {
							channels[i].channelblacklistset = true;
						}
					}
				}

				const commands = botconfs.settings.commands.filter(r => r.category === 'music' && r.dashboardsettings === true);
				for (let i = 0; i < commands.length; i++) {
					const englishstrings = require('./languages/en-US.json');
					commands[i].description = englishstrings[`${commands[i].name}_description`];
					if (guildconfs.settings.commands[commands[i].name].status === 'true') {
						commands[i].enabled = true;
					} else {
						commands[i].enabled = false;
					}

					commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
					commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
					commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
					commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
				}

				const roles = guild.roles.filter(r => r.name !== '@everyone');

				// const guildQueue = await shardingManager.shards.get(guild.shardID).eval(`this.queue.get("${dashboardid}")`);

				const islenoxbot = islenoxboton(req);
				return res.render('dashboardmusic', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot,
					channels: channels,
					voicechannels: voicechannels,
					roles: roles,
					// musiccurrentlyplaying: guildQueue ? true : false,
					// song: guildQueue ? guildQueue.songs[0].title : false,
					commands: commands,
					submitmusic: req.query.submitmusic ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/fun', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });
				const botconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
				guild.roles = evaledRoles;

				permissionsCheck(guildconfs, guild, req, res, index);

				const channels = guild.channels.filter(textChannel => textChannel.type === `text`);
				const check = req.user.guilds[index];

				const commands = botconfs.settings.commands.filter(r => r.category === 'fun' && r.dashboardsettings === true);
				for (let i = 0; i < commands.length; i++) {
					const englishstrings = require('./languages/en-US.json');
					commands[i].description = englishstrings[`${commands[i].name}_description`];
					if (guildconfs.settings.commands[commands[i].name].status === 'true') {
						commands[i].enabled = true;
					} else {
						commands[i].enabled = false;
					}

					commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
					commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
					commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
					commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
				}

				const roles = guild.roles.filter(r => r.name !== '@everyone');

				const islenoxbot = islenoxboton(req);
				return res.render('dashboardfun', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot,
					channels: channels,
					roles: roles,
					commands: commands,
					submitfun: req.query.submitfun ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/searches', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });
				const botconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
				guild.roles = evaledRoles;

				permissionsCheck(guildconfs, guild, req, res, index);

				const channels = guild.channels.filter(textChannel => textChannel.type === `text`);
				const check = req.user.guilds[index];

				const commands = botconfs.settings.commands.filter(r => r.category === 'searches' && r.dashboardsettings === true);
				for (let i = 0; i < commands.length; i++) {
					const englishstrings = require('./languages/en-US.json');
					commands[i].description = englishstrings[`${commands[i].name}_description`];
					if (guildconfs.settings.commands[commands[i].name].status === 'true') {
						commands[i].enabled = true;
					} else {
						commands[i].enabled = false;
					}

					commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
					commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
					commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
					commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
				}

				const roles = guild.roles.filter(r => r.name !== '@everyone');

				const islenoxbot = islenoxboton(req);
				return res.render('dashboardsearches', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot,
					channels: channels,
					roles: roles,
					commands: commands,
					submitsearches: req.query.submitsearches ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/nsfw', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });
				const botconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
				guild.roles = evaledRoles;

				permissionsCheck(guildconfs, guild, req, res, index);

				const channels = guild.channels.filter(textChannel => textChannel.type === `text`);
				const check = req.user.guilds[index];

				const commands = botconfs.settings.commands.filter(r => r.category === 'nsfw' && r.dashboardsettings === true);
				for (let i = 0; i < commands.length; i++) {
					const englishstrings = require('./languages/en-US.json');
					commands[i].description = englishstrings[`${commands[i].name}_description`];
					if (guildconfs.settings.commands[commands[i].name].status === 'true') {
						commands[i].enabled = true;
					} else {
						commands[i].enabled = false;
					}

					commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
					commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
					commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
					commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
				}

				const roles = guild.roles.filter(r => r.name !== '@everyone');

				const islenoxbot = islenoxboton(req);
				return res.render('dashboardnsfw', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot,
					channels: channels,
					roles: roles,
					commands: commands,
					submitnsfw: req.query.submitnsfw ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.post('/dashboard/:id/utility/submitsendembed', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				permissionsCheck(guildconfs, guild, req, res, index);

				const embed = new Discord.MessageEmbed();
				embed.setTitle(req.body.embedtitle);

				try {
					embed.setColor(req.body.embedcolor);
				} catch (error) {
					throw new Error('No color selected!');
				}

				if (req.body.embeddescription) {
					embed.setDescription(req.body.embeddescription);
				}

				if (req.body.embedlink) {
					embed.setURL(req.body.embedlink);
				}

				if (req.body.embedtimestamp) {
					embed.setTimestamp();
				}

				if (req.body.embedthumbnail) {
					embed.setThumbnail(req.body.embedthumbnail);
				}

				if (req.body.embedfooter) {
					embed.setFooter(req.body.embedfooter);
				}

				const embedchannel = guild.channels.find(r => r.id === req.body.sendembedchannel);

				await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.get("${embedchannel.id}").send({embed: ${JSON.stringify(embed)}})`);

				guildconfs.settings.globallogs.push({
					action: `An embed was sent (#${embedchannel.name}) `,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/utility`,
					query: {
						submitutility: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/utility', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });
				const botconfs = await botSettingsCollection.findOne({ botconfs: 'botconfs' });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
				guild.roles = evaledRoles;

				permissionsCheck(guildconfs, guild, req, res, index);

				const channels = guild.channels.filter(textChannel => textChannel.type === `text`);
				const check = req.user.guilds[index];

				const commands = botconfs.settings.commands.filter(r => r.category === 'utility' && r.dashboardsettings === true);
				for (let i = 0; i < commands.length; i++) {
					const englishstrings = require('./languages/en-US.json');
					commands[i].description = englishstrings[`${commands[i].name}_description`];
					if (guildconfs.settings.commands[commands[i].name].status === 'true') {
						commands[i].enabled = true;
					} else {
						commands[i].enabled = false;
					}

					commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
					commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
					commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
					commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
				}

				const roles = guild.roles.filter(r => r.name !== '@everyone');

				const islenoxbot = islenoxboton(req);
				return res.render('dashboardutility', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot,
					channels: channels,
					roles: roles,
					commands: commands,
					submitutility: req.query.submitutility ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	/* app.post('/dashboard/:id/applications/:applicationid/submitdeleteapplication', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');
					if (client.guildconfs.get(dashboardid).dashboardapplicationpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardapplicationpermissions) !== client.guildconfs.get(dashboardid).dashboardapplicationpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}
					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);
					if (tableload.application.applications[req.params.applicationid] === 'undefined') return res.redirect('../error');

					delete tableload.application.applications[req.params.applicationid];

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/applications`,
						query: {
							submitdeleteapplication: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/applications/:applicationid/submitnewvote', async (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');
					if (client.guildconfs.get(dashboardid).dashboardapplicationpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardapplicationpermissions) !== client.guildconfs.get(dashboardid).dashboardapplicationpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}
					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);
					if (tableload.application.applications[req.params.applicationid] === 'undefined') return res.redirect('../error');

					const application = tableload.application.applications[req.params.applicationid];

					if (req.body.newvote === 'true' && !application.yes.includes(req.user.id) && !application.no.includes(req.user.id)) {
						application.yes.push(req.user.id);
					} else if (!application.no.includes(req.user.id) && !application.yes.includes(req.user.id)) {
						application.no.push(req.user.id);
					}

					try {
						if (application.yes.length >= tableload.application.reactionnumber) {
							await client.users.get(application.authorid).send(tableload.application.acceptedmessage);
							const role = client.guilds.get(dashboardid).roles.get(tableload.application.role);
							if (role) {
								await client.guilds.get(dashboardid).members.get(application.authorid).addRole(role);
							}
							application.status = 'closed';
							application.acceptedorrejected = 'accepted';
						} else if (application.no.length >= tableload.application.reactionnumber) {
							await client.users.get(application.authorid).send(tableload.application.rejectedmessage);
							const role = client.guilds.get(dashboardid).roles.get(tableload.application.denyrole);
							if (role) {
								await client.guilds.get(dashboardid).members.get(application.authorid).addRole(role);
							}
							application.status = 'closed';
							application.acceptedorrejected = 'rejected';
						}
					} catch (error) {
						'undefined';
					}

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/applications/${req.params.applicationid}/overview`,
						query: {
							submitnewticketstatus: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/dashboard/:id/applications/:applicationid/overview', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');
					if (client.guildconfs.get(dashboardid).dashboardapplicationpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardapplicationpermissions) !== client.guildconfs.get(dashboardid).dashboardapplicationpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}
					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);
					if (tableload.application.applications[req.params.applicationid] === 'undefined') return res.redirect('../error');

					req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).memberCount;
					req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'online').length;
					req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'dnd').length;
					req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'idle').length;
					req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'offline').length;

					req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

					req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

					req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

					req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

					const check = req.user.guilds[index];

					for (const index2 in tableload.application.applications) {
						tableload.application.applications[index2].author = client.users.get(tableload.application.applications[index2].authorid) ? client.users.get(tableload.application.applications[index2].authorid).tag : tableload.application.applications[index2].authorid;
						tableload.application.applications[index2].newdate = moment(tableload.application.applications[index2].date).format('MMMM Do YYYY, h:mm:ss a');
					}

					let votecheck = true;
					if (tableload.application.applications[req.params.applicationid].yes.includes(req.user.id) || tableload.application.applications[req.params.applicationid].no.includes(req.user.id)) {
						votecheck = false;
					}

					const islenoxbot = islenoxboton(req);

					return res.render('application', {
						user: req.user,
						guilds: check,

						islenoxbot: islenoxbot,
						application: tableload.application.applications[req.params.applicationid],
						yeslength: tableload.application.applications[req.params.applicationid].yes.length,
						nolength: tableload.application.applications[req.params.applicationid].no.length,
						status: tableload.application.applications[req.params.applicationid].status === 'open' ? true : false,
						vote: votecheck
					});
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/dashboard/:id/applications', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardapplicationpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardapplicationpermissions) !== client.guildconfs.get(dashboardid).dashboardapplicationpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).memberCount;
					req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'online').length;
					req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'dnd').length;
					req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'idle').length;
					req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'offline').length;

					req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

					req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

					req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

					req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

					const check = req.user.guilds[index];

					const tableload = client.guildconfs.get(dashboardid);
					const newobject = {};
					const oldobject = {};

					for (const index2 in tableload.application.applications) {
						if (tableload.application.applications[index2].guildid === dashboardid && tableload.application.applications[index2].status === 'open') {
							newobject[index2] = tableload.application.applications[index2];
							tableload.application.applications[index2].author = client.users.get(tableload.application.applications[index2].authorid) ? client.users.get(tableload.application.applications[index2].authorid).tag : tableload.application.applications[index2].authorid;
							tableload.application.applications[index2].newdate = moment(tableload.application.applications[index2].date).format('MMMM Do YYYY, h:mm:ss a');
						}
						if (tableload.application.applications[index2].guildid === dashboardid && tableload.application.applications[index2].status === 'closed') {
							oldobject[index2] = tableload.application.applications[index2];
							tableload.application.applications[index2].author = client.users.get(tableload.application.applications[index2].authorid) ? client.users.get(tableload.application.applications[index2].authorid).tag : tableload.application.applications[index2].authorid;
							tableload.application.applications[index2].newdate = moment(tableload.application.applications[index2].date).format('MMMM Do YYYY, h:mm:ss a');
						}
					}

					const islenoxbot = islenoxboton(req);

					return res.render('dashboardapplications', {
						user: req.user,
						guilds: check,

						islenoxbot: islenoxbot,
						applicationscheck: Object.keys(newobject).length === 0 ? false : true,
						applications: newobject,
						oldapplicationscheck: Object.keys(oldobject).length === 0 ? false : true,
						oldapplications: oldobject
					});
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/application/submitnewacceptedmsg', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const newacceptedmsg = req.body.newacceptedmsg;

					const tableload = client.guildconfs.get(dashboardid);

					tableload.application.acceptedmessage = newacceptedmsg;

					tableload.globallogs.push({
						action: `Changed the application accepted message!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/application`,
						query: {
							submitapplication: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/application/submitnewrejectedmsg', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const newrejectedmsg = req.body.newrejectedmsg;

					const tableload = client.guildconfs.get(dashboardid);

					tableload.application.rejectedmessage = newrejectedmsg;

					tableload.globallogs.push({
						action: `Changed the application rejected message!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/application`,
						query: {
							submitapplication: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/application/submitdenyrole', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);

					if (req.body.newdenyrole === 'false') {
						tableload.application.denyrole = '';
					} else {
						const newdenyrole = req.body.newdenyrole;
						tableload.application.denyrole = newdenyrole;
					}

					tableload.globallogs.push({
						action: `Updated the application role for rejected canidates!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/application`,
						query: {
							submitapplication: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/application/submitrole', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);

					if (req.body.newrole === 'false') {
						tableload.application.role = '';
					} else {
						const newrole = req.body.newrole;
						tableload.application.role = newrole;
					}

					tableload.globallogs.push({
						action: `Updated the application role for accepted canidates!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/application`,
						query: {
							submitapplication: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/application/submitreactionnumber', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);

					const newreactionnumber = req.body.newreactionnumber;

					tableload.application.reactionnumber = newreactionnumber;


					tableload.globallogs.push({
						action: `Updated application reactionnumber!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/application`,
						query: {
							submitapplication: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/application/submitapplication', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);

					const newapplication = req.body.newapplication;

					tableload.application.status = newapplication;


					tableload.globallogs.push({
						action: `Activated/Deactivated the application system!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/application`,
						query: {
							submitapplication: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/dashboard/:id/application', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).memberCount;
					req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'online').length;
					req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'dnd').length;
					req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'idle').length;
					req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'offline').length;

					req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

					req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

					req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

					req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

					req.user.guilds[index].reactionnumber = client.guildconfs.get(req.user.guilds[index].id).application.reactionnumber;

					req.user.guilds[index].acceptedmessage = client.guildconfs.get(req.user.guilds[index].id).application.acceptedmessage;
					req.user.guilds[index].rejectedmessage = client.guildconfs.get(req.user.guilds[index].id).application.rejectedmessage;

					const channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
					const check = req.user.guilds[index];

					const tableload = client.guildconfs.get(dashboardid);
					if (tableload.application) {
						for (let i = 0; i < channels.length; i++) {
							if (tableload.application.votechannel === channels[i].id) {
								channels[i].votechannelset = true;
							}
							if (tableload.application.archivechannellog === channels[i].id) {
								channels[i].archivechannelset = true;
							}
						}
					}

					const roles = client.guilds.get(req.user.guilds[index].id).roles.filter(r => r.name !== '@everyone').array();
					if (tableload.application) {
						for (let i2 = 0; i2 < roles.length; i2++) {
							if (tableload.application.role === roles[i2].id) {
								roles[i2].roleset = true;
							}
							if (tableload.application.denyrole === roles[i2].id) {
								roles[i2].denyroleset = true;
							}
						}
					}

					const commands = client.commands.filter(r => r.help.category === 'application' && r.conf.dashboardsettings === true).array();
					for (let i = 0; i < commands.length; i++) {
						const englishstrings = require('./languages/en-US.json');
						commands[i].help.description = englishstrings[`${commands[i].help.name}_description`];
						if (tableload.commands[commands[i].help.name].status === 'true') {
							commands[i].conf.enabled = true;
						} else {
							commands[i].conf.enabled = false;
						}

						commands[i].bannedchannels = tableload.commands[commands[i].help.name].bannedchannels;
						commands[i].bannedroles = tableload.commands[commands[i].help.name].bannedroles;
						commands[i].whitelistedroles = tableload.commands[commands[i].help.name].whitelistedroles;
						commands[i].cooldown = tableload.commands[commands[i].help.name].cooldown / 1000;
					}

					const islenoxbot = islenoxboton(req);

					return res.render('dashboardapplication', {
						user: req.user,
						guilds: check,

						islenoxbot: islenoxbot,
						channels: channels,
						roles: roles,
						commands: commands,
						submitapplication: req.query.submitapplication ? true : false
					});
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/dashboard/:id/currency', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).memberCount;
					req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'online').length;
					req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'dnd').length;
					req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'idle').length;
					req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.array().filter(m => m.presence.status === 'offline').length;

					req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

					req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

					req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

					req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

					const channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
					const check = req.user.guilds[index];

					const tableload = client.guildconfs.get(dashboardid);

					const commands = client.commands.filter(r => r.help.category === 'currency' && r.conf.dashboardsettings === true).array();
					for (let i = 0; i < commands.length; i++) {
						const englishstrings = require('./languages/en-US.json');
						commands[i].help.description = englishstrings[`${commands[i].help.name}_description`];
						if (tableload.commands[commands[i].help.name].status === 'true') {
							commands[i].conf.enabled = true;
						} else {
							commands[i].conf.enabled = false;
						}

						commands[i].bannedchannels = tableload.commands[commands[i].help.name].bannedchannels;
						commands[i].bannedroles = tableload.commands[commands[i].help.name].bannedroles;
						commands[i].whitelistedroles = tableload.commands[commands[i].help.name].whitelistedroles;
						commands[i].cooldown = tableload.commands[commands[i].help.name].cooldown / 1000;
					}

					const roles = client.guilds.get(req.user.guilds[index].id).roles.filter(r => r.name !== '@everyone').array();

					const islenoxbot = islenoxboton(req);

					return res.render('dashboardcurrency', {
						user: req.user,
						guilds: check,

						islenoxbot: islenoxbot,
						channels: channels,
						roles: roles,
						commands: commands,
						submitcurrency: req.query.submitcurrency ? true : false
					});
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/tickets/:ticketid/submitticketanswer', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');
					if (client.guildconfs.get(dashboardid).dashboardticketpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardticketpermissions) !== client.guildconfs.get(dashboardid).dashboardticketpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}
					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const botconfs = client.botconfs.get('botconfs');
					if (botconfs.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');

					const ticket = botconfs.tickets[req.params.ticketid];

					const length = Object.keys(ticket.answers).length + 1;

					req.body.newticketanswer = req.body.newticketanswer.replace(/(?:\r\n|\r|\n)/g, '<br>');

					ticket.answers[length] = {
						authorid: req.user.id,
						guildid: req.params.id,
						date: Date.now(),
						content: req.body.newticketanswer,
						timelineconf: 'timeline-inverted'
					};

					client.botconfs.set('botconfs', botconfs);

					try {
						const tableload = client.guildconfs.get(dashboardid);
						const lang = require(`./languages/${tableload.language}.json`);
						const newanswer = lang.mainfile_newanswer.replace('%link', `https://lenoxbot.com/tickets/${ticket.ticketid}/overview`);
						client.users.get(ticket.authorid).send(newanswer);
					} catch (error) {
						'undefined';
					}

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`,
						query: {
							submitticketanswer: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/tickets/:ticketid/submitnewticketstatus', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');
					if (client.guildconfs.get(dashboardid).dashboardticketpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardticketpermissions) !== client.guildconfs.get(dashboardid).dashboardticketpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}
					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const botconfs = client.botconfs.get('botconfs');
					if (botconfs.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');

					const ticket = botconfs.tickets[req.params.ticketid];

					if (ticket.status === req.body.newstatus) return res.redirect(`/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`);

					ticket.status = req.body.newstatus;

					const length = Object.keys(ticket.answers).length + 1;

					if (ticket.status === 'closed') {
						ticket.answers[length] = {
							authorid: req.user.id,
							date: Date.now(),
							content: `closed the ticket!`,
							timelineconf: 'timeline-inverted',
							toStatus: 'closed'
						};
					} else if (ticket.status === 'open') {
						ticket.answers[length] = {
							authorid: req.user.id,
							date: Date.now(),
							content: `opened the ticket!`,
							timelineconf: 'timeline-inverted',
							toStatus: 'open'
						};
					}

					client.botconfs.set('botconfs', botconfs);

					try {
						const tableload = client.guildconfs.get(dashboardid);
						const lang = require(`./languages/${tableload.language}.json`);
						const statuschange = lang.mainfile_statuschange.replace('%status', ticket.status).replace('%link', `https://lenoxbot.com/tickets/${ticket.ticketid}/overview`);
						client.users.get(ticket.authorid).send(statuschange);
					} catch (error) {
						'undefined';
					}

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`,
						query: {
							submitnewticketstatus: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/dashboard/:id/tickets/:ticketid/overview', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');
					if (client.guildconfs.get(dashboardid).dashboardticketpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardticketpermissions) !== client.guildconfs.get(dashboardid).dashboardticketpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}
					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const botconfs = client.botconfs.get('botconfs');
					if (typeof botconfs.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');

					const check = req.user.guilds[index];

					const ticket = botconfs.tickets[req.params.ticketid];
					if (ticket.guildid !== req.params.id) return res.redirect('/servers');

					botconfs.tickets[req.params.ticketid].newdate = moment(botconfs.tickets[req.params.ticketid].date).format('MMMM Do YYYY, h:mm:ss a');

					botconfs.tickets[req.params.ticketid].author = client.users.get(botconfs.tickets[req.params.ticketid].authorid) ? client.users.get(botconfs.tickets[req.params.ticketid].authorid).tag : botconfs.tickets[req.params.ticketid].authorid;

					/* eslint guard-for-in: 0 */ /*
					for (const index2 in ticket.answers) {
						ticket.answers[index2].author = client.users.get(ticket.answers[index2].authorid) ? client.users.get(ticket.answers[index2].authorid).tag : ticket.answers[index2].authorid;
						ticket.answers[index2].newdate = moment(ticket.answers[index2].date).format('MMMM Do YYYY, h:mm:ss a');
					}

					const islenoxbot = islenoxboton(req);

					const sortableAnswers = [];
					for (const key in botconfs.tickets[req.params.ticketid].answers) {
						sortableAnswers.push(botconfs.tickets[req.params.ticketid].answers[key]);
					}

					let answers;
					if (Object.keys(botconfs.tickets[req.params.ticketid].answers).length === 0) {
						answers = false;
					} else {
						const answersOnTicket = sortableAnswers;
						answers = answersOnTicket.sort((a, b) => {
							if (a.date < b.date) {
								return 1;
							}
							if (a.date > b.date) {
								return -1;
							}
							return 0;
						});
					}

					return res.render('dashboardticket', {
						user: req.user,
						guilds: check,

						islenoxbot: islenoxbot,
						ticket: ticket,
						answers: answers,
						status: botconfs.tickets[req.params.ticketid].status === 'open' ? true : false
					});
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/dashboard/:id/tickets', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardticketpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardticketpermissions) !== client.guildconfs.get(dashboardid).dashboardticketpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					req.user.guilds[index].reactionnumber = client.guildconfs.get(req.user.guilds[index].id).application.reactionnumber;

					const channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
					const check = req.user.guilds[index];

					const botconfs = client.botconfs.get('botconfs');
					const newobject = {};
					const oldobject = {};

					for (const index2 in botconfs.tickets) {
						if (botconfs.tickets[index2].guildid === dashboardid && botconfs.tickets[index2].status === 'open') {
							newobject[index2] = botconfs.tickets[index2];
							botconfs.tickets[index2].author = client.users.get(botconfs.tickets[index2].authorid).tag ? client.users.get(botconfs.tickets[index2].authorid).tag : botconfs.tickets[index2].authorid;
							botconfs.tickets[index2].newdate = moment(botconfs.tickets[index2].date).format('MMMM Do YYYY, h:mm:ss a');
						}
						if (botconfs.tickets[index2].guildid === dashboardid && botconfs.tickets[index2].status === 'closed') {
							oldobject[index2] = botconfs.tickets[index2];
							botconfs.tickets[index2].author = client.users.get(botconfs.tickets[index2].authorid).tag ? client.users.get(botconfs.tickets[index2].authorid).tag : botconfs.tickets[index2].authorid;
							botconfs.tickets[index2].newdate = moment(botconfs.tickets[index2].date).format('MMMM Do YYYY, h:mm:ss a');
						}
					}

					const tableload = client.guildconfs.get(dashboardid);
					const commands = client.commands.filter(r => r.help.category === 'tickets' && r.conf.dashboardsettings === true).array();
					for (let i = 0; i < commands.length; i++) {
						const englishstrings = require('./languages/en-US.json');
						commands[i].help.description = englishstrings[`${commands[i].help.name}_description`];
						if (tableload.commands[commands[i].help.name].status === 'true') {
							commands[i].conf.enabled = true;
						} else {
							commands[i].conf.enabled = false;
						}

						commands[i].bannedchannels = tableload.commands[commands[i].help.name].bannedchannels;
						commands[i].bannedroles = tableload.commands[commands[i].help.name].bannedroles;
						commands[i].whitelistedroles = tableload.commands[commands[i].help.name].whitelistedroles;
						commands[i].cooldown = tableload.commands[commands[i].help.name].cooldown / 1000;
					}

					const roles = client.guilds.get(dashboardid).roles.filter(r => r.name !== '@everyone').array();

					const islenoxbot = islenoxboton(req);

					return res.render('dashboardtickets', {
						user: req.user,
						guilds: check,
						islenoxbot: islenoxbot,
						channels: channels,
						roles: roles,
						ticketszero: Object.keys(newobject).length === 0 ? false : true,
						tickets: newobject,
						ticketszeroold: Object.keys(oldobject).length === 0 ? false : true,
						oldtickets: oldobject,
						commands: commands,
						submittickets: req.query.submittickets ? true : false
					});
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/customcommands/customcommand/:command/submitdeletecommand', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);

					for (let i = 0; i < tableload.customcommands.length; i++) {
						if (tableload.customcommands[i].name === req.params.command.toLowerCase()) {
							tableload.customcommands.splice(i, 1);
						}
					}

					tableload.globallogs.push({
						action: `Deleted the "${req.params.command}" custom command!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/customcommands`,
						query: {
							submitcustomcommands: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/customcommands/customcommand/:command/submitcommandstatuschange', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);

					for (let i = 0; i < tableload.customcommands.length; i++) {
						if (tableload.customcommands[i].name === req.params.command.toLowerCase()) {
							tableload.customcommands[i].enabled = req.body.statuschange;
						}
					}

					tableload.globallogs.push({
						action: `Activated/Deactivated the "${req.params.command}" custom command!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/customcommands`,
						query: {
							submitcustomcommands: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/customcommands/customcommand/:command/submitcommandchange', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);

					let newDescription;
					const newResponse = req.body.newcommandanswer;
					if (req.body.newdescription) {
						newDescription = req.body.newdescription;
					}

					for (let i = 0; i < tableload.customcommands.length; i++) {
						if (tableload.customcommands[i].name === req.params.command.toLowerCase()) {
							tableload.customcommands[i].description = newDescription;
							tableload.customcommands[i].commandanswer = newResponse;
						}
					}

					tableload.globallogs.push({
						action: `Changed the settings of the "${req.params.command}" custom command!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/customcommands`,
						query: {
							submitcustomcommands: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.post('/dashboard/:id/customcommands/submitnewcustomcommand', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
						let allwhitelistedrolesoftheuser = 0;

						for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
							if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
							if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
								allwhitelistedrolesoftheuser += 1;
							}
						}
						if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
							return res.redirect('/servers');
						}
					} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					const tableload = client.guildconfs.get(dashboardid);

					let newDescription;
					const newCommandName = req.body.newname;
					const newResponse = req.body.newcommandanswer;
					if (req.body.newdescription) {
						newDescription = req.body.newdescription;
					}

					for (let i = 0; i < tableload.customcommands.length; i++) {
						if (tableload.customcommands[i].name === newCommandName.toLowerCase()) {
							return res.redirect(url.format({
								pathname: `/error`,
								query: {
									statuscode: 500,
									message: 'Custom command already exists!'
								}
							}));
						}
					}

					const newCustomCommandSettings = {
						name: newCommandName.toLowerCase(),
						creator: req.user.id,
						commandanswer: newResponse,
						descriptionOfTheCommand: newDescription,
						embed: 'false',
						commandCreatedAt: Date.now(),
						enabled: 'true'
					};

					tableload.customcommands.push(newCustomCommandSettings);

					tableload.globallogs.push({
						action: `Added a new custom command: "${req.params.command}"!`,
						username: req.user.username,
						date: Date.now(),
						showeddate: new Date().toUTCString()
					});

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;

					return res.redirect(url.format({
						pathname: `/dashboard/${dashboardid}/customcommands`,
						query: {
							submitcustomcommands: true
						}
					}));
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});

		app.get('/dashboard/:id/customcommands', (req, res) => {
			try {
				const dashboardid = req.params.id;
				if (req.user) {
					let index = -1;
					for (let i = 0; i < req.user.guilds.length; i++) {
						if (req.user.guilds[i].id === dashboardid) {
							index = i;
						}
					}

					if (index === -1) return res.redirect('/servers');

					if (client.guildconfs.get(dashboardid).dashboardticketpermissions) {
						if (((req.user.guilds[index].permissions) & client.guildconfs.get(dashboardid).dashboardticketpermissions) !== client.guildconfs.get(dashboardid).dashboardticketpermissions) return res.redirect('/servers');
					} else if (((req.user.guilds[index].permissions) & 6) !== 6) {
						return res.redirect('/servers');
					}

					if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect('/servers');

					req.user.guilds[index].reactionnumber = client.guildconfs.get(req.user.guilds[index].id).application.reactionnumber;

					const channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
					const check = req.user.guilds[index];

					const tableload = client.guildconfs.get(dashboardid);
					const commands = client.commands.filter(r => r.help.category === 'customcommands' && r.conf.dashboardsettings === true).array();
					for (let i = 0; i < commands.length; i++) {
						const englishstrings = require('./languages/en-US.json');
						commands[i].help.description = englishstrings[`${commands[i].help.name}_description`];
						if (tableload.commands[commands[i].help.name].status === 'true') {
							commands[i].conf.enabled = true;
						} else {
							commands[i].conf.enabled = false;
						}

						commands[i].bannedchannels = tableload.commands[commands[i].help.name].bannedchannels;
						commands[i].bannedroles = tableload.commands[commands[i].help.name].bannedroles;
						commands[i].whitelistedroles = tableload.commands[commands[i].help.name].whitelistedroles;
						commands[i].cooldown = tableload.commands[commands[i].help.name].cooldown / 1000;
					}

					if (!tableload.customcommands) {
						tableload.customcommands = [];
						await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;
					}

					const customcommands = tableload.customcommands;

					for (let index2 = 0; index2 < tableload.customcommands.length; index2++) {
						if (client.users.get(tableload.customcommands[index2].creator)) {
							customcommands[index2].newcreator = client.users.get(tableload.customcommands[index2].creator).tag;
						}
						customcommands[index2].newcommandCreatedAt = new Date(tableload.customcommands[index2].commandCreatedAt).toUTCString();
						customcommands[index2].newstatus = tableload.customcommands[index2].enabled === 'true' ? true : false;
					}

					const roles = client.guilds.get(dashboardid).roles.filter(r => r.name !== '@everyone').array();

					const islenoxbot = islenoxboton(req);

					return res.render('dashboardcustomcommands', {
						user: req.user,
						guilds: check,
						islenoxbot: islenoxbot,
						channels: channels,
						roles: roles,
						commands: commands,
						customcommands: customcommands,
						isCustomCommands: customcommands.length === 0 ? false : true,
						submitcustomcommands: req.query.submitcustomcommands ? true : false
					});
				}
				return res.redirect('/nologin');
			} catch (error) {
				return res.redirect(url.format({
					pathname: `/error`,
					query: {
						statuscode: 500,
						message: error.message
					}
				}));
			}
		});
		*/

	app.post('/dashboard/:id/modules/submitmodules', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				permissionsCheck(guildconfs, guild, req, res, index);

				const name = Object.keys(req.body)[0];
				guildconfs.settings.modules[name.toLowerCase()] = req.body[name];

				guildconfs.settings.globallogs.push({
					action: `Activated/Deactivated the ${Object.keys(req.body)[0]} module!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/modules`,
					query: {
						submitmodules: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/modules', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				permissionsCheck(guildconfs, guild, req, res, index);

				const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
				guild.channels = evaledChannels;

				const check = req.user.guilds[index];

				const modules = {};

				const moduleslist = ['Moderation', 'Help', 'Music', 'Fun', 'Searches', 'NSFW', 'Utility', 'Application', 'Currency', 'Tickets', 'Customcommands'];

				for (let i = 0; i < moduleslist.length; i++) {
					const config = {
						name: '',
						description: '',
						status: ''
					};

					config.name = moduleslist[i];

					const lang = require('./languages/en-US.json');
					config.description = lang[`modules_${moduleslist[i].toLowerCase()}`];

					if (guildconfs.settings.modules[moduleslist[i].toLowerCase()] === 'true') {
						config.status = true;
					} else {
						config.status = false;
					}

					modules[moduleslist[i].toLowerCase()] = config;
				}

				const islenoxbot = islenoxboton(req);

				return res.render('dashboardmodules', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot,
					modules: modules,
					submitmodules: req.query.submitmodules ? true : false
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/dashboard/:id/lastlogs', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				permissionsCheck(guildconfs, guild, req, res, index);

				const check = req.user.guilds[index];
				let logs;

				if (guildconfs.settings.globallogs) {
					const thelogs = guildconfs.settings.globallogs;
					logs = thelogs.sort((a, b) => {
						if (a.date < b.date) {
							return 1;
						}
						if (a.date > b.date) {
							return -1;
						}
						return 0;
					});
				} else {
					logs = null;
				}

				const islenoxbot = islenoxboton(req);

				return res.render('dashboardlastlogs', {
					user: req.user,
					guilds: check,
					islenoxbot: islenoxbot,
					logs: logs
				});
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	app.get('/error', (req, res) => {
		const check = [];
		if (req.user) {
			for (let i = 0; i < req.user.guilds.length; i++) {
				if (((req.user.guilds[i].permissions) & 8) === 8) {
					check.push(req.user.guilds[i]);
				}
			}
		}

		let fix = false;
		let howtofix = '';

		if (req.query.message === "Cannot read property 'prefix' of null") {
			fix = true;
			howtofix = 'Write a textmessage in a textchannel on your discord server';
		}
		if (req.query.message === "Cannot read property 'dashboardpermissionroles' of null") {
			fix = true;
			howtofix = 'Write a textmessage in a textchannel on your discord server';
		}

		const islenoxbot = islenoxboton(req);

		res.status(404)
			.render('error', {
				user: req.user,
				guilds: check,
				islenoxbot: islenoxbot,
				statuscode: req.query.statuscode,
				message: req.query.message,
				fix: fix,
				howtofix: howtofix
			});
	});

	// Global post for commandstatuschange
	app.post('/dashboard/:id/global/:command/submitcommandstatuschange', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				permissionsCheck(guildconfs, guild, req, res, index);

				guildconfs.settings.commands[req.params.command].status = req.body.statuschange;

				guildconfs.settings.globallogs.push({
					action: `Activated/Deactivated the "${req.params.command}" command!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/modules`,
					query: {
						submit: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	// Global post for commandchange
	app.post('/dashboard/:id/global/:command/submitcommandchange', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i++) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				const guildconfs = await guildSettingsCollection.findOne({ guildId: dashboardid });

				let guild;
				await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
					.then(guildArray => {
						guild = guildArray.find(g => g);
					});
				if (!guild) return res.redirect('/servers');

				const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
				guild.members = evaledMembers;

				permissionsCheck(guildconfs, guild, req, res, index);

				guildconfs.settings.commands[req.params.command].bannedchannels = req.body.newblacklistedchannels;

				const channelsarray = [];
				const rolesarray = [];
				const whitelistedrolesarray = [];
				let newcooldown = '';
				if (req.body.newblacklistedchannels) {
					if (Array.isArray(req.body.newblacklistedchannels)) {
						for (let i = 0; i < req.body.newblacklistedchannels.length; i++) {
							channelsarray.push(req.body.newblacklistedchannels[i]);
						}
						guildconfs.settings.commands[req.params.command].bannedchannels = channelsarray;
					} else {
						channelsarray.push(req.body.newblacklistedchannels);
						guildconfs.settings.commands[req.params.command].bannedchannels = channelsarray;
					}
				} else {
					guildconfs.settings.commands[req.params.command].bannedchannels = [];
				}

				if (req.body.newblacklistedroles) {
					if (Array.isArray(req.body.newblacklistedroles)) {
						for (let i = 0; i < req.body.newblacklistedroles.length; i++) {
							rolesarray.push(req.body.newblacklistedroles[i]);
						}
						guildconfs.settings.commands[req.params.command].bannedroles = rolesarray;
					} else {
						rolesarray.push(req.body.newblacklistedroles);
						guildconfs.settings.commands[req.params.command].bannedroles = rolesarray;
					}
				} else {
					guildconfs.settings.commands[req.params.command].bannedroles = [];
				}

				if (req.body.newwhitelistedroles) {
					if (Array.isArray(req.body.newwhitelistedroles)) {
						for (let i = 0; i < req.body.newwhitelistedroles.length; i++) {
							whitelistedrolesarray.push(req.body.newwhitelistedroles[i]);
						}
						guildconfs.settings.commands[req.params.command].whitelistedroles = whitelistedrolesarray;
					} else {
						whitelistedrolesarray.push(req.body.newwhitelistedroles);
						guildconfs.settings.commands[req.params.command].whitelistedroles = whitelistedrolesarray;
					}
				} else {
					guildconfs.settings.commands[req.params.command].whitelistedroles = [];
				}

				newcooldown = Number(req.body.newcooldown) * 1000;
				guildconfs.settings.commands[req.params.command].cooldown = `${newcooldown}`;

				guildconfs.settings.globallogs.push({
					action: `Changed the settings of the "${req.params.command}" command!`,
					username: req.user.username,
					date: Date.now(),
					showeddate: new Date().toUTCString()
				});

				await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });
				await reloadGuild(guild, dashboardid);

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/modules`,
					query: {
						submit: true
					}
				}));
			}
			return res.redirect('/nologin');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	});

	// catch error and forward to error handler
	app.use((req, res) => {
		const err = new Error('Not Found');
		err.status = 404;
		return res.redirect(url.format({
			pathname: `/error`,
			query: {
				statuscode: 404,
				message: 'Page not found'
			}
		}));
	});
}

run().catch(error => {
	console.log(error);
});
