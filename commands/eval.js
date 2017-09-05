exports.run = async (client, msg, args) => { 
    const code = args.join(" ");
    try {
      const evaled = eval(code);
      const clean = await client.clean(client, evaled);
      message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
    }
  };

  exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['cmds']
};
exports.help = {
	name: 'eval',
	description: 'All commands of a module',
	usage: 'commands {Modulename}',
	example: 'commands Help',
	category: 'help'
};