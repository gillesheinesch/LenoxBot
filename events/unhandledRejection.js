module.exports = {
	emitter: process,
	run: (error) => {
		if (!client.ready || !client.settings || !client.settings.log_channels || !client.settings.log_channels.errors || !error || error.name === 'DiscordAPIError') return;
		if (client.channels.has(client.settings.log_channels.errors)) client.channels.get(client.settings.log_channels.errors).send(null, {
			embed: {
				color: 15684432,
				timestamp: new Date(),
				title: 'Unhandled Rejection | Uncaught Promise error:',
				description: `\`\`\`x86asm\n${(error.stack || error.toString()).slice(0, 2048)}\n\`\`\``,
				fields: [
					{
						name: 'Error Message:',
						value: `\`${error.message || 'N/A'}\``
					}
				]
			}
		});
	}
}
