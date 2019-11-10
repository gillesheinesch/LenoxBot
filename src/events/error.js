module.exports = {
  run: (error) => {
    if (!client.ready || !client.settings || !client.settings.log_channels || !client.settings.log_channels.errors || !error) return;
    try {
      console.error(error.stack);
      if (client.channels.has(client.settings.log_channels.errors)) {
        client.channels.get(client.settings.log_channels.errors).send(null, {
          embed: {
            color: 15684432,
            timestamp: new Date(),
            title: 'Error',
            description: error.stack ? `\`\`\`x86asm\n${error.stack}\n\`\`\`` : `\`${error.toString()}\``
          }
        });
      }
    }
    catch (error) {
      return console.error(error.stack ? error.stack : error.toString());
    }
  }
};
