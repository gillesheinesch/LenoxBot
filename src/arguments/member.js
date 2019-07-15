// Copyright (c) 2018-2019 BannerBomb. All rights reserved. MIT license.
const { Argument, Type } = require('klasa');

module.exports = class extends Argument {
	async run(arg, possible, message) {
		const items = [...await this._get_member(message, arg)];
		let member = null;
		if (items.length) {
			if (items.length > 6) items.splice(6, items.length); // splice the array to 6 items
			let results = '';
			let i = 0;
			await items.map(item => results += `\n${++i}. ${item} \`[${item.id}]\`${item.parent ? ` \`[${item.parent.name}]\`` : ''} \`[${new Type(item).is.replace('KlasaMember', 'GuildMember')}]\``);
			if (items.length > 1) {
				await message.prompt({
					embed: {
						color: 0x43B581,
						description: message.language.get('MULTIPLE_ITEMS_FOUND_PROMPT', results)
					}
				}).then(choices => {
					if (choices.content.toLowerCase() === message.language.get('ANSWER_CANCEL_PROMPT') || !parseInt(choices.content)) return message.sendLocale('MESSAGE_PROMPT_CANCELLED');
					if (parseInt(choices.content) - 1 < 0 || parseInt(choices.content) - 1 > items.length - 1) return message.sendLocale('MESSAGE_PROMPT_CANCELLED');
					member = items[parseInt(choices.content) - 1];
				}).catch(console.error);
			} else if (items.length === 1) {
				member = items[0];
			}
			if (member) return member;
		}
		throw message.language.get('RESOLVER_INVALID_MEMBER', possible.name);
	}

	async _get_member(message, search) {
		if (RegExp(/(<@!?(\d{17,19})>)/g).test(search.toString())) search = search.replace(/(^<@!?|>$)/g, '');
		const items = [];
		const instances = [];
		const instances_type = message.guild.members.size === message.guild.memberCount;
		instances.push(instances_type ? message.guild.members : await message.guild.members.fetch());
		const member_store = new Map(...instances.filter(store => ['GuildMemberStore'].includes(new Type(store).is)));
		member_store
			.filter(member => member === search || member.toString() === search || member.user === search || member.user.toString() === search || member.id === search || member.user.tag.toString().toLowerCase().includes(search.toString().toLowerCase()) || member.displayName.toString().toLowerCase().includes(search.toString().toLowerCase()))
			.map(member => items.push(member));
		return items.filter(item => !['GuildMemberStore'].includes(new Type(item).is));
	}
};
