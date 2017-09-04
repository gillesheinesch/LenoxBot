exports.run = (client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));	
    const tableload = client.guildconfs.get(msg.guild.id);
    const text = msg.content.split(" ").slice(1).join(' ');
    if (tableload.announce === 'false') return msg.channel.send(`You must first define where announcements should be posted. \nUse the following command \`${tableload.prefix}announcetoggle\` to activate/deactivate announcements in your current channel!`);
    const announcechannel = tableload.announcechannel;
    client.channels.get(announcechannel).send(`${msg.cleanContent}`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['a']
};
exports.help = {
	name: 'announce',
	description: 'Write a new server announcement',
	usage: 'announce {text}',
	example: 'announce Today we reached 5000 members. Thank you for that!',
	category: 'administration'
};
