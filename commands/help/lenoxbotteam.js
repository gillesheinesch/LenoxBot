const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');
const settings = require('../../settings.json');

module.exports = class lenoxbotteamCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'lenoxbotteam',
			group: 'help',
			memberName: 'lenoxbotteam',
			description: 'All LenoxBot staff members',
			format: 'lenoxbotteam',
			aliases: [],
			examples: ['lenoxbotteam'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Help',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const teamroles = ['administrator', 'developer', 'moderator', 'test-moderator', 'documentation-proofreader', 'designer', 'translation-leader', 'translation-proofreader'];

		const teamEmbed = new Discord.MessageEmbed()
			.setTitle(lang.lenoxbotteam_embedtitle)
			.setURL('https://lenoxbot.com/team')
			.setColor('BLUE')
			.setFooter(lang.lenoxbotteam_embedfooter);

		const team = [];
		for (let i = 0; i < teamroles.length; i++) {
			const teamSettings = {};
			const role = msg.client.guilds.get(settings.botMainDiscordServer).roles.find(r => r.name.toLowerCase() === teamroles[i]);

			const evaledMembersFromRole = role.members.array();

			teamSettings.roleName = role.name;
			teamSettings.roleMembers = [];

			evaledMembersFromRole.forEach(async member => {
				const fetchedUser = msg.client.users.get(member.id) ? msg.client.users.get(member.id).tag : member.id;

				teamSettings.roleMembers.push(fetchedUser);
			});
			team.push(teamSettings);
		}

		team.forEach(r => {
			teamEmbed.addField(r.roleName, r.roleMembers.join(', '));
		});

		return msg.channel.send({
			embed: teamEmbed
		});
	}
};
