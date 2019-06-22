const Discord = require('discord.js');
const settings = require('./settings.json');
const chalk = require('chalk');

const shardingManager = new Discord.ShardingManager('./lenoxbot.js', {
	token: settings.token
});

shardingManager.spawn().then(() => {
	console.log(chalk.green(`[ShardManager] Started ${shardingManager.totalShards} shards`));
}).catch(error => {
	console.log(error);
});

// Website:
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-discord').Strategy;
const handlebars = require('express-handlebars');
const handlebarshelpers = require('handlebars-helpers')();
const i18n = require('i18n');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

async function run() {
	const app = express();
	const routes = require('./server/routes');

	app.set('port', settings.websiteport);
	app.set('hostname', settings.websitehostname);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		limit: '50mb',
		extended: false
	}));
	app.use(cookieParser());

	app.engine('handlebars', handlebars({
		defaultLayout: 'main',
		layoutsDir: `./views/layouts`,
		helpers: handlebarshelpers
	}));
	app.set('views', './views');
	app.set('view engine', 'handlebars');

	i18n.configure({
		locales: ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'de-CH'],
		directory: `${__dirname}/languages`,
		defaultLocale: 'en-US',
		cookie: 'ulang'
	});
	app.use(i18n.init);

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

	// Set up routes
	routes.init(app);

	const hostname = app.get('hostname');
	const port = app.get('port');

	app.listen(port, () => {
		console.log(`Website server listening on - http://${hostname}:${port}`);
	});
}

run().catch(error => {
	console.log(error);
});
