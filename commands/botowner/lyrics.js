const axios = require('axios');
const LenoxCommand = require('../LenoxCommand.js');
const config = require('../../settings.json');

module.exports = class lyricsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      group: 'botowner',
      memberName: 'lyrics',
      description: 'Fetch lyrics for a given artist and song',
      format: 'lyrics {query}',
      aliases: [],
      examples: ['lyrics parkway drive - boneyards'],
      clientpermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      userpermissions: [],
      shortDescription: 'Lyrics',
      dashboardsettings: false
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (!config.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

    const text_truncate = (str, length, ending) => {
      if (length === null) length = 100;
      if (ending === null) ending = '...';
      if (str.length > length) return str.substring(0, length - ending.length) + ending;
      return str;
    };
    const MESSAGE_CHAR_LIMIT = 2000;
    const splitString = (string, prepend = '', append = '') => {
      if (string.length <= MESSAGE_CHAR_LIMIT) return [string];
      const splitIndex = string.lastIndexOf('\n', MESSAGE_CHAR_LIMIT - prepend.length - append.length);
      const sliceEnd = splitIndex > 0 ? splitIndex : MESSAGE_CHAR_LIMIT - prepend.length - append.length;
      const rest = splitString(string.slice(sliceEnd), prepend, append);
      return [`${string.slice(0, sliceEnd)}${append}`, `${prepend}${rest[0]}`, ...rest.slice(1)];
    };

    const input = msg.content.split(' ');
    const searchString = input.slice(1).join(' ');
    if (!searchString) return msg.channel.send(lang.lyrics_nosongname);

    await axios({
      method: 'GET',
      url: `https://api.audd.io/findLyrics/?itunes_country=us&api_token=${config.auddKey}&q=${encodeURIComponent(searchString)}`,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(async (res) => {
      if (!res.data.result.length) return msg.channel.send(`Couldn't find lyrics for the song \`${searchString}\`.`);
      const audd_song = res.data.result[0];
      const ksoft_res = await axios.get(`https://ksoft.derpyenterprises.org/lyrics?input=${encodeURIComponent(`${audd_song.artist} - ${audd_song.title}`)}`);
      if (ksoft_res.data.data.length) { // check to make sure ksoft returned a response (this response is used to add properties from ksoft to audd)
        const ksoft_song = ksoft_res.data.data[0];
        if (!audd_song.lyrics && ksoft_song.lyrics) { // make sure audd and ksoft returned lyrics
          audd_song.lyrics = ksoft_song.lyrics;
        }
        else if (!audd_song.lyrics && !ksoft_song.lyrics) { // if audd and ksoft didn't return lyrics then try to get them from makeitpersonal as a last resort
          try {
            const mip_lyrics = await axios.get(`https://makeitpersonal.co/lyrics?artist=${encodeURIComponent(audd_song.artist)}&title=${encodeURIComponent(audd_song.title)}`); // use this api if audd is down or can't find lyrics for a song. (it is rare for audd not to find lyrics for a song but just as a safety precaution.)
            audd_song.lyrics = mip_lyrics.data; // add the lyrics to the audd api (I like doing it this way so I won't have to check the api if it didn't find lyrics before having them sent.)
          }
          catch (e) { }
        }
        /* add properties from ksoft to audd */
        audd_song.album = ksoft_song.album;
        audd_song.album_ids = ksoft_song.album_ids;
        audd_song.album_year = ksoft_song.album_year;
        audd_song.album_art = ksoft_song.album_art;
        audd_song.artist_id = ksoft_song.artist_id;
        audd_song.search_str = ksoft_song.search_str;
        audd_song.popularity = ksoft_song.popularity;
        audd_song.id = ksoft_song.id;
        audd_song.search_score = ksoft_song.search_score;
      }
      audd_song.lyrics = audd_song.lyrics.replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n').replace(/&amp;/g, '&')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"')
        .replace(/&OElig;/g, 'Œ')
        .replace(/&oelig;/g, 'œ')
        .replace(/&Scaron;/g, 'Š')
        .replace(/&scaron;/g, 'š')
        .replace(/&Yuml;/g, 'Ÿ')
        .replace(/&circ;/g, 'ˆ')
        .replace(/&tilde;/g, '˜')
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—')
        .replace(/&lsquo;/g, '‘')
        .replace(/&rsquo;/g, '’')
        .replace(/&sbquo;/g, '‚')
        .replace(/&ldquo;/g, '“')
        .replace(/&rdquo;/g, '”')
        .replace(/&bdquo;/g, '„')
        .replace(/&dagger;/g, '†')
        .replace(/&Dagger;/g, '‡')
        .replace(/&permil;/g, '‰')
        .replace(/&lsaquo;/g, '‹')
        .replace(/&rsaquo;/g, '›')
        .replace(/&euro;/g, '€')
        .replace(/&copy;/g, '©')
        .replace(/&trade;/g, '™')
        .replace(/&reg;/g, '®')
        .replace(/&nbsp;/g, ' ');
      audd_song.lyrics = splitString(audd_song.lyrics);
      let pagenum = 1;
      audd_song.lyrics.forEach((page) => { // iterate through the pages
        msg.channel.send({
          embed: {
            description: page.toString() || 'N/A',
            thumbnail: {
              url: audd_song.album_art ? audd_song.album_art : undefined
            },
            timestamp: new Date(),
            color: 3447003,
            title: text_truncate(`${audd_song.album ? `[${audd_song.album}] ` : ''}${audd_song.artist} - ${audd_song.title}${audd_song.album_year ? ` (${audd_song.album_year})` : ''}`, 256),
            author: {
              name: text_truncate(audd_song.artist, 256) || 'N/A'
            },
            footer: {
              text: `${lang.lyrics_page} ${pagenum++ || 'N/A'}`
            }
          }
        });
      });
    }).catch((e) => console.error(e));
  }
};
