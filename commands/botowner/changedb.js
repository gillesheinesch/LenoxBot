exports.run = async (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
        await client.redeem.defer;
        await client.newredeem.defer;
        client.redeem.forEach((k, o) => client.newredeem.set(k, o));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],

	

	userpermissions: [], dashboardsettings: true

};
exports.help = {
	name: 'changedb',
	description: 'Leave a self-assignable role',
	usage: 'leave {rolename}',
	example: ['leave Member'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']
};
