const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');
const btcValue = require('btc-value');

module.exports = class bitcoinCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'bitcoin',
			group: 'searches',
			memberName: 'bitcoin',
			description: 'Shows you information from Bitcoin (value and percentage of changes from the last day)',
			format: 'bitcoin',
			aliases: [],
			examples: ['bitcoin'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const value = await btcValue();
		const percentage = await btcValue.getPercentageChangeLastDay();

		const descriptionembed = lang.bitcoin_descriptionembed.replace('%value', value).replace('%percentage', percentage);

		const embed = new Discord.RichEmbed()
			.setDescription(descriptionembed)
			.setColor('#ff6600')
			.setAuthor(lang.bitcoin_authorembed);

		msg.channel.send({
			embed
		});
	}
};
