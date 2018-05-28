const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;
const fs = require('fs');
const Enmap = require('enmap');
const NewsAPI = require('newsapi');
const EnmapSQLite = require('enmap-sqlite');
const EnmapLevel = require('enmap-level');

var express = require('express'),
	session = require('express-session'),
	url = require('url'),
	moment = require('moment'),
	passport = require('passport'),
	Strategy = require('passport-discord').Strategy,
	handlebars = require('express-handlebars'),
	app = express();
const path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


client.wait = require("util").promisify(setTimeout);
client.guildconfs = new Enmap({
	provider: new EnmapSQLite({
		name: 'guildsettings'
	})
});
client.botconfs = new Enmap({
	provider: new EnmapSQLite({
		name: 'botconfs'
	})
});
client.redeem = new Enmap({
	provider: new EnmapSQLite({
		name: 'redeem'
	})
});
client.userdb = new Enmap({
	provider: new EnmapLevel({
		name: 'userdb'
	})
});
client.queue = new Map();
client.skipvote = new Map();
client.newsapi = new NewsAPI('351893454fd1480ea4fe2f0eac0307c2');
client.cooldowns = new Discord.Collection();

const DBL = require("dblapi.js");
client.dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1NDcxMjMzMzg1MzEzMDc1MiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTA5NjU3MTkzfQ.dDleV67s0ESxSVUxKxeQ8W_z6n9YwrDrF9ObU2MKgVE');
client.dbl.getVotes(true);


fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		let eventFunction = require(`./events/${file}`);
		let eventName = file.split('.')[0];
		client.on(eventName, (...args) => eventFunction.run(client, ...args));
	});
});


process.on('unhandledRejection', (reason) => {
	if (reason.name === 'DiscordAPIError') return;
	console.error(reason);
});
process.on('uncaughtException', (reason) => {
	console.error(reason);
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const categories = ['partner', 'currency', 'botowner', 'administration', 'moderation', 'fun', 'help', 'music', 'nsfw', 'searches', 'utility', 'staff', 'application', 'tickets'];
categories.forEach((c, i) => {
	fs.readdir(`./commands/${c}/`, (err, files) => {
		if (err) throw err;
		console.log(`[Commands] Loading ${files.length} commands... (category: ${c})`);

		files.forEach((f) => {
			let props = require(`./commands/${c}/${f}`);
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name);
			});
		});
	});
});

client.login(token);

// WEBSITE

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());

app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

var scopes = ['identify', 'guilds'];

passport.use(new Strategy({
	clientID: '431457499892416513',
	clientSecret: 'VPdGHqR4yzRW-lDd0jIdfe6EwPzhoJ_t',
	callbackURL: 'https://lenoxbot.com/callback',
	scope: scopes
}, function (accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		return done(null, profile);
	});
}));

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/loginpressedbutton', passport.authenticate('discord', {
	scope: scopes
	}), function (req, res) {});
app.get('/callback',
	passport.authenticate('discord', {
		failureRedirect: '/oauth2problem'
	}),
	function (req, res) {
		res.redirect('/servers');
	}
);

app.listen(80, function (err) {
	if (err) return console.log(err);
	console.log('Listening at https://lenoxbot.com/');
});

app.get('/', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				check.push(req.user.guilds[i]);
			}
		}
	}

	res.render('index', {
		user: req.user,
		guilds: check,
		client: client,
		botstats: client.botconfs.get('botstats')
	});
});

app.get('/home', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				check.push(req.user.guilds[i]);
			}
		}
	}

	res.render('index', {
		user: req.user,
		guilds: check,
		client: client,
		botstats: client.botconfs.get('botstats')
	});
});

app.get('/invite', function (req, res, next) {
	return res.redirect('https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8');
});

app.get('/discord', function (req, res, next) {
	return res.redirect('https://discordapp.com/invite/c7DUz35');
});

app.get('/blog', function (req, res, next) {
	return res.redirect('https://medium.com/lenoxbot');
});

app.get('/ban', function (req, res, next) {
	return res.redirect('https://goo.gl/forms/NKoVsl8y5wOePCYT2');
});

app.get('/apply', function (req, res, next) {
	return res.redirect('https://goo.gl/forms/jOyjxAheOHaDYyoF2');
});

app.get('/survey', function (req, res, next) {
	return res.redirect('https://goo.gl/forms/2sS8U9JoYjeWHFF83');
});

app.get('/logout', function (req, res) {
	req.logOut();
	res.redirect('home');
});

app.get('/commands', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				check.push(req.user.guilds[i]);
			}
		}
	}

	res.render('commands', {
		user: req.user,
		guilds: check,
		client: client
	});
});

app.post('/editdocumentation/submitnewdocumentationentry', async function (req, res, next) {
	if (req.user) {
		const moderatorrole = client.guilds.get('352896116812939264').roles.find('name', 'Documentationmoderator').id;
		if (!client.guilds.get('352896116812939264').members.get(req.user.id).roles.get(moderatorrole)) return res.redirect('../404error');

		const botconfs = await client.botconfs.get('botconfs');

		const category = botconfs[req.body.category];

		req.body.content = req.body.content.replace(/(?:\r\n|\r|\n)/g, "\n");
		
		category[Object.keys(category).length + 1] = {
			authorid: req.user.id,
			title: req.body.title,
			number: Object.keys(category).length + 1,
			content: req.body.content,
			date: new Date()
		};

		await client.botconfs.set('botconfs', botconfs);

		return res.redirect(url.format({
			pathname: `/editdocumentation`,
			query: {
				"submitnewentry": true
			}
		}));
	} else {
		return res.redirect('../nologin');
	}
});

app.post('/editdocumentation/:id/submittutorialsupdate', async function (req, res, next) {
	if (req.user) {
		const moderatorrole = client.guilds.get('352896116812939264').roles.find('name', 'Documentationmoderator').id;
		if (!client.guilds.get('352896116812939264').members.get(req.user.id).roles.get(moderatorrole)) return res.redirect('../404error');

		const botconfs = await client.botconfs.get('botconfs');

		const tutorials = botconfs.tutorials;

		req.body.content = req.body.content.replace(/(?:\r\n|\r|\n)/g, "\n");

		tutorials[req.params.id].title = req.body.title;
		tutorials[req.params.id].content = req.body.content;
		tutorials[req.params.id].date = new Date();
		tutorials[req.params.id].authorid = req.user.id;

		await client.botconfs.set('botconfs', botconfs);

		return res.redirect(url.format({
			pathname: `/editdocumentation`,
			query: {
				"submitedit": true
			}
		}));
	} else {
		return res.redirect('../nologin');
	}
});

app.post('/editdocumentation/:id/submitgeneralfaqupdate', async function (req, res, next) {
	if (req.user) {
		const moderatorrole = client.guilds.get('352896116812939264').roles.find('name', 'Documentationmoderator').id;
		if (!client.guilds.get('352896116812939264').members.get(req.user.id).roles.get(moderatorrole)) return res.redirect('../404error');

		const botconfs = await client.botconfs.get('botconfs');

		const generalfaq = botconfs.generalfaq;

		req.body.content = req.body.content.replace(/(?:\r\n|\r|\n)/g, "\n");

		generalfaq[req.params.id].title = req.body.title;
		generalfaq[req.params.id].content = req.body.content;
		generalfaq[req.params.id].date = new Date();
		generalfaq[req.params.id].authorid = req.user.id;

		await client.botconfs.set('botconfs', botconfs);

		return res.redirect(url.format({
			pathname: `/editdocumentation`,
			query: {
				"submitedit": true
			}
		}));
	} else {
		return res.redirect('../nologin');
	}
});

app.get('/editdocumentation', async function (req, res, next) {
	if (req.user) {
		const moderatorrole = client.guilds.get('352896116812939264').roles.find('name', 'Documentationmoderator').id;
		if (!client.guilds.get('352896116812939264').members.get(req.user.id).roles.get(moderatorrole)) return res.redirect('../404error');
		const botconfs = await client.botconfs.get('botconfs');

		return res.render('editdocumentation', {
			user: req.user,
			client: client,
			generalfaq: botconfs.generalfaq,
			tutorials: botconfs.tutorials
		});
	} else {
		return res.redirect('../nologin');
	}
});

app.get('/documentation', async function (req, res, next) {
	const botconfs = await client.botconfs.get('botconfs');

	for (var index in botconfs.generalfaq) {
		botconfs.generalfaq[index].newdate = moment(botconfs.generalfaq[index].date).format('MMMM Do YYYY, h:mm:ss a');
		botconfs.generalfaq[index].author = client.users.get(botconfs.generalfaq[index].authorid) ? client.users.get(botconfs.generalfaq[index].authorid).tag : botconfs.generalfaq[index].authorid;
	}

	for (var index2 in botconfs.tutorials) {
		botconfs.tutorials[index2].newdate = moment(botconfs.tutorials[index2].date).format('MMMM Do YYYY, h:mm:ss a');
		botconfs.tutorials[index2].author = client.users.get(botconfs.tutorials[index2].authorid) ? client.users.get(botconfs.tutorials[index2].authorid).tag : botconfs.tutorials[index2].authorid;
	}

	res.render('documentation', {
		user: req.user,
		client: client,
		generalfaq: botconfs.generalfaq,
		tutorials: botconfs.tutorials
	});
});

/*
app.get('/ranking/:id', async function (req, res, next) {
	try {
		const sql = require("sqlite");
		sql.open("../lenoxbotscore.sqlite");
		const rows = await sql.all(`SELECT * FROM scores WHERE guildId = "${req.params.id}" GROUP BY userId ORDER BY points DESC`);

		let ranks = Object();

	rows.forEach(row => {
		const member = client.guilds.get(req.params.id).member(row.userId);
		ranks.user = member ? member.displayName : row.userId;
		ranks.points = row.points;
		ranks.level = row.level;
	});
	console.log(ranks);

		res.render('ranking', {
			ranks: ranks,
			client: client
		});
	} catch (error) {
		res.redirect('/404error');
	}
});
*/

app.get('/nologin', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				check.push(req.user.guilds[i]);
			}
		}
	}

	res.render('login', {
		notloggedin: true,
		user: req.user,
		guilds: check,
		client: client
	});
});

app.get('/login', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				check.push(req.user.guilds[i]);
			}
		}
	}

	res.render('login', {
		user: req.user,
		guilds: check,
		client: client
	});
});

app.get('/oauth2problem', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				req.user.guilds[i].lenoxbot = client.guilds.get(req.user.guilds[i].id) ? true : false;
				check.push(req.user.guilds[i]);
			}
		}
	}

	res.render('oauth2problem', {
		user: req.user,
		guilds: check,
		client: client
	});
});

app.get('/servers', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				req.user.guilds[i].lenoxbot = client.guilds.get(req.user.guilds[i].id) ? true : false;

				if (req.user.guilds[i].lenoxbot === true) {
					req.user.guilds[i].memberscount = client.guilds.get(req.user.guilds[i].id).members.size;
				}

				check.push(req.user.guilds[i]);
			}
		}
		res.render('servers', {
			user: req.user,
			guilds: check,
			client: client
		});
	} else {
		res.redirect('nologin');
	}
});

app.post('/tickets/:ticketid/submitticketanswer', async function (req, res, next) {
	if (req.user) {
		const botconfs = await client.botconfs.get('botconfs');
		if (botconfs.tickets[req.params.ticketid] === undefined) return res.redirect('../404error');
		if (botconfs.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../404error');

		var ticket = botconfs.tickets[req.params.ticketid];

		const length = Object.keys(ticket.answers).length + 1;

		req.body.newticketanswer = req.body.newticketanswer.replace(/(?:\r\n|\r|\n)/g, "\n");

		ticket.answers[length] = {
			authorid: req.user.id,
			guildid: req.params.id,
			date: new Date(),
			content: req.body.newticketanswer,
			timelineconf: ""
		};

		await client.botconfs.set('botconfs', botconfs);

		if (client.guildconfs.get(ticket.guildid) && client.guildconfs.get(ticket.guildid).tickets.status === true) {
			const tableload = client.guildconfs.get(ticket.guildid);
			const lang = require(`./languages/${tableload.language}.json`);

			const ticketembedanswer = lang.mainfile_ticketembedanswer.replace('%ticketid', ticket.ticketid);
			const embed = new Discord.RichEmbed()
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
				undefined;
			}
		}

		return res.redirect(url.format({
			pathname: `/tickets/${ticket.ticketid}/overview`,
			query: {
				"submitticketanswer": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/tickets/:ticketid/submitnewticketstatus', async function (req, res, next) {
	if (req.user) {
		const botconfs = await client.botconfs.get('botconfs');
		if (botconfs.tickets[req.params.ticketid] === undefined) return res.redirect('../404error');
		if (botconfs.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../404error');
		if (botconfs.tickets[req.params.ticketid] === undefined) return res.redirect('../404error');

		var ticket = botconfs.tickets[req.params.ticketid];

		if (ticket.status === req.body.newstatus) return res.redirect(`/tickets/${ticket.ticketid}/overview`);

		ticket.status = req.body.newstatus;

		const length = Object.keys(ticket.answers).length + 1;

	if (ticket.status === 'closed') {
		ticket.answers[length] = {
			authorid: req.user.id,
			guildid: req.params.id,
			date: new Date(),
			content: `${client.users.get(ticket.authorid) ? client.users.get(ticket.authorid).tag : ticket.authorid} closed the ticket!`,
			timelineconf: ""
		};
	} else if (ticket.status === 'open') {
		ticket.answers[length] = {
			authorid: req.user.id,
			guildid: req.params.id,
			date: new Date(),
			content: `${client.users.get(ticket.authorid) ? client.users.get(ticket.authorid).tag : ticket.authorid} opened the ticket!`,
			timelineconf: ""
		};
	}

		await client.botconfs.set('botconfs', botconfs);

		return res.redirect(url.format({
			pathname: `/tickets/${ticket.ticketid}/overview`,
			query: {
				"submitnewticketstatus": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.get('/tickets/:ticketid/overview', async function (req, res, next) {
	if (req.user) {
		const botconfs = await client.botconfs.get('botconfs');
		if (botconfs.tickets[req.params.ticketid] === undefined) return res.redirect('../404error');
		if (botconfs.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../404error');

		var ticket = botconfs.tickets[req.params.ticketid];

		botconfs.tickets[req.params.ticketid].newdate = moment(botconfs.tickets[req.params.ticketid].date).format('MMMM Do YYYY, h:mm:ss a')

		botconfs.tickets[req.params.ticketid].author = client.users.get(botconfs.tickets[req.params.ticketid].authorid).tag;

		for (var index in ticket.answers) {
			ticket.answers[index].author = client.users.get(ticket.answers[index].authorid) ? client.users.get(ticket.answers[index].authorid).tag : ticket.answers[index].authorid;
			ticket.answers[index].newdate = moment(ticket.answers[index].date).format('MMMM Do YYYY, h:mm:ss a');
		}

		return res.render('ticket', {
			user: req.user,
			client: client,
			ticket: ticket,
			answers: Object.keys(botconfs.tickets[req.params.ticketid].answers).length === 0 ? false : botconfs.tickets[req.params.ticketid].answers,
			status: botconfs.tickets[req.params.ticketid].status === 'open' ? true : false
		});
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/overview', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers") //res.redirect('../botnotonserver');

		req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).members.size;
		req.user.guilds[index].memberscountincrement = Math.floor(client.guilds.get(req.user.guilds[index].id).members.size / 170) + 1;

		req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'online').length;
		req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'dnd').length;
		req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'idle').length;
		req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'offline').length;

		req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;
		req.user.guilds[index].channelscountincrement = Math.floor(client.guilds.get(req.user.guilds[index].id).channels.size / 170) + 1;

		req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;
		req.user.guilds[index].rolescountincrement = Math.floor(client.guilds.get(req.user.guilds[index].id).roles.size / 170) + 1;

		req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

		req.user.guilds[index].lenoxbotjoined = client.guilds.get(req.user.guilds[index].id).members.get('354712333853130752') ? moment(client.guilds.get(req.user.guilds[index].id).members.get('354712333853130752').joinedAt).format('MMMM Do YYYY, h:mm:ss a') : 'Undefined';

		req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

		var activatedmodules = 0;
		for (var prop in client.guildconfs.get(req.user.guilds[index].id).modules) {
			if (client.guildconfs.get(req.user.guilds[index].id).modules[prop] === 'true') {
				activatedmodules = activatedmodules + 1;
			}
		}

		req.user.guilds[index].activatedmodules = activatedmodules;

		var check = req.user.guilds[index];

		if (client.guildconfs.get(dashboardid).globallogs) {
			const thelogs = client.guildconfs.get(dashboardid).globallogs;
			var logs = thelogs.sort(function (a, b) {
				if (a.date < b.date) {
					return 1;
				}
				if (a.date > b.date) {
					return -1;
				}
				return 0;
			}).slice(0, 15);
		} else {
			var logs = null;
		}

		return res.render('dashboard', {
			user: req.user,
			guilds: check,
			client: client,
			logs: logs
		});
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/generalsettings/submitselfassignableroles', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		var newselfassignableroles = req.body.newselfassignableroles;
		var array = [];
		const tableload = client.guildconfs.get(dashboardid);

		if (Array.isArray(newselfassignableroles)) {
			for (var i = 0; i < newselfassignableroles.length; i++) {
				array.push(client.guilds.get(req.user.guilds[index].id).roles.find('name', newselfassignableroles[i]).id);
			}
			tableload.selfassignableroles = array;
		} else {
			array.push(client.guilds.get(req.user.guilds[index].id).roles.find('name', newselfassignableroles).id);
			tableload.selfassignableroles = array;
		}

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated self-assignable roles!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/generalsettings`,
			query: {
				"submitgeneralsettings": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/generalsettings/submittogglexp', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		var newtogglexp = req.body.newtogglexp;
		var array = [];
		const tableload = client.guildconfs.get(dashboardid);

		if (Array.isArray(newtogglexp)) {
			for (var i = 0; i < newtogglexp.length; i++) {
				array.push(client.guilds.get(req.user.guilds[index].id).channels.find('name', newtogglexp[i]).id);
			}
			tableload.togglexp.channelids = array;
		} else {
			array.push(client.guilds.get(req.user.guilds[index].id).channels.find('name', newtogglexp).id);
			tableload.togglexp.channelids = array;
		}

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated togglexp-channels!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/generalsettings`,
			query: {
				"submitgeneralsettings": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/generalsettings/submitbyemsg', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		var newbyemsg = req.body.newbyemsg;

		const tableload = client.guildconfs.get(dashboardid);

		tableload.byemsg = newbyemsg;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Changed the bye message!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/generalsettings`,
			query: {
				"submitgeneralsettings": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/generalsettings/submitwelcomemsg', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		var newwelcomemsg = req.body.newwelcomemsg;

		const tableload = client.guildconfs.get(dashboardid);

		tableload.welcomemsg = newwelcomemsg;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Changed the welcome message!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/generalsettings`,
			query: {
				"submitgeneralsettings": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/generalsettings/submitprefix', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		var newprefix = req.body.newprefix;

		const tableload = client.guildconfs.get(dashboardid);

		tableload.prefix = newprefix;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}
		tableload.globallogs.push({
			action: `Changed the prefix of the bot!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/generalsettings`,
			query: {
				"submitgeneralsettings": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/generalsettings/submitlanguage', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		var newlanguage = req.body.newlanguage;

		const tableload = client.guildconfs.get(dashboardid);

		tableload.language = newlanguage;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Changed the language of the bot!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/generalsettings`,
			query: {
				"submitgeneralsettings": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/generalsettings', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers") //res.redirect('../botnotonserver');

		req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).members.size;
		req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'online').length;
		req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'dnd').length;
		req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'idle').length;
		req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'offline').length;

		req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

		req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

		req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

		req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

		req.user.guilds[index].welcomemsg = client.guildconfs.get(req.user.guilds[index].id).welcomemsg;
		req.user.guilds[index].byemsg = client.guildconfs.get(req.user.guilds[index].id).byemsg;

		var channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();

		const tableload = client.guildconfs.get(req.user.guilds[index].id);
		if (tableload.togglexp) {
			for (var i = 0; i < channels.length; i++) {
				if (tableload.togglexp.channelids.includes(channels[i].id)) {
					channels[i].togglexpset = true;
				}
			}
		}
		var roles = client.guilds.get(req.user.guilds[index].id).roles.filter(r => r.name !== '@everyone').array();

		var check = req.user.guilds[index];
		for (var index2 = 0; index2 < roles.length; index2++) {
			if (tableload.selfassignableroles.includes(roles[index2].id)) {
				roles[index2].selfassignablerolesset = true;
			}
		}

		const languages = [{
				name: "english",
				alias: 'en'
			},
			{
				name: "german",
				alias: "ge"
			},
			{
				name: 'french',
				alias: 'fr'
			}
		];

		if (tableload.language) {
			for (var index3 = 0; index3 < languages.length; index3++) {
				if (tableload.language === languages[index3].alias) {
					languages[index3].set = true;
				}
			}
		}

		return res.render('dashboardgeneralsettings', {
			user: req.user,
			guilds: check,
			client: client,
			channels: channels,
			roles: roles,
			languages: languages,
			submitgeneralsettings: req.query.submitgeneralsettings ? true : false
		});
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/logs/submitlogs', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		for (var i = 0; i < Object.keys(req.body).length; i++) {
			if (Object.keys(req.body)[i].endsWith('channel')) {
				tableload[Object.keys(req.body)[i]] = client.guilds.get(dashboardid).channels.find('name', `${req.body[Object.keys(req.body)[i]]}`).id;
				delete req.body[Object.keys(req.body)[i]];
			}
		}

		tableload[Object.keys(req.body)[0]] = req.body[Object.keys(req.body)[0]];

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}
		tableload.globallogs.push({
			action: `Changed the ${Object.keys(req.body)[0]} settings!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/logs`,
			query: {
				"submitlogs": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/logs', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers") //res.redirect('../botnotonserver');

		req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).members.size;
		req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'online').length;
		req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'dnd').length;
		req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'idle').length;
		req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'offline').length;

		req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

		req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

		req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

		req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

		var channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
		var check = req.user.guilds[index];

		const tableload = client.guildconfs.get(dashboardid);
		const confs = {};
		if (tableload) {
			for (var i = 0; i < channels.length; i++) {
				if (channels[i].id === tableload.modlogchannel) {
					channels[i].modlogset = true;
					if (tableload.modlog === 'true') {
						confs.modlogset = true;
					}
				}

				if (channels[i].id === tableload.chatfilterlogchannel) {
					channels[i].chatfilterset = true;
					if (tableload.chatfilterlog === 'true') {
						confs.chatfilterset = true;
					}
				}

				if (channels[i].id === tableload.messagedeletelogchannel) {
					channels[i].messagedeleteset = true;
					if (tableload.messagedeletelog === 'true') {
						confs.messagedeleteset = true;
					}
				}

				if (channels[i].id === tableload.messageupdatelogchannel) {
					channels[i].messageupdateset = true;
					if (tableload.messageupdatelog === 'true') {
						confs.messageupdateset = true;
					}
				}

				if (channels[i].id === tableload.channelupdatelogchannel) {
					channels[i].channelupdateset = true;
					if (tableload.channelupdatelog === 'true') {
						confs.channelupdateset = true;
					}
				}

				if (channels[i].id === tableload.channelcreatelogchannel) {
					channels[i].channelcreateset = true;
					if (tableload.channeldeletelog === 'true') {
						confs.channelcreateset = true;
					}
				}

				if (channels[i].id === tableload.channeldeletelogchannel) {
					channels[i].channeldeleteset = true;
					if (tableload.channeldeletelog === 'true') {
						confs.channeldeleteset = true;
					}
				}

				if (channels[i].id === tableload.memberupdatelogchannel) {
					channels[i].memberupdateset = true;
					if (tableload.memberupdatelog === 'true') {
						confs.memberupdateset = true;
					}
				}

				if (channels[i].id === tableload.presenceupdatelogchannel) {
					channels[i].presenceupdateset = true;
					if (tableload.presenceupdatelog === 'true') {
						confs.presenceupdateset = true;
					}
				}

				if (channels[i].id === tableload.welcomelogchannel) {
					channels[i].welcomelogset = true;
					if (tableload.welcomelog === 'true') {
						confs.welcomelogset = true;
					}
				}

				if (channels[i].id === tableload.byelogchannel) {
					channels[i].byelogset = true;
					if (tableload.byelogchannel === 'true') {
						confs.byelogset = true;
					}
				}

				if (channels[i].id === tableload.rolecreatelogchannel) {
					channels[i].rolecreateset = true;
					if (tableload.rolecreatelog === 'true') {
						confs.rolecreateset = true;
					}
				}

				if (channels[i].id === tableload.roledeletelogchannel) {
					channels[i].roledeleteset = true;
					if (tableload.roledeletelog === 'true') {
						confs.roledeleteset = true;
					}
				}

				if (channels[i].id === tableload.roleupdatelogchannel) {
					channels[i].roleupdateset = true;
					if (tableload.roleupdatelog === 'true') {
						confs.roleupdateset = true;
					}
				}

				if (channels[i].id === tableload.guildupdatelogchannel) {
					channels[i].guildupdateset = true;
					if (tableload.guildupdatelog === 'true') {
						confs.guildupdateset = true;
					}
				}
			}
		}

		return res.render('dashboardlogs', {
			user: req.user,
			guilds: check,
			client: client,
			channels: channels,
			confs: confs,
			submitlogs: req.query.submitlogs ? true : false
		});
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/modules/submitmodules', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		tableload.modules[Object.keys(req.body)[0]] = `${req.body[Object.keys(req.body)[0]]}`;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Activated/Deactivated the ${Object.keys(req.body)[0]} module!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/modules`,
			query: {
				"submitmodules": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/modules', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers") //res.redirect('../botnotonserver');

		req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).members.size;
		req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'online').length;
		req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'dnd').length;
		req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'idle').length;
		req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'offline').length;

		req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

		req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

		req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

		req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

		var channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
		var check = req.user.guilds[index];

		return res.render('dashboardmodules', {
			user: req.user,
			guilds: check,
			client: client,
			channels: channels,
			submitmodules: req.query.submitmodules ? true : false
		});
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/chatfilter/submitchatfilter', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		const newchatfilter = req.body.newchatfilter;

		tableload.chatfilter.chatfilter = newchatfilter;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Activated/Deactivated the chatfilter!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/chatfilter`,
			query: {
				"submitchatfilter": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/chatfilter/submitchatfilterarray', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		var newchatfilterarray = req.body.newchatfilterarray.replace(/\s/g, '').split(',');

		for (let i = 0; i < newchatfilterarray.length; i++) {
			for (var index = 0; index < newchatfilterarray.length; index++) {
				if (newchatfilterarray[i].toLowerCase() === newchatfilterarray[index].toLowerCase() && i !== index) {
					newchatfilterarray.splice(index, 1);
				}
			}
		}

		tableload.chatfilter.array = newchatfilterarray;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated the chatfilter entries!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/chatfilter`,
			query: {
				"submitchatfilter": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/chatfilter', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers") //res.redirect('../botnotonserver');

		req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).members.size;
		req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'online').length;
		req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'dnd').length;
		req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'idle').length;
		req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'offline').length;

		req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

		req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

		req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

		req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

		var channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
		var check = req.user.guilds[index];
		var chatfilterarray = client.guildconfs.get(req.user.guilds[index].id).chatfilter ? client.guildconfs.get(req.user.guilds[index].id).chatfilter.array.join(",") : '';

		return res.render('dashboardchatfilter', {
			user: req.user,
			guilds: check,
			client: client,
			channels: channels,
			chatfilterarray: chatfilterarray,
			submitchatfilter: req.query.submitchatfilter ? true : false
		});
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/music/submitchannelblacklist', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		var newchannelblacklist = req.body.newchannelblacklist;
		var array = [];
		const tableload = client.guildconfs.get(dashboardid);

		if (Array.isArray(newchannelblacklist)) {
			for (var i = 0; i < newchannelblacklist.length; i++) {
				array.push(client.guilds.get(req.user.guilds[index].id).channels.find('name', newchannelblacklist[i]).id);
			}
			tableload.musicchannelblacklist = array;
		} else {
			array.push(client.guilds.get(req.user.guilds[index].id).channels.find('name', newchannelblacklist).id);
			tableload.musicchannelblacklist = array;
		}

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated blacklisted music-channels!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/music`,
			query: {
				"submitmusic": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/music', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers") //res.redirect('../botnotonserver');

		req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).members.size;
		req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'online').length;
		req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'dnd').length;
		req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'idle').length;
		req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'offline').length;

		req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

		req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

		req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

		req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

		var channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `voice`).array();
		var check = req.user.guilds[index];

		const tableload = client.guildconfs.get(req.user.guilds[index].id);
		if (tableload.musicchannelblacklist) {
			for (var i = 0; i < channels.length; i++) {
				if (tableload.musicchannelblacklist.includes(channels[i].id)) {
					channels[i].channelblacklistset = true;
				}
			}
		}

		return res.render('dashboardmusic', {
			user: req.user,
			guilds: check,
			client: client,
			channels: channels,
			submitmusic: req.query.submitmusic ? true : false
		});
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/application/submitdenyrole', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		const newdenyrole = req.body.newdenyrole;

		tableload.application.denyrole = client.guilds.get(dashboardid).roles.find('name', newdenyrole).id;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated the application role for rejected canidates!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/application`,
			query: {
				"submitapplication": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/application/submitrole', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		const newrole = req.body.newrole;

		tableload.application.role = client.guilds.get(dashboardid).roles.find('name', newrole).id;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated the application role for accepted canidates!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/application`,
			query: {
				"submitapplication": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/application/submitreactionnumber', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		const newreactionnumber = req.body.newreactionnumber;

		tableload.application.reactionnumber = newreactionnumber;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated application reactionnumber!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/application`,
			query: {
				"submitapplication": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/application/submitarchivechannel', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		const newarchivechannel = req.body.newarchivechannel;

		tableload.application.archivechannellog = client.guilds.get(dashboardid).channels.find('name', newarchivechannel).id;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated the application archive channel!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/application`,
			query: {
				"submitapplication": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/application/submitarchive', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		const newarchive = req.body.newarchive;

		tableload.application.archivechannel = newarchive;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Activated/Deactivated application archive!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/application`,
			query: {
				"submitapplication": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/application/submitvotechannel', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		const newvotechannel = req.body.newvotechannel;

		tableload.application.votechannel = client.guilds.get(dashboardid).channels.find('name', newvotechannel).id;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Updated the application votechannel!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/application`,
			query: {
				"submitapplication": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/application/submitapplication', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const tableload = client.guildconfs.get(dashboardid);

		const newapplication = req.body.newapplication;

		tableload.application.status = newapplication;

		if (!tableload.globallogs) {
			tableload.globallogs = [];
			client.guildconfs.set(dashboardid, tableload);
		}

		tableload.globallogs.push({
			action: `Activated/Deactivated the application system!`,
			username: req.user.username,
			date: Date.now(),
			showeddate: new Date().toUTCString()
		});

		await client.guildconfs.set(dashboardid, tableload);

		res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/application`,
			query: {
				"submitapplication": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/application', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 8) !== 8) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers") //res.redirect('../botnotonserver');

		req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).members.size;
		req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'online').length;
		req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'dnd').length;
		req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'idle').length;
		req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'offline').length;

		req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

		req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

		req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

		req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

		req.user.guilds[index].reactionnumber = client.guildconfs.get(req.user.guilds[index].id).application.reactionnumber;

		var channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
		var check = req.user.guilds[index];

		const tableload = client.guildconfs.get(dashboardid);
		if (tableload.application) {
			for (var i = 0; i < channels.length; i++) {
				if (tableload.application.votechannel === channels[i].id) {
					channels[i].votechannelset = true;
				}
				if (tableload.application.archivechannellog === channels[i].id) {
					channels[i].archivechannelset = true;
				}
			}
		}

		var roles = client.guilds.get(req.user.guilds[index].id).roles.filter(r => r.name !== '@everyone').array();
		if (tableload.application) {
			for (var i2 = 0; i2 < roles.length; i2++) {
				if (tableload.application.role === roles[i2].id) {
					roles[i2].roleset = true;
				}
				if (tableload.application.denyrole === roles[i2].id) {
					roles[i2].denyroleset = true;
				}
			}
		}

		return res.render('dashboardapplication', {
			user: req.user,
			guilds: check,
			client: client,
			channels: channels,
			roles: roles,
			submitapplication: req.query.submitapplication ? true : false
		});
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/tickets/:ticketid/submitticketanswer', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 6) !== 6) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const botconfs = await client.botconfs.get('botconfs');
		if (botconfs.tickets[req.params.ticketid] === undefined) return res.redirect('../404error')

		var check = req.user.guilds[index];

		var ticket = botconfs.tickets[req.params.ticketid];

		const length = Object.keys(ticket.answers).length + 1;

		req.body.newticketanswer = req.body.newticketanswer.replace(/(?:\r\n|\r|\n)/g, "\n");

		ticket.answers[length] = {
			authorid: req.user.id,
			guildid: req.params.id,
			date: new Date(),
			content: req.body.newticketanswer,
			timelineconf: "timeline-inverted"
		}

		await client.botconfs.set('botconfs', botconfs);

		try {
			const tableload = client.guildconfs.get(dashboardid);
			const lang = require(`./languages/${tableload.language}.json`)
			const newanswer = lang.mainfile_newanswer.replace('%link', `https://lenoxbot.com/tickets/${ticket.ticketid}/overview`)
			client.users.get(ticket.authorid).send(newanswer);
		} catch (error) {
			undefined;
		}

		return res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`,
			query: {
				"submitticketanswer": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.post('/dashboard/:id/tickets/:ticketid/submitnewticketstatus', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 6) !== 6) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const botconfs = await client.botconfs.get('botconfs');
		if (botconfs.tickets[req.params.ticketid] === undefined) return res.redirect('../404error')

		var check = req.user.guilds[index];

		var ticket = botconfs.tickets[req.params.ticketid];

		if (ticket.status === req.body.newstatus) return res.redirect(`/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`)

		ticket.status = req.body.newstatus;

		const length = Object.keys(ticket.answers).length + 1;

		if (ticket.status === 'closed') {
			ticket.answers[length] = {
				authorid: req.user.id,
				date: new Date(),
				content: `${client.users.get(req.user.id) ? client.users.get(req.user.id).tag : req.user.id} closed the ticket!`,
				timelineconf: "timeline-inverted"
			};
		} else if (ticket.status === 'open') {
			ticket.answers[length] = {
				authorid: req.user.id,
				date: new Date(),
				content: `${client.users.get(req.user.id) ? client.users.get(req.user.id).tag : req.user.id} opened the ticket!`,
				timelineconf: "timeline-inverted"
			};
		}

		await client.botconfs.set('botconfs', botconfs);

		try {
			const tableload = client.guildconfs.get(dashboardid);
			const lang = require(`./languages/${tableload.language}.json`)
			const statuschange = lang.mainfile_statuschange.replace('%status', ticket.status).replace('%link', `https://lenoxbot.com/tickets/${ticket.ticketid}/overview`)
			client.users.get(ticket.authorid).send(statuschange);
		} catch (error) {
			undefined;
		}

		return res.redirect(url.format({
			pathname: `/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`,
			query: {
				"submitnewticketstatus": true
			}
		}));
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/tickets/:ticketid/overview', async function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 6) !== 6) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers");

		const botconfs = await client.botconfs.get('botconfs');
		if (botconfs.tickets[req.params.ticketid] === undefined) return res.redirect('../404error')

		var check = req.user.guilds[index];

		var ticket = botconfs.tickets[req.params.ticketid];

		botconfs.tickets[req.params.ticketid].newdate = moment(botconfs.tickets[req.params.ticketid].date).format('MMMM Do YYYY, h:mm:ss a')

		botconfs.tickets[req.params.ticketid].author = client.users.get(botconfs.tickets[req.params.ticketid].authorid) ? client.users.get(botconfs.tickets[req.params.ticketid].authorid).tag : botconfs.tickets[req.params.ticketid].authorid;

		for (var index in ticket.answers) {
			ticket.answers[index].author = client.users.get(ticket.answers[index].authorid) ? client.users.get(ticket.answers[index].authorid).tag : ticket.answers[index].authorid;
			ticket.answers[index].newdate = moment(ticket.answers[index].date).format('MMMM Do YYYY, h:mm:ss a')
		}

		return res.render('dashboardticket', {
			user: req.user,
			guilds: check,
			client: client,
			ticket: ticket,
			answers: Object.keys(botconfs.tickets[req.params.ticketid].answers).length === 0 ? false : botconfs.tickets[req.params.ticketid].answers,
			status: botconfs.tickets[req.params.ticketid].status === 'open' ? true : false
		});
	} else {
		res.redirect('../nologin');
	}
});

app.get('/dashboard/:id/tickets', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11, 18);
	if (req.user) {
		var index = -1;
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (req.user.guilds[i].id === dashboardid) {
				index = i;
			}
		}

		if (index === -1) return res.redirect("../servers");
		if (((req.user.guilds[index].permissions) & 6) !== 6) return res.redirect('../servers');
		if (!client.guilds.get(req.user.guilds[index].id)) return res.redirect("../servers") //res.redirect('../botnotonserver');

		req.user.guilds[index].memberscount = client.guilds.get(req.user.guilds[index].id).members.size;
		req.user.guilds[index].membersonline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'online').length;
		req.user.guilds[index].membersdnd = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'dnd').length;
		req.user.guilds[index].membersidle = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'idle').length;
		req.user.guilds[index].membersoffline = client.guilds.get(req.user.guilds[index].id).members.filterArray(m => m.presence.status === 'offline').length;

		req.user.guilds[index].channelscount = client.guilds.get(req.user.guilds[index].id).channels.size;

		req.user.guilds[index].rolescount = client.guilds.get(req.user.guilds[index].id).roles.size;

		req.user.guilds[index].ownertag = client.guilds.get(req.user.guilds[index].id).owner.user.tag;

		req.user.guilds[index].prefix = client.guildconfs.get(req.user.guilds[index].id).prefix;

		req.user.guilds[index].reactionnumber = client.guildconfs.get(req.user.guilds[index].id).application.reactionnumber;

		var channels = client.guilds.get(req.user.guilds[index].id).channels.filter(textChannel => textChannel.type === `text`).array();
		var check = req.user.guilds[index];

		const botconfs = client.botconfs.get('botconfs');
		const newobject = {}
		const oldobject = {}

		for (var index in botconfs.tickets) {
			if (botconfs.tickets[index].guildid === dashboardid && botconfs.tickets[index].status === 'open') {
				newobject[index] = botconfs.tickets[index]
				botconfs.tickets[index].author = client.users.get(botconfs.tickets[index].authorid).tag;
				botconfs.tickets[index].newdate = moment(botconfs.tickets[index].date).format('MMMM Do YYYY, h:mm:ss a')
			}
			if (botconfs.tickets[index].guildid === dashboardid && botconfs.tickets[index].status === 'closed') {
				oldobject[index] = botconfs.tickets[index]
				botconfs.tickets[index].author = client.users.get(botconfs.tickets[index].authorid).tag;
				botconfs.tickets[index].newdate = moment(botconfs.tickets[index].date).format('MMMM Do YYYY, h:mm:ss a')
			}
		}

		return res.render('dashboardtickets', {
			user: req.user,
			guilds: check,
			client: client,
			ticketszero: Object.keys(newobject).length === 0 ? false : true,
			tickets: newobject,
			ticketszeroold: Object.keys(oldobject).length === 0 ? false : true,
			oldtickets: oldobject
		});
	} else {
		res.redirect('../nologin');
	}
});

app.get('/404error', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				check.push(req.user.guilds[i]);
			}
		}
	}

	res.render('404error', {
		user: req.user,
		guilds: check,
		client: client
	});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	res.redirect('../404error');
});

function checkAuth(req, res, next) {
	if (req.isAuthenticated()) return console.log('Logged in');
	res.send('not logged in :(');
};