exports.run = async(client, msg, args, lang) => {	
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.commanddel === 'false') {
		tableload.commanddel = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.commanddeletion_deletionset);
	} else {
		tableload.commanddel = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.commanddeletion_nodeletionset);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['cmddel'],
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'commanddeletion',
	description: 'Toggles the deletion of a command after execution',
	usage: 'commanddeletion',
	example: ['commanddeletion'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
};
