const { Command } = require('klasa');
const axios = require('axios');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Fetch lyrics for a given artist and song.',
			extendedHelp: [
				'lyrics Parkway Drive - Boneyards'
			],
			usage: '<query:str>',
			permissionLevel: 10 // admin only as long as we must pay for the api
		});
		this.MESSAGE_CHAR_LIMIT = 2000;
	}

	async run(message, [query]) {
		const splitString = (string, prepend = '', append = '') => {
			if (string.length <= this.MESSAGE_CHAR_LIMIT) return [string];
			const splitIndex = string.lastIndexOf('\n', this.MESSAGE_CHAR_LIMIT - prepend.length - append.length);
			const sliceEnd = splitIndex > 0 ? splitIndex : this.MESSAGE_CHAR_LIMIT - prepend.length - append.length;
			const rest = splitString(string.slice(sliceEnd), prepend, append);
			return [`${string.slice(0, sliceEnd)}${append}`, `${prepend}${rest[0]}`, ...rest.slice(1)];
		};

		try {
			if (!query) return message.channel.send('<:redx:411978781226696705> You must provide a song to get lyrics for!');
			await axios({
				method: 'GET',
				url: `https://api.audd.io/findLyrics/?itunes_country=us&api_token=${process.env.AUDD_LYRICS_TOKEN}&q=${encodeURIComponent(query)}`,
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
					'Content-Type': 'application/json; charset=utf-8'
				}
			}).then(async res => {
				if (!res.data.result.length) return message.channel.send(`Couldn't find lyrics for the song \`${query}\`.`);
				const audd_song = res.data.result[0];
				const ksoft_res = await axios.get(`https://ksoft.derpyenterprises.org/lyrics?input=${encodeURIComponent(`${audd_song.artist} - ${audd_song.title}`)}`);
				if (ksoft_res.data.data.length) {
					const ksoft_song = ksoft_res.data.data[0];
					if (!audd_song.lyrics && ksoft_song.lyrics) {
						audd_song.lyrics = ksoft_song.lyrics;
					} else if (!audd_song.lyrics && !ksoft_song.lyrics) {
						try {
							const mip_lyrics = await axios.get(`https://makeitpersonal.co/lyrics?artist=${encodeURIComponent(audd_song.artist)}&title=${encodeURIComponent(audd_song.title)}`);
							audd_song.lyrics = mip_lyrics.data;
						} catch (e) { }
					}
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
				audd_song.lyrics.forEach(page => {
					message.channel.send({
						embed: {
							description: page.toString() || 'N/A',
							thumbnail: {
								url: audd_song.album_art ? audd_song.album_art : undefined
							},
							timestamp: new Date(),
							color: 3447003,
							title: String.truncate(`${audd_song.album ? `[${audd_song.album}] ` : ''}${audd_song.artist} - ${audd_song.title}${audd_song.album_year ? ` (${audd_song.album_year})` : ''}`, 256),
							author: {
								name: String.truncate(audd_song.artist, 256) || 'N/A'
							},
							footer: {
								text: `Page: ${pagenum++ || 'N/A'}`
							}
						}
					});
				});
			}).catch(console.error);
		} catch (e) {
			console.error(e);
		}
	}
};
