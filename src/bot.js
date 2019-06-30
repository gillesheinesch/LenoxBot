const { Collection } = require('discord.js');
const { Client } = require('./');
const config = require('../config.json');

global.startTime = new Date(); // start recording time of boot

Client.use(require("klasa-member-gateway"));

Client.defaultGuildSchema
	.add("joinroles", "role", { array: true })
	.add("bot", (folder) => folder
		.add("channel", "textchannel")
		.add("redirect", "boolean"))

const client = global.client = new Client({
	autoReconnect: true,
	commandEditing: true,
	commandLogging: true,
	disableEveryone: true,
	fetchAllMembers: true,
	pieceDefaults: { commands: { deletable: true } },
	presence: {
		activity: {
			name: `...Initializing`,
			type: 0
		}
	},
	consoleEvents: { verbose: true },
	prefix: '?',
	restTimeOffset: 0,
	regexPrefix: /^(?:hey |hi )?lenoxbot[,!\w]?/i,
	providers: {
		default: config.provider,
		mongodb: config.mongodb
	},
	gateways: {
		clientStorage: { provider: config.provider },
		members: { providers: config.provider }
	},
	schedule: { inerval: 1000 },
	disabledCorePieces: ["commands"],
	console: { useColor: true }
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
	}).then(() => {}).catch((e)=>{});
}, 3600000); // 1 hour

if (!client.ready) client.start();