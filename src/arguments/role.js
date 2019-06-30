// Copyright (c) 2018-2019 BannerBomb. All rights reserved. MIT license.
const { Argument, Type } = require('klasa');
const { RoleStore } = require('discord.js');

module.exports = class extends Argument {
	async run(arg, possible, message) {
		const items = [...await this._get_role(message, arg)];
		console.log(items);
		let role = null;
		if (items.length) {
			if (items.length > 6) items.splice(6, items.length); // splice the array to 6 items
			let results = '';
			let i = 0;
			try {
				await items.map(item => results += `\n${++i}. ${item} \`[${item.id}]\`${item.parent ? ` \`[${item.parent.name}]\`` : ''} \`[${new Type(item).is}]\``);
			} catch (e) {
				await items.map(item => results += `\n${++i}. <@&${item.id}> \`[${item.id}]\`${item.parent ? ` \`[${item.parent.name}]\`` : ''} \`[${new Type(item).is}]\``);
			}
			if (items.length > 1) {
				await message.prompt({
					embed: {
						color: 0x43B581,
						description: message.language.get('MULTIPLE_ITEMS_FOUND_PROMPT', results)
					}
				}).then(choices => {
					if (choices.content.toLowerCase() === message.language.get('ANSWER_CANCEL_PROMPT') || !parseInt(choices.content)) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					if (parseInt(choices.content) - 1 < 0 || parseInt(choices.content) - 1 > items.length - 1) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					role = items[parseInt(choices.content) - 1];
				}).catch(console.error);
			} else if (items.length === 1) {
				role = items[0];
			}
			if (role) return role;
		}
		throw message.language.get('RESOLVER_INVALID_ROLE', possible.name);
	}

	async _get_role(message, search) {
		if (RegExp(/(<@&(\d{17,19})>)/g).test(search.toString())) search = search.replace(/(^<@&|>$)/g, '');
		const items = [];
		const instances = [];
		const command = message.command;
		const role_guild_only = (command.guildOnlyArgs && Array.isArray(command.guildOnlyArgs) && command.guildOnlyArgs.length && (command.guildOnlyArgs.includes('role') || command.guildOnlyArgs.includes('roles'))) ? true : false;
		instances.push(role_guild_only ? await message.guild.roles.fetch() : new RoleStore(message.channel, this.client.guilds.map(guild => guild.roles.array()).flat()));
		const role_store = new Map(...instances.filter(store => ['RoleStore'].includes(new Type(store).is)));
		role_store
			.filter(role => role === search || (role_guild_only ? role.toString() : `<@&${role.id}>`) === search || role.id === search || role.name.toLowerCase().includes(search.toLowerCase()))
			.map(role => items.push(role));
		return items.filter(item => !['RoleStore'].includes(new Type(item).is));
	}
};
