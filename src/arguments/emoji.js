// Copyright (c) 2018-2019 BannerBomb. All rights reserved. MIT license.
const { Argument, Type } = require('klasa');

module.exports = class extends Argument {
	async run(arg, possible, message) {
		const items = [...await this._get_emoji(message, arg)];
		let emoji = null;
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
					if (choices.content.toLowerCase() === message.language.get('ANSWER_CANCEL_PROMPT') || !parseInt(choices.content, 10)) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					if (parseInt(choices.content, 10) - 1 < 0 || parseInt(choices.content, 10) - 1 > items.length - 1) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					emoji = items[parseInt(choices.content, 10) - 1];
				}).catch(console.error);
			} else if (items.length === 1) {
				emoji = items[0];
			}
			if (emoji) return emoji;
		}
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

	async _get_emoji(message, search) {
		if (RegExp(/(<a?:\w{2,32}:\d{17,19}>)/g).test(search.toString())) search = search.replace(/(^<a?:\w{2,32}:|>$)/g, '');
		const items = [];
		const instances = [];
		const command = message.command;
		instances.push((command.guildOnlyArgs && Array.isArray(command.guildOnlyArgs) && command.guildOnlyArgs.length && (command.guildOnlyArgs.includes('emoji') || command.guildOnlyArgs.includes('emojis'))) ? message.guild.emojis : this.client.emojis);
		const emoji_store = new Map(...instances.filter(store => ['GuildEmojiStore'].includes(new Type(store).is)));
		emoji_store
			.filter(emoji => emoji === search || emoji.toString() === search || emoji.id === search || emoji.name.toLowerCase().includes(search.toLowerCase()))
			.map(emoji => items.push(emoji));
		return items.filter(item => !['GuildEmojiStore'].includes(new Type(item).is));
	}
};
