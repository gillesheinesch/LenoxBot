const axios = require('axios');
const Parser = require('icecast-parser');
const youtubeInfo = require("youtube-info");
const { Util: { escapeMarkdown }, MessageEmbed } = require('discord.js');

class AudioBase {
	constructor() {
		this._settings_queue = [];
		this.loop = false;
		this.volume = 100;
	}

	set queue(track = {}) {
		return this._settings_queue.push(track);
	}

	get queue() {
		return this._settings_queue;
	}

	get playing() {
		return this.queue[0] || null;
	}

	get repeat() {
		return this.playing ? this.playing.repeat : null;
	}

	toggleLoop() {
		return this.loop = !this.loop;
	}

	setVolume(integer) {
		return this.volume = integer;
	}

	pushToQueue(track = {}) {
		return this.queue.push(track);
	}

	next() {
		if (!this.queue.length) throw new Error('There is no audio in the queue!');
		if (this.loop) {
			this.queue.push(this.queue.shift());
		} else if (this.repeat) {
			// do nothing
		} else {
			this.queue.shift();
		}
	}
}

/*class AudioController extends AudioBase {
	constructor() {
		super();
		this.connection = null;
	}

	skip() {
		//
	}

	setVolume() {
		//
	}
}*/

class StreamTrack {
	constructor(message, url) {
		this._track_requester = message.author;
		this.url = decodeURIComponent(url);
		this.repeat = false;
		this._skipvotes = [];
		this._duration = 'Infinity';
		this._name = 'Unknown name';
		this._artist = 'Unknown artist';
		this._album = 'Unknown album';
		this._album_year = null;
		this._album_ids = null;
		this._album_art = null;
		this._artist_id = null;
		this._search_str = null;
		this._popularity = null;
		this._id = null;
		this._search_score = null;
		this._autoFill();
	}

	get requester() {
		return this._track_requester;
	}

	get duration() {
		return this._duration;
	}

	set skipvotes(author_id) {
		return this._skipvotes.push(author_id)
	}

	get skipvotes() {
		return this._skipvotes;
	}

	get name() {
		return this._name;
	}

	get artist() {
		return this._artist;
	}

	get title() {
		return this.artist !== 'Unknown artist' && this.name !== 'Unknown name' ? escapeMarkdown(`${this.artist} - ${this.name}`.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&OElig;/g, 'Œ').replace(/&oelig;/g, 'œ').replace(/&Scaron;/g, 'Š').replace(/&scaron;/g, 'š').replace(/&Yuml;/g, 'Ÿ').replace(/&circ;/g, 'ˆ').replace(/&tilde;/g, '˜').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’').replace(/&sbquo;/g, '‚').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&bdquo;/g, '„').replace(/&dagger;/g, '†').replace(/&Dagger;/g, '‡').replace(/&permil;/g, '‰').replace(/&lsaquo;/g, '‹').replace(/&rsaquo;/g, '›').replace(/&euro;/g, '€').replace(/&copy;/g, '©').replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&nbsp;/g, ' ')) : 'Unknown title';
	}

	get album_art() {
		return this._album_art;
	}

	get artist_id() {
		return this._artist_id;
	}

	get search_str() {
		return this._search_str;
	}

	get popularity() {
		return this._popularity;
	}

	get id() {
		return this._id;
	}

	get search_score() {
		return this._search_score;
	}

	get album() {
		return this._album;
	}

	get album_year() {
		return this._album_year;
	}

	get album_ids() {
		return this._album_ids;
	}

	toggleRepeat() {
		return this.repeat = !this.repeat;
	}

	_autoFill() {
		const radioStation = new Parser({
			url: this.url,
			autoUpdate: false,
			keepListen: false
		});

		radioStation.once('end', (error) => { throw new Error(error.message); });

		radioStation.once('error', (error) => { throw new Error(error.message); });

		radioStation.once('metadata', async(metadata) => {
			//const song_title = .split(/ - (.+)/i);
			const ksoft_res = await axios.get(`https://ksoft.derpyenterprises.org/lyrics?input=${encodeURIComponent(metadata.StreamTitle)}`).catch((e) => {
				throw new Error(e.message);
			});
			if (ksoft_res.data.data.length) {
				const { artist, album, album_ids, album_year, album_art, artist_id, search_str, popularity, id, search_score, name } = ksoft_res.data.data[0];
				this._artist = artist;
				this._album = album;
				this._album_ids = album_ids;
				this._album_year = album_year;
				this._album_art = album_art;
				this._artist_id = artist_id;
				this._search_str = search_str;
				this._popularity = popularity;
				this._id = id;
				this._search_score = search_score;
				this.name = name;
			}
		});

		radioStation.once('empty', () => { /* do nothing */ });
	}

	toJSON() {
		return {
			requester: this.requester,
			url: this.url,
			repeat: this.repeat,
			title: this.title,
			duration: this.duration,
			skipvotes: this.skipvotes,
			name: this.name,
			artist: this.artist,
			album: this.album,
			album_year: this.album_year,
			album_ids: this.album_ids,
			album_art: this.album_art,
			artist_id: this.artist_id,
			search_str: this.search_str,
			popularity: this.popularity,
			id: this.id,
			search_score: this.search_score
		}
	}
}

class YouTubeTrack {
	constructor(message, url, playlist = false) {
		this._track_requester = message.author;
		this.url = decodeURIComponent(url);
		this.artist = null;
		this.channelUrl = null; //"https://www.youtube.com/channel/" + options.channelId : undefined,
		this.channelThumbnailUrl = null;
		this.coverImageUrl = null;
		this.description = null;
		this.duration = 0;//(options.duration * 1000 || 0),
		this.genre = null;
		this.owner = null;
		this.repeat = false;
		this.skipvotes = [];
		this.thumbnailUrl = null;
		this.title = null;// options.title ? escapeMarkdown(options.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&OElig;/g, 'Œ').replace(/&oelig;/g, 'œ').replace(/&Scaron;/g, 'Š').replace(/&scaron;/g, 'š').replace(/&Yuml;/g, 'Ÿ').replace(/&circ;/g, 'ˆ').replace(/&tilde;/g, '˜').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’').replace(/&sbquo;/g, '‚').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&bdquo;/g, '„').replace(/&dagger;/g, '†').replace(/&Dagger;/g, '‡').replace(/&permil;/g, '‰').replace(/&lsaquo;/g, '‹').replace(/&rsaquo;/g, '›').replace(/&euro;/g, '€').replace(/&copy;/g, '©').replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&nbsp;/g, ' ')) : undefined,
		this.videoId = null;
		this._playlist = playlist;
		this._autoFill();
	}

	get playlist() {
		return this._playlist;
	}

	get requester() {
		return this._track_requester;
	}

	async _autoFill() {
		try {
			return await youtubeInfo(video_id);
		} catch (e) {
			if (!this.playlist) throw new Error(e.message); // ignore error if retrieving from playlist otherwise the playlist array will include rejected promises
		}
	}
}

module.exports = {
	AudioBase,
	//AudioController,
	StreamTrack,
	YouTubeTrack
}