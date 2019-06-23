module.exports = {
	run: (data) => {
		if (!client.ready || !client.settings || !client.settings.log_channels || !client.settings.log_channels.logs || !error) return;
		try {
			if (client.channels.has(client.settings.log_channels.logs)) client.channels.get(client.settings.log_channels.logs).send(null, {
				embed: {
					color: 54527,
					timestamp: new Date(),
					title: 'Log',
					description: `\`\`\`\n${data.replace(/(?:\u001b\[(?:[0-9]+(?:\;[0-9]+)?)\m)/g, '')}\n\`\`\``
				}
			});
		} catch (error) {
			return console.error(error.stack ? error.stack : error.toString());
		}
	}
}
