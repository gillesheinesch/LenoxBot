const config = require('../settings.json');
const request = require("request");

exports.run = (client, msg, args) => {
    const tableload = client.guildconfs.get(msg.guild.id);
  if (!args[0]) {
    return msg.channel.send("You must include a query. Alternatively, you can check usage via `" + tableload.prefix + "help " + msg.content.slice(config.prefix.length) + "`").then(m => m.delete(20000));
  }
  var url = "https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=" + args + "&maxResults=1&type=video&key=" + config.googlekey;
  request(url, function(err, response, body) {
    if (err) {
      console.log("[ERROR]" + err);
      return msg.channel.send("There is no video by that name.").then(m => m.delete(10000));
    }
    var search = JSON.parse(body);
    try {
      let title = search.items[0].snippet.title;
      let url = "https://www.youtube.com/watch?v=" + search.items[0].id.videoId;
      return msg.channel.send("Result: `" + title + "` <" + url + ">");
    } catch (err) {
      return msg.channel.send("I can't find a video matching that query!").then(m => m.delete(10000));
    }
  });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: ['yt']
};
exports.help = {
	name: 'youtube',
	description: 'Searches for a video on youtube',
    usage: 'youtube {input}',
    example: 'youtube Discord',
	category: 'searches'
};
