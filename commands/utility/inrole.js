/**
 * TODO:
 * - Add throttling (cooldown)
 */

const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class inroleCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'inrole',
			group: 'utility',
			memberName: 'inrole',
			description: 'Allows you to see which members have a specific role',
			guarded: true,
			guildOnly: true,
			examples: ['inrole Admin'],
			clientPermissions: ['SEND_MESSAGES']
		});
	}

	run(msg) {
		const provider = msg.client.provider;

		const langSet = provider.get(msg.message.guild.id, 'language', 'en-US');
		const lang = require(`../../languages/${langSet}.json`);

		const args = msg.content.split(' ').slice(1);

		if (!args.slice().length >= 1) return msg.channel.send(lang.inrole_noinput);
		try {
			const role = msg.guild.roles.find(r => r.name.toLowerCase() === args.slice().join(' ').toLowerCase());
			const inRole = role.members.array();
			const array = [];
			inRole.forEach(element => {
				array.push(element.user.tag);
			});

			const embed = new Discord.RichEmbed()
				.setDescription(array.join(', '))
				.setColor('#ABCDEF')
				.setAuthor(`${role.name} (${lang.inrole_members} ${array.length})`);
			msg.channel.send({
				embed
			});
		} catch (error) {
			msg.channel.send(lang.inrole_rolenotexist);
		}
	}
};
