const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;
const fs = require('fs');
const Enmap = require('enmap');
const NewsAPI = require('newsapi');
const EnmapSQLite = require('enmap-sqlite');
const EnmapLevel = require('enmap-level');

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
const categories = ['partner', 'currency', 'botowner', 'administration', 'moderation', 'fun', 'help', 'music', 'nsfw', 'searches', 'utility', 'staff', 'application'];
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

var express = require('express'),
	session = require('express-session'),
	passport = require('passport'),
	Strategy = require('passport-discord').Strategy,
	handlebars = require('express-handlebars'),
	app = express();
const path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var database = new Enmap({
	provider: new EnmapSQLite({
		name: 'discordoauth'
	})
});

app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: [
		'public/script/',
		'public/styles/'
	]
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
	callbackURL: 'http://localhost:50451/callback',
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
		const conf = {
			userid: req.user.id,
			username: req.user.username,
			discriminator: req.user.discriminator,
			avatar: req.user.avatar,
			accessToken: req.user.accessToken
		}
		database.set(req.user.id, conf);
		res.redirect('/servers');
	}
);

app.listen(50451, function (err) {
	if (err) return console.log(err);
	console.log('Listening at http://localhost:50451/');
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
		client: client
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
		client: client
	});
});

app.get('/logout', function (req, res) {
	req.logOut();
	res.redirect('home');
});

app.get('/documentation', function (req, res, next) {
	if (req.user) {
		var check = [];
		for (var i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8) {
				check.push(req.user.guilds[i]);
			}
		}
	}

	res.render('documentation', {
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
					req.user.guilds[i].membersonline = client.guilds.get(req.user.guilds[i].id).members.filterArray(m => m.presence.status === 'online').length;
					req.user.guilds[i].membersdnd = client.guilds.get(req.user.guilds[i].id).members.filterArray(m => m.presence.status === 'dnd').length;
					req.user.guilds[i].membersidle = client.guilds.get(req.user.guilds[i].id).members.filterArray(m => m.presence.status === 'idle').length;
					req.user.guilds[i].membersoffline = client.guilds.get(req.user.guilds[i].id).members.filterArray(m => m.presence.status === 'offline').length;
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
		res.redirect('login');
	}
});

app.get('/dashboard/:id', function (req, res, next) {
	var dashboardid = res.req.originalUrl.substr(11);
	if (req.user) {
		var check = [];
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

		check.push(req.user.guilds[index]);

		return res.render('dashboard', {
			user: req.user,
			guilds: check,
			client: client
		});
	} else {
		res.redirect('../login');
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
	res.redirect('404error');
});


function checkAuth(req, res, next) {
	console.log('hello');
	if (req.isAuthenticated()) return console.log('Logged in');
	res.send('not logged in :(');
};