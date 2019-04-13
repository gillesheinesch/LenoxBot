const LenoxCommand = require('../LenoxCommand.js');

module.exports = class joinCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'join',
			group: 'utility',
			memberName: 'join',
			description: 'Join a self-assignable role',
			format: 'join {rolename}',
			aliases: [],
			examples: ['join Member'],
			clientpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES'],
			userpermissions: [],
			shortDescription: 'Selfassignableroles',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const args = msg.content.split(' ').slice(1);

		const addedrole = args.slice().join(' ');
		const foundRole = msg.message.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());
		const author = await msg.message.guild.fetchMember(msg.author.id);
		const channelID = msg.message.channel.id;

		if (addedrole.length < 1) return msg.reply(lang.join_noinput);
		if (!foundRole) return msg.reply(lang.join_rolenotexist);
		if (msg.member.roles.has(foundRole.id)) return msg.reply(lang.join_alreadyhave);

		const selfAssignableRoles = msg.client.provider.getGuild(msg.message.guild.id, 'selfassignableroles', '[]');
		for (let i = 0; i < selfAssignableRoles.length; i++) {
			if (foundRole.id === selfAssignableRoles[i]) {
				try {
					return author.addRole(foundRole).then(m => m.guild.channels.get(channelID).send(lang.join_roleassigned));
				} catch (error) {
					return msg.channel.send(lang.join_nopermission);
				}
			}
		}
		return msg.reply(lang.join_notwhitelisted);
	}
};
