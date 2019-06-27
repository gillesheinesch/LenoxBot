// Copyright (c) 2018-2019 BannerBomb. All rights reserved. MIT license.
const { Argument, Type } = require('klasa');

module.exports = class extends Argument {

	async run(arg, possible, message) {
		let items = [...await this._get_user(message, arg)];
		let user = null;
		if (items.length) {
			if (items.length > 6) items.splice(6, items.length); // splice the array to 6 items
			let results = '';
			let i = 0;
			await items.map((item) => results += `\n${++i}. ${item} \`[${item.id}]\`${item.parent ? ` \`[${item.parent.name}]\`` : ''} \`[${new Type(item).is.replace('KlasaUser', 'User')}]\``);
			if (items.length > 1) {
				await message.prompt({
					embed: {
						color: 0x43B581,
						description: message.language.get('MULTIPLE_ITEMS_FOUND_PROMPT', results)
					}
				}).then((choices) => {
					if (choices.content.toLowerCase() === message.language.get('ANSWER_CANCEL_PROMPT') || !parseInt(choices.content)) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					if (parseInt(choices.content) - 1 < 0 || parseInt(choices.content) - 1 > items.length - 1) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					user = items[parseInt(choices.content) - 1];
				}).catch(console.error);
			} else if (items.length === 1) {
				user = items[0];
			}
			if (user) return user;
		}
		throw message.language.get('RESOLVER_INVALID_USER', possible.name);
	}

	async _get_user(message, search) {
		if (RegExp(/(<@!?(\d{17,19})>)/g).test(search.toString())) search = search.replace(/(^<@!?|>$)/g, '');
		const items = [];
		const instances = [];
		instances.push(this.client.users);
		const member_store = new Map(...instances.filter((store) => ['KlasaUserStore'].includes(new Type(store).is)));
		member_store
			.filter((user) => user === search || user.toString() === search || user.id === search || user.tag.toString().toLowerCase().includes(search.toString().toLowerCase()))
			.map((user) => items.push(user));
		return items.filter((item) => !['KlasaUserStore'].includes(new Type(item).is));
	}
};