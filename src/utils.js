const { Type, util: { isFunction } } = require('klasa');
const { RoleStore } = require('discord.js');
const axios = require('axios');
const fetch = require('node-fetch');
const got = require('got');

const parseArgs = (args, options) => {
	if (!options)
		return args;
	if (typeof options === 'string')
		options = [options];

	let optionValues = {};

	let i;
	for (i = 0; i < args.length; i++) {
		let arg = args[i];
		if (!arg.startsWith('--')) {
			break;
		}

		let label = arg.substr(1);

		if (args.indexOf(label + ':') > -1) {
			let leftover = args.slice(i + 1).join(' ');
			let matches = leftover.match(/^"(.+?)"/);
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
	let messages = [];
	let prefix = options.prefix || '';
	let suffix = options.suffix || '';
	let max = 2000 - prefix.length - suffix.length;
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
	}).then((response) => response.json()).then((body) => body.key);
	return `https://hastebin.com/${key}.${language}`;
};

const mystbinUpload = async (data, language = 'js') => {
	const key = await fetch('https://mystb.in/documents', {
		method: 'POST',
		body: data
	}).then((response) => response.json()).then((body) => body.key);
	return `https://mystb.in/${key}.${language}`;
};

const ixUpload = (evalResult) => {
	return got('http://ix.io', { body: { 'f:1': evalResult }, form: true }).then((response) => {
		if (response && response.body) {
			return {
				success: true,
				url: response.body,
				rawUrl: response.body
			};
		} else {
			return {
				success: false
			};
		}
	});
};

const formURLEncoded = (data) => Object.keys(data).reduce((url, key) => `${url}&${key}=${encodeURIComponent(data[key])}`, '');
const fileioUpload = async (data) => {
	const link = await axios({
		method: 'POST',
		url: 'https://file.io',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: formURLEncoded({
			'text': data
		})
	}).then((res) => res.data.link).catch((e) => {
		throw e;
	});
	return link;
}

const get_instances = async (message, search, { show_hidden, get_types, guild_only, channel_types } = { show_hidden: true, get_types: [], guild_only: [], channel_types: [] }) => {
	/**
	 * show_hidden: Boolean - Includes hidden channels
	 * get_types: Array - The type of classes to fetch example 'Users','Channels','Roles'
	 * guild_only: Array - The types that should be fetched only from the current guild
	 * channel_types: Array - The channel types to include in the search (Defaults to all)
	 */
	try {
		let backup_get_types = get_types;
		if (RegExp(/(<@!?(\d{17,19})>)/g).test(search.toString())) search = search.replace(/(^<@!?|>$)/g, '');
		if (RegExp(/(<@&(\d{17,19})>)/g).test(search.toString())) search = search.replace(/(^<@&|>$)/g, '');
		if (RegExp(/(<#(\d{17,19})>)/g).test(search.toString())) search = search.replace(/(^<#|>$)/g, '');
		if (RegExp(/(<a?:\w{2,32}:\d{17,19}>)/g).test(search.toString())) search = search.replace(/(^<a?:\w{2,32}:|>$)/g, '');
		if (((backup_get_types.includes('channel') || backup_get_types.includes('channels')) && message.flags['channel'] || message.flags['channels']) || ((backup_get_types.includes('member') || backup_get_types.includes('members') || backup_get_types.includes('user') || backup_get_types.includes('users')) && message.flags['member'] || message.flags['members'] || message.flags['user'] || message.flags['users']) || ((backup_get_types.includes('role') || backup_get_types.includes('roles')) && message.flags['role'] || message.flags['roles']) || ((backup_get_types.includes('emoji') || backup_get_types.includes('emojis')) && message.flags['emoji'] || message.flags['emojis']) || ((backup_get_types.includes('all')) && message.flags['all'])) get_types = [];
		if ((backup_get_types.includes('channel') || backup_get_types.includes('channels')) && !message.flags['all'] && (message.flags['channel'] || message.flags['channels'])) get_types.push('channels');
		if ((backup_get_types.includes('channel') || backup_get_types.includes('channels')) && message.flags['all'] || message.flags['text'] || message.flags['textchannel'] || message.flags['textchannels'] || message.flags['category'] || message.flags['categories'] || message.flags['voice'] || message.flags['voicechannel'] || message.flags['voicechannels']) channel_types = [];
		if ((backup_get_types.includes('channel') || backup_get_types.includes('channels') || backup_get_types.includes('all')) && !message.flags['all'] && (message.flags['text'] || message.flags['textchannel'] || message.flags['textchannels'])) channel_types.push('text');
		if ((backup_get_types.includes('channel') || backup_get_types.includes('channels') || backup_get_types.includes('all')) && !message.flags['all'] && (message.flags['category'] || message.flags['categories'])) channel_types.push('category');
		if ((backup_get_types.includes('channel') || backup_get_types.includes('channels') || backup_get_types.includes('all')) && !message.flags['all'] && (message.flags['voice'] || message.flags['voicechannel'] || message.flags['voicechannels'])) channel_types.push('voice');
		if ((backup_get_types.includes('member') || backup_get_types.includes('members') || backup_get_types.includes('user') || backup_get_types.includes('users') || backup_get_types.includes('all')) && !message.flags['all'] && (message.flags['member'] || message.flags['members'] || message.flags['user'] || message.flags['users'])) get_types.push('members');
		if ((backup_get_types.includes('role') || backup_get_types.includes('roles') || backup_get_types.includes('all')) && !message.flags['all'] && (message.flags['role'] || message.flags['roles'])) get_types.push('roles');
		if ((backup_get_types.includes('emoji') || backup_get_types.includes('emojis') || backup_get_types.includes('all')) && !message.flags['all'] && (message.flags['emoji'] || message.flags['emojis'])) get_types.push('emojis');
		if (backup_get_types.includes('all') && message.flags['all']) {
			get_types.push('all');
			channel_types.push('all');
		}
		if (message.author === global.client.owner) {
			if (message.flags['guild-channels'] || message.flags['guildChannels'] || message.flags['guild-members'] || message.flags['guildMembers'] || message.flags['guild-roles'] || message.flags['guildRoles'] || message.flags['guild-all'] || message.flags['guildAll']) guild_only = ['none'];
			if (!message.flags['guild-all'] && !message.flags['guildAll']) {
				if (message.flags['guild-channels'] || message.flags['guildChannels']) guild_only.push('channels');
				if (message.flags['guild-members'] || message.flags['guildMembers']) guild_only.push('members');
				if (message.flags['guild-roles'] || message.flags['guildRoles']) guild_only.push('roles');
				if (message.flags['guild-emojis'] || message.flags['guildEmojis']) guild_only.push('emojis');
			} else {
				if (message.flags['guild-all'] || message.flags['guildAll']) guild_only.push('all');
			}
		}

		const items = [];
		const instances = [];
		let instances_type = false;
		const channels_guild_only = RegExp(['all', 'channel', 'channels'].join('|')).test(guild_only.join(' '));
		const roles_guild_only = RegExp(['all', 'role', 'roles'].join('|')).test(guild_only.join(' '));
		const users_guild_only = RegExp(['all', 'member', 'members', 'user', 'users'].join('|')).test(guild_only.join(' '));
		const emojis_guild_only = RegExp(['all', 'emoji', 'emojis'].join('|')).test(guild_only.join(' '));
		const type_get_member = RegExp(['all', 'member', 'members', 'user', 'users'].join('|')).test(get_types.join(' '));
		const type_get_channel = RegExp(['all', 'channel', 'channels'].join('|')).test(get_types.join(' '));
		const type_get_role = RegExp(['all', 'role', 'roles'].join('|')).test(get_types.join(' '));
		const type_get_emoji = RegExp(['all', 'emoji', 'emojis'].join('|')).test(get_types.join(' '));
		if (!channels_guild_only && !roles_guild_only && !users_guild_only && !emojis_guild_only) {
			instances.push(...[global.client.users, global.client.channels, global.client.emojis, new RoleStore(message.channel, global.client.guilds.map((guild) => guild.roles.array()).flat())]);
		} else {
			instances.push(channels_guild_only ? message.guild.channels : global.client.channels);
			instances.push(roles_guild_only ? await message.guild.roles.fetch() : new RoleStore(message.channel, global.client.guilds.map((guild) => guild.roles.array()).flat()));
			if (users_guild_only) {
				instances_type = message.guild.members.size === message.guild.memberCount;
				instances.push(instances_type ? message.guild.members : await message.guild.members.fetch());
			} else {
				instances.push(global.client.users);
			}
			instances.push(emojis_guild_only ? message.guild.emojis : global.client.emojis);
		}

		if (type_get_member) {
			const member_store = new Map(...instances.filter((store) => [users_guild_only ? `${instances_type ? 'Klasa' : ''}GuildMemberStore` : 'UserStore'].includes(new Type(store).is)));
			const array_type = Array.filterDuplicates(member_store.map((item) => new Type(item).is));
			if (array_type.includes('GuildMember') || array_type.includes('KlasaMember')) {
				member_store
					.filter((member) => member === search || member.toString() === search || member.user === search || member.user.toString() === search || member.id === search || member.user.tag.toString().toLowerCase().includes(search.toString().toLowerCase()) || member.displayName.toString().toLowerCase().includes(search.toString().toLowerCase()))
					.map((member) => items.push(member));
			} else if (array_type.includes('User') || array_type.includes('KlasaUser') || array_type.includes('ClientUser')) {
				member_store
					.filter((user) => user === search || user.toString() === search || user.id === search || user.tag.toString().toLowerCase().includes(search.toString().toLowerCase()))
					.map((user) => items.push(user));
			}
		}
		if (type_get_channel) {
			const channel_store = new Map(...instances.filter((store) => ['GuildChannelStore', 'ChannelStore'].includes(new Type(store).is)));
			channel_store
				.filter((channel) => (!show_hidden && isFunction(channel.permissionsFor) && channel.permissionsFor(message.author) ? channel.permissionsFor(message.author).has('VIEW_CHANNEL') : (!isFunction(channel.permissionsFor) || !channel.permissionsFor(message.author) || (channel.permissionsFor(message.author).has('VIEW_CHANNEL') || !channel.permissionsFor(message.author).has('VIEW_CHANNEL')))) && (channel_types && channel_types.length ? channel_types : ['voice', 'text', 'category']).includes(channel.type) && (channel === search || channel.toString() === search || channel.id === search || channel.name.toLowerCase().includes(search.toLowerCase())))
				.map((channel) => items.push(channel));
		}
		if (type_get_role) {
			const role_store = new Map(...instances.filter((store) => ['RoleStore'].includes(new Type(store).is)));
			role_store
				.filter((role) => role === search || role.toString() === search || role.id === search || role.name.toLowerCase().includes(search.toLowerCase()))
				.map((role) => items.push(role));
		}
		if (type_get_emoji) {
			const emoji_store = new Map(...instances.filter((store) => ['GuildEmojiStore'].includes(new Type(store).is)));
			emoji_store
				.filter((emoji) => emoji === search || emoji.toString() === search || emoji.id === search || emoji.name.toLowerCase().includes(search.toLowerCase()))
				.map((emoji) => items.push(emoji));
		}
		if (!items.length) {
			if (message.command) {
				let instanceType = '';
				const command_usage = message.command.usage;
				const command_usageString = command_usage.usageString;
				if (command_usageString.match(/(\bTextChannel\b)/)) {
					instanceType = 'TextChannel';
				} else if (command_usageString.match(/(\bVoiceChannel\b)/)) {
					instanceType = 'VoiceChannel';
				} else if (command_usageString.match(/(\bNewsChannel\b)/)) {
					instanceType = 'NewsChannel';
				} else if (command_usageString.match(/(\bStoreChannel\b)/)) {
					instanceType = 'StoreChannel';
				} else if (command_usageString.match(/(\bGuildMember\b)/)) {
					instanceType = 'GuildMember';
				} else if (command_usageString.match(/(\bCategoryChannel\b)/)) {
					instanceType = 'CategoryChannel';
				} else if (command_usageString.match(/(\bRole\b)/)) {
					instanceType = 'Role';
				} else if (command_usageString.match(/(\bUser\b)/)) {
					instanceType = 'User';
				} else if (command_usageString.match(/(\bChannel\b)/)) {
					instanceType = 'Channel';
				} else if (command_usageString.match(/(\bGuild\b)/)) {
					instanceType = 'Guild';
				} else if (command_usageString.match(/(\bGuildEmoji\b)/)) {
					instanceType = 'GuildEmoji';
				} else if (command_usageString.match(/(\bGuildChannel\b)/)) {
					instanceType = 'GuildChannel';
				} else if (command_usageString.match(/(\bEmoji\b)/)) {
					instanceType = 'Emoji';
				} else if (command_usageString.match(/(\bBase\b)/)) {
					instanceType = 'Base';
				}
				throw `Your option didn't match any of the possibilities: (${command_usage.parsedUsage.map((usages) => usages.possibles.map((possible) => possible.name)).filter((array) => array.includes(instanceType))[0].join(', ')})`;
			} else {
				throw 'Your option didn\'t match any of the possibilities: (N/A)';
			}
		}
		
		return items.filter((item) => !['KlasaGuildMemberStore', 'GuildMemberStore', 'GuildChannelStore', 'ChannelStore', 'RoleStore', 'UserStore', 'GuildEmojiStore'].includes(new Type(item).is));
	} catch (e) {
		if (e.message) {
			if (e.message === 'Missing Access') throw 'Unknown Channel or Category.';
			else if (e.message === 'Unknown User') throw e.message;
			else throw 'Unknown Guild, Emoji or Role.';
		} else {
			throw e;
		}
	}
}

module.exports = {
	// Additional argument parsing
	parseArgs,
	multiSend,
	sendLarge,
	// Text uploading
	hastebinUpload,
	mystbinUpload,
	ixUpload,
	fileioUpload,
	// Search for discord instances
	get_instances
};