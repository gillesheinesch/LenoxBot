const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    if (tableload.modlog === 'false' && tableload.messagedellog === 'false' && tableload.messageupdatelog === 'false' && tableload.channelupdatelog === 'false' && tableload.channelcreatelog === 'false' && tableload.channeldeletelog === 'false' && tableload.guildmemberupdatelog === 'false' && tableload.presenceupdatelog === 'false' && tableload.welcomelog === 'false' && tableload.byelog === 'false' && tableload.rolecreatelog === 'false' && tableload.roledeletelog === 'false' && tableload.roleupdatelog === 'false') return msg.channel.send('There are no active events!');
    console.log(tableload.messagedeletelog);
    console.log(tableload.modlog);
    const embed = new Discord.RichEmbed()
    .setColor('0066CC')
    .setFooter(`You can get a list of all available events with ${tableload.prefix}listevents`)
    .setAuthor(`All active events/logs!`);

    if (tableload.modlog === 'true') {
        const channelID = tableload.modlogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ modlog active', `#${channelName} (${channelID})`);
    }

    if (tableload.messagedeletelog === 'true') {
        const channelID = tableload.messagedeletelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ messagedelete active', `#${channelName} (${channelID})`);
    }

    if (tableload.messageupdatelog === 'true') {
        const channelID = tableload.messageupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ messageupdate active', `#${channelName} (${channelID})`);
    }

    if (tableload.channelupdatelog === 'true') {
        const channelID = tableload.channelupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ channelupdate active', `#${channelName} (${channelID})`);
    }

    if (tableload.channelcreatelog === 'true') {
        const channelID = tableload.channelcreatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ channelcreate active', `#${channelName} (${channelID})`);
    }

    if (tableload.channeldeletelog === 'true') {
        const channelID = tableload.channeldeletelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ channeldelete active', `#${channelName} (${channelID})`);
    }

    if (tableload.guildmemberupdatelog === 'true') {
        const channelID = tableload.guildmemberupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ memberupdate active', `#${channelName} (${channelID})`);
    }

    if (tableload.presenceupdatelog === 'true') {
        const channelID = tableload.presenceupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ presenceupdate active', `#${channelName} (${channelID})`);
    }

    if (tableload.welcomelog === 'true') {
        const channelID = tableload.welcomelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ userjoin active', `#${channelName} (${channelID})`);
    }

    if (tableload.byelog === 'true') {
        const channelID = tableload.byelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ userleft active', `#${channelName} (${channelID})`);
    }

    if (tableload.rolecreatelog === 'true') {
        const channelID = tableload.rolecreatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ rolecreate active', `#${channelName} (${channelID})`);
    }

    if (tableload.roledeletelog === 'true') {
        const channelID = tableload.roledeletelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ roledelete active', `#${channelName} (${channelID})`);
    }

    if (tableload.roleupdatelog === 'true') {
        const channelID = tableload.roleupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ roleupdate active', `#${channelName} (${channelID})`);
    }

    msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['actev']
};
exports.help = {
	name: 'activeevents',
	description: 'Give you a list of all active events on this discord server',
	usage: 'activeevents',
	example: 'activeevents',
	category: 'administration'
};
