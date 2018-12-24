const cluster = require('cluster');
const Discord = require('discord.js');
const settings = require('./settings.json');
const numCPUs = require('os').cpus().length;
const chalk = require('chalk');

if (cluster.isMaster) {
	const shardingManager = new Discord.ShardingManager('./lenoxbot.js',
		{
			token: settings.token
		});

	shardingManager.spawn(shardingManager.totalShards, 500).then(shards => {
		console.log(chalk.green(`[ShardManager] Started ${shardingManager.totalShards} shards`));
	})
		.catch(error => {
			console.log(error);
		});

	for (let i = 0; i < numCPUs; i++); {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		cluster.fork();
	});
} else {
	const express = require('express');
	const session = require('express-session');
	const passport = require('passport');
	const Strategy = require('passport-discord').Strategy;
	const handlebars = require('express-handlebars');
	const handlebarshelpers = require('handlebars-helpers')();
	const app = express();
	const url = require('url');
	const path = require('path');
	const cookieParser = require('cookie-parser');
	const bodyParser = require('body-parser');

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
}
