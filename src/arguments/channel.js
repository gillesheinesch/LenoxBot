// Copyright (c) 2018-2019 BannerBomb. All rights reserved. MIT license.
const { Argument, Type, util: { isFunction } } = require('klasa');

module.exports = class extends Argument {
	async run(arg, possible, message) {
		const items = [...await this._get_channel(message, arg)];
		let channel = null;
		if (items.length) {
			if (items.length > 6) items.splice(6, items.length); // splice the array to 6 items
			let results = '';
			let i = 0;
			await items.map(item => results += `\n${++i}. ${item} \`[${item.id}]\`${item.parent ? ` \`[${item.parent.name}]\`` : ''} \`[${new Type(item).is}]\``);
			if (items.length > 1) {
				await message.prompt({
					embed: {
						color: 0x43B581,
						description: message.language.get('MULTIPLE_ITEMS_FOUND_PROMPT', results)
					}
				}).then(choices => {
					if (choices.content.toLowerCase() === message.language.get('ANSWER_CANCEL_PROMPT') || !parseInt(choices.content)) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					if (parseInt(choices.content) - 1 < 0 || parseInt(choices.content) - 1 > items.length - 1) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					channel = items[parseInt(choices.content) - 1];
				}).catch(console.error);
			} else if (items.length === 1) {
				channel = items[0];
			}
			if (channel) return channel;
		}
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

	async _get_channel(message, search) {
		if (RegExp(/(<#(\d{17,19})>)/g).test(search.toString())) search = search.replace(/(^<#|>$)/g, '');
		const items = [];
		const instances = [];
		const command = message.command;
		instances.push((command.guildOnlyArgs && Array.isArray(command.guildOnlyArgs) && command.guildOnlyArgs.length && (command.guildOnlyArgs.includes('channel') || command.guildOnlyArgs.includes('channels'))) ? message.guild.channels : this.client.channels);
		const channel_store = new Map(...instances.filter(store => ['GuildChannelStore', 'ChannelStore'].includes(new Type(store).is)));
		channel_store
			.filter(channel => (!command.show_hidden_channels && isFunction(channel.permissionsFor) && channel.permissionsFor(message.author) ? channel.permissionsFor(message.author).has('VIEW_CHANNEL') : (!isFunction(channel.permissionsFor) || !channel.permissionsFor(message.author) || (channel.permissionsFor(message.author).has('VIEW_CHANNEL') || !channel.permissionsFor(message.author).has('VIEW_CHANNEL')))) && (command.get_channel_types && Array.isArray(command.get_channel_types) && command.get_channel_types.length ? command.get_channel_types : ['voice', 'text', 'category']).includes(channel.type) && (channel === search || channel.toString() === search || channel.id === search || channel.name.toLowerCase().includes(search.toLowerCase())))
			.map(channel => items.push(channel));
		return items.filter(item => !['GuildChannelStore', 'ChannelStore'].includes(new Type(item).is));
	}
};
