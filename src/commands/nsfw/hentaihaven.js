const Discord = require('discord.js');
const { JSDOM } = require('jsdom');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class hentaihavenCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'hentaihaven',
      group: 'nsfw',
      memberName: 'hentaihaven',
      description: 'Random HentaiHaven videos',
      format: 'hentaihaven',
      aliases: ['hentai-haven'],
      examples: ['hentaihaven'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Videos',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    if (!msg.channel.nsfw) return msg.channel.send(lang.pornhubgif_nsfw);

    try {
      /* eslint no-undef: 0 */
      await JSDOM.fromURL('https://hentaihaven.org').then(async(res) => {
        const elements = res.window.document.querySelectorAll('head > script');
        const element = Array.from(elements).filter((elem) => elem.text.startsWith('/*  */\nvar Pukka = '))[0];
        const Pukka = JSON.parse(element.text.replace(/^\/\* {2}\*\/\nvar Pukka = |\;\n\/\* {2}\*\/$/g, ''));
        const random_category = Pukka.category_links[Math.floor(Math.random() * (Pukka.category_links.length - 1))];
        await JSDOM.fromURL(random_category).then((resource) => {
          const { document } = resource.window;
          const title = document.getElementsByClassName('archive-title')[0].textContent;
          const videos = document.getElementsByClassName('hidden animate_video');
          const video_selection = Math.floor(Math.random() * (videos.length - 1)); // select a random video off the page
          const video_url = videos[video_selection].attributes[1].value;
          const thumbnail_url = document.getElementsByClassName('hidden animate_image')[video_selection].attributes[1].value || document.getElementsByClassName('hidden solid_image')[video_selection].attributes[1].value || document.getElementsByClassName('lazy attachment-medium post-image')[video_selection].attributes[4].value;
          const embed = new Discord.MessageEmbed()
            .setImage(thumbnail_url)
            .setURL(video_url)
            .setFooter(video_url)
            .setColor('BLUE')
            .setTitle(title);

          return msg.channel.send({
            embed
          });
        }).catch((err) => {
          throw err;
        });
      }).catch((e) => {
        throw e;
      });
    }
    catch (error) {
      return msg.reply(lang.hentaihaven_notfind);
    }
  }
};
