const { Type, util: { isFunction } } = require('klasa');
const { RoleStore } = require('discord.js');
const axios = require('axios');
const fetch = require('node-fetch');
const got = require('got');

const parseArgs = (args, options) => {
	if (!options) { return args; }
	if (typeof options === 'string') { options = [options]; }

	const optionValues = {};

	let i;
	for (i = 0; i < args.length; i++) {
		const arg = args[i];
		if (!arg.startsWith('--')) {
			break;
		}

		const label = arg.substr(1);

		if (args.indexOf(`${label}:`) > -1) {
			const leftover = args.slice(i + 1).join(' ');
			const matches = leftover.match(/^"(.+?)"/);
			if (matches) {
				optionValues[label] = matches[1];
				i += matches[0].split(' ').length;
			} else {
				i++;
				optionValues[label] = args[i];
			}
		} else if (args.indexOf(label) > -1) {
			optionValues[label] = true;
		} else {
			break;
		}
	}

	return {
		options: optionValues,
		leftover: args.slice(i)
	};
};

const multiSend = (channel, messages, delay) => {
	delay = delay || 100;
	messages.forEach((m, i) => {
		setTimeout(() => {
			channel.send(m);
		}, delay * i);
	});
};


const sendLarge = (channel, largeMessage, status = '', options = {}) => {
	let message = largeMessage;
	const messages = [];
	const prefix = options.prefix || '';
	const suffix = options.suffix || '';
	const max = 2000 - prefix.length - suffix.length;
	while (message.length >= max) {
		let part = message.substr(0, max);
		let cutTo = max;
		if (options.cutOn) {
			/*
			 Prevent infinite loop where lastIndexOf(cutOn) is the first char in `part`
			 Later, we will correct by +1 since we did lastIndexOf on all but the first char in `part`
			 We *dont* correct immediately, since if cutOn is not found, cutTo will be -1, and we dont want that
			 to become 0
			 */
			cutTo = part.slice(1).lastIndexOf(options.cutOn);

			// Prevent infinite loop when cutOn isnt found in message
			if (cutTo === -1) {
				cutTo = max;
			} else {
				// Correction necessary from a few lines above
				cutTo += 1;

				if (options.cutAfter) {
					cutTo += 1;
				}
				part = part.substr(0, cutTo);
			}
		}
		messages.push(status + prefix + part + suffix);
		message = message.substr(cutTo);
	}

	if (message.length > 1) {
		messages.push(status + prefix + message + suffix);
	}

	multiSend(channel, messages, options.delay);
};

const hastebinUpload = async (data, language = 'js') => {
	const key = await fetch('https://hastebin.com/documents', {
		method: 'POST',
		body: data
	}).then(response => response.json()).then(body => body.key);
	return `https://hastebin.com/${key}.${language}`;
};

const mystbinUpload = async (data, language = 'js') => {
	const key = await fetch('https://mystb.in/documents', {
		method: 'POST',
		body: data
	}).then(response => response.json()).then(body => body.key);
	return `https://mystb.in/${key}.${language}`;
};

const ixUpload = evalResult => got('http://ix.io', { body: { 'f:1': evalResult }, form: true }).then(response => {
	if (response && response.body) {
		return {
			success: true,
			url: response.body,
			rawUrl: response.body
		};
	}
	return {
		success: false
	};
});

const formURLEncoded = data => Object.keys(data).reduce((url, key) => `${url}&${key}=${encodeURIComponent(data[key])}`, '');
const fileioUpload = async data => {
	const link = await axios({
		method: 'POST',
		url: 'https://file.io',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: formURLEncoded({
			text: data
		})
	}).then(res => res.data.link).catch(e => {
		throw e;
	});
	return link;
};

module.exports = {
	// Additional argument parsing
	parseArgs,
	multiSend,
	sendLarge,
	// Text uploading
	hastebinUpload,
	mystbinUpload,
	ixUpload,
	fileioUpload
};
