module.exports = {
	run: (warning) => {
		if (!client.ready || !client.settings || !client.settings.log_channels || !client.settings.log_channels.warnings) return;
		try {
			if (client.channels.has(client.settings.log_channels.warnings)) client.channels.get(client.settings.log_channels.warnings).send(null, {
				embed: {
					color: 12696890,
					timestamp: new Date(),
					title: 'Warn',
					description: `\`\`\`\n${warning}\n\`\`\``
				}
			});
		} catch (error) {
			console.error(error.stack ? error.stack : error.toString());
		}
	}
}
