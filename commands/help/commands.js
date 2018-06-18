const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'botowner', 'moderation', 'staff', 'application', 'currency', 'partner', 'tickets'];
	const margs = msg.content.split(" ");
	const commandNames = Array.from(client.commands.keys());
	const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

	var embedinfo = lang.commands_embedinfo.replace('%prefix', tableload.prefix);
	const embed = new Discord.RichEmbed()
	.setColor('#0066CC')
	.setDescription(embedinfo);

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			for (var index = 0; index < validation.length; index++) {
				if (margs[1].toLowerCase() == validation[index]) {
					const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === validation[index]).array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${lang[`${cmd.help.name}_description`]}`).join("\n")}`, { code:'asciidoc' });
	
					await message.react('◀');
					await message.react('▶');
	
					var first = 0;
					var second = 20;
	
					var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
					collector.on('collect', r => {
						var reactionadd = client.commands.filter(c => c.help.category === validation[index]).array().slice(first + 20, second + 20).length;
						var reactionremove = client.commands.filter(c => c.help.category === validation[index]).array().slice(first - 20, second - 20).length;
	
						if (r.emoji.name === '▶' && reactionadd !== 0) {
							r.remove(msg.author.id);
							const array = client.commands.filter(c => c.help.category === validation[index]).array();
							
							var slicedmsg = array.slice(first + 20, second + 20);
	
							first = first + 20;
							second = second + 20;
	
							const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${lang[`${cmd.help.name}_description`]}`);
	
							message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
						} else if (r.emoji.name === '◀' && reactionremove !== 0) {
							r.remove(msg.author.id);
							const xxx = client.commands.filter(c => c.help.category === validation[index]).array();
							
							var xx = xxx.slice(first - 20, second - 20);
							first = first - 20;
							second = second - 20;
	
	
							const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${lang[`${cmd.help.name}_description`]}`);
							message.edit(x.join("\n"), { code: 'asciidoc' });
						}
					});
					collector.on('end',(collected, reason) => {
						message.react('❌');
					});
					return undefined;
				}
			}
		}
	}
	var error = lang.commands_error.replace('%prefixmodules', `\`${tableload.prefix}modules\``);
	msg.channel.send(error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['cmds'],
    userpermissions: [], dashboardsettings: true
};
exports.help = {
	name: 'commands',
	description: 'All commands of a module',
	usage: 'commands {Modulename}',
	example: ['commands Help'],
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};

