const LenoxCommand = require('../LenoxCommand.js');

module.exports = class removeselfassignableroleCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'removeselfassignablerole',
			group: 'administration',
			memberName: 'removeselfassignablerole',
			description: 'Remove a role that allows users to assign themselves',
			format: 'removeselfassignablerole {name of the role}',
			aliases: ['rsar'],
			examples: ['removeselfassignablerole Member'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['ADMINISTRATOR'],
			shortDescription: 'Selfassignableroles',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const addedrole = args.slice().join(' ');
		const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());

		if (addedrole.length < 1) return msg.reply(lang.removeselfassignablerole_noinput);
		if (!foundRole) return msg.reply(lang.removeselfassignablerole_rolenotexist);

		for (let i = 0; i < msg.client.provider.getGuild(msg.message.guild.id, 'selfassignableroles').length; i++) {
			if (foundRole.id === msg.client.provider.getGuild(msg.message.guild.id, 'selfassignableroles')[i]) {
				const roleId = foundRole.id;
				for (let index = 0; index < msg.client.provider.getGuild(msg.message.guild.id, 'selfassignableroles').length; index++) {
					if (roleId === msg.client.provider.getGuild(msg.message.guild.id, 'selfassignableroles')[index]) {
						const currentSelfassignableroles = msg.client.provider.getGuild(msg.message.guild.id, 'selfassignableroles');
						currentSelfassignableroles.splice(index, 1);
						await msg.client.provider.setGuild(msg.message.guild.id, 'selfassignableroles', currentSelfassignableroles);
					}
				}

				return msg.channel.send(lang.removeselfassignablerole_roleremoved);
			}
		}
		return msg.channel.send(lang.removeselfassignablerole_error);
	}
};
