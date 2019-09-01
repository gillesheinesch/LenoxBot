/* eslint-disable no-multi-assign */
const { Collection, Permissions: { FLAGS } } = require('discord.js');
const { Client, Music: { AudioBase } } = require('./');
const config = require('../config.json');
const { constants: { MENTION_REGEX } } = require('klasa');

global.startTime = new Date(); // start recording time of boot

Client.use(require('klasa-member-gateway'));
Client.use(require('klasa-dashboard-hooks'));

Client.defaultPermissionLevels
	.add(4, ({ guild, member }) => guild && member.permissions.has(FLAGS.BAN_MEMBERS), { fetch: true });

Client.defaultClientSchema
	.add('owners', 'string', { array: true, configurable: false, filter: (__, value) => !MENTION_REGEX.snowflake.test(value) })
	.add('commandsused', 'integer', { 'default': 0 });

Client.defaultGuildSchema
	.add('music', 'any', { 'configurable': false, 'default': { queue: [], loop: false, volume: 100 } }) // new AudioBase()
	.add('music_settings', folder => folder
		.add('skip_vote', 'boolean', { 'default': false })
		.add('skip_number', 'integer', { 'default': 1 }))
	.add('joinroles', 'role', { array: true })
	.add('momentLanguage', 'string', { 'default': 'en' })
	.add('premium', folder => folder
		.add('status', 'boolean', { 'default': false, 'configurable': false }))
	.add('modules', folder => folder
		.add('utility', 'boolean', { 'default': true }))
	.add('togglexp', folder => folder
		.add('channel_ids', 'string', { array: true, filter: (__, value) => !MENTION_REGEX.snowflake.test(value) }))
	.add('xp', folder => folder
		.add('xpmessages_enabled', 'boolean', { 'default': false }))
	.add('moderations', folder => folder
		.add('modlogs_enabled', 'boolean', { 'default': false })
		.add('punishments', 'any', { array: true })
		.add('modlog_channel', 'textchannel') // { filter: (__, value) => !MENTION_REGEX.snowflake.test(value) })
	)
	.add('chatfilter', folder => folder
		.add('chatfilter_enabled', 'boolean', { 'default': false })
		.add('chatfilter_array', 'string', { array: true })
		.add('chatfilterlog_enabled', 'boolean', { 'default': false })
		.add('chatfilterlog_channel', 'textchannel'))
	.add('bot', folder => folder
		.add('channel', 'textchannel')
		.add('redirect', 'boolean'));

Client.defaultMemberSchema
	.add('scores', folder => folder
		.add('points', 'number', { 'default': 0 })
		.add('level', 'number', { 'default': 0 }));

Client.defaultUserSchema
	.add('premium', folder => folder
		.add('status', 'boolean', { 'configurable': false, 'default': false }))
	.add('stats', folder => folder
		.add('highest_credits', 'number', { 'default': 0, 'configurable': false }))
	.add('credits', 'number', { 'default': 0, 'configurable': false });

const client = global.client = new Client({
	autoReconnect: true,
	commandEditing: true,
	commandLogging: true,
	disableEveryone: true,
	fetchAllMembers: true,
	pieceDefaults: { commands: { deletable: true } },
	presence: {
		activity: {
			name: '...Initializing',
			type: 0
		}
	},
	consoleEvents: { verbose: true },
	prefix: '?',
	restTimeOffset: 0,
	regexPrefix: /^(?:hey |hi )?lenoxbot[,!\w]?/i,
	providers: {
		'default': config.provider,
		'mongodb': config.mongodb
	},
	gateways: {
		clientStorage: { provider: config.provider },
		members: { providers: config.provider }
	},
	schedule: { interval: 1000 },
	disabledCorePieces: ['commands'],
	console: { useColor: true },
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

if (!config) return; // prevent any further loading if we're prompting them.
// Add properties to the client
client.config = config;
client.shuttingDown = false;
client.utils = global.utils = require('./utils');
// Deleted message record handler
const deleted = client.deleted = new Collection();
client.setInterval(() => {
	deleted.clear();
}, 7200000);

client.setInterval(() => { // update the clients presence every set interval, because the presence does timeout.
	client.user.setPresence({
		activity: {
			name: `${client.options.prefix}help | www.lenoxbot.com`,
			type: 0
		},
		status: 'online'
	}).then(() => {}).catch(() => {});
}, 3600000); // 1 hour

if (!client.ready) client.start();
