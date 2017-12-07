const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    const embed = new Discord.RichEmbed()
    .setColor('0066CC')
    .setFooter(`You can get a list of all available events with ${tableload.prefix}listevents`)
    .setAuthor(`All active/disabled events!`);

    if (tableload.modlog === 'true') {
        const channelID = tableload.modlogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Modlog active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Modlog disabled', `/`);
    }

    if (tableload.messagedellog === 'true') {
        const channelID = tableload.messagedellogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Messagedelete active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Messagedelete disabled', `/`);
    }

    if (tableload.messageupdatelog === 'true') {
        const channelID = tableload.messageupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Messageupdate active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Messageupdate disabled', `/`);
    }

    if (tableload.channelupdatelog === 'true') {
        const channelID = tableload.channelupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Channelupdate active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Channelupdate disabled', `/`);
    }

    if (tableload.channelcreatelog === 'true') {
        const channelID = tableload.channelcreatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Channelcreate active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Channelcreate disabled', `/`);
    }

    if (tableload.channeldeletelog === 'true') {
        const channelID = tableload.channeldeletelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Channeldelete active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Channeldelete disabled', `/`);
    }

    if (tableload.guildmemberupdatelog === 'true') {
        const channelID = tableload.guildmemberupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Memberupdate active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Memberupdate disabled', `/`);
    }

    if (tableload.presenceupdatelog === 'true') {
        const channelID = tableload.presenceupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Presenceupdate active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Presenceupdate disabled', `/`);
    }

    if (tableload.welcomelog === 'true') {
        const channelID = tableload.welcomelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Userjoin active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Userjoin disabled', `/`);
    }

    if (tableload.byelog === 'true') {
        const channelID = tableload.byelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Userleft active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Userleft disabled', `/`);
    }

    if (tableload.rolecreatelog === 'true') {
        const channelID = tableload.rolecreatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Rolecreate active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Rolecreate disabled', `/`);
    }

    if (tableload.roledeletelog === 'true') {
        const channelID = tableload.roledeletelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Roledelete active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Roledelete disabled', `/`);
    }

    if (tableload.roleupdatelog === 'true') {
        const channelID = tableload.roleupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Roleupdate active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Roleupdate disabled', `/`);
    }

    if (tableload.guildupdatelog === 'true') {
        const channelID = tableload.guildupdatelogchannel;
        const channelName = client.channels.get(channelID).name;
        embed.addField('✅ Guildupdate active', `#${channelName} (${channelID})`);
    } else {
        embed.addField('❌ Guildupdate disabled', `/`);
    }
    msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
    aliases: ['actev'],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'events',
	description: 'Gives you a list of all active/disabled events',
	usage: 'events',
    example: ['events'],
    category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
