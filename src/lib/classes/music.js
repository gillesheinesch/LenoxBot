const axios = require('axios');
const Parser = require('icecast-parser');
const youtubeInfo = require("youtube-info");
const { once } = require('events');
const { Util: { escapeMarkdown }, MessageEmbed } = require('discord.js');
const escape_markdown = (text) => escapeMarkdown(text.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&OElig;/g, 'Œ').replace(/&oelig;/g, 'œ').replace(/&Scaron;/g, 'Š').replace(/&scaron;/g, 'š').replace(/&Yuml;/g, 'Ÿ').replace(/&circ;/g, 'ˆ').replace(/&tilde;/g, '˜').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’').replace(/&sbquo;/g, '‚').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&bdquo;/g, '„').replace(/&dagger;/g, '†').replace(/&Dagger;/g, '‡').replace(/&permil;/g, '‰').replace(/&lsaquo;/g, '‹').replace(/&rsaquo;/g, '›').replace(/&euro;/g, '€').replace(/&copy;/g, '©').replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&nbsp;/g, ' '));
const shuffle = a => a.reduce((_, __, i) => { const j = Math.floor(Math.random() * (a.length - i) + i); [a[i], a[j]] = [a[j], a[i]]; return a; }, a);
const fixedAllDifferentShuffle = ((array, fixed_array) => { /* memorize position of fixed elements */ const fixed = array.reduce((acc, e, i) => { if (fixed_array[i]) acc.push([e, i]); return acc; }, []); array = shuffle(array); /* swap fixed elements back to their original position */ fixed.forEach(([item, initialIndex]) => { const currentIndex = array.indexOf(item); [array[initialIndex], array[currentIndex]] = [array[currentIndex], array[initialIndex]]; }); return array; });

class AudioBase {
	constructor() {
		this.queue = [];
		this.loop = false;
		this.volume = 100;
	}
	
	get total_duration() {
		return Array.arraySum(this.queue.map((track) => track.duration));
	}

	get currently_playing() {
		return this.queue[0] || null;
	}

	get repeat() {
		return this.currently_playing ? this.currently_playing.repeat : null;
	}

	set repeat(boolean) {
		return this.currently_playing.repeat = boolean;
	}

	async _updateTrack() {
		if (!this.currently_playing) throw new Error('There are no tracks in the queue!');
		if (!(this.currently_playing instanceof StreamTrack)) return this;
		const data = new Parser({ url: this.currently_playing.url, autoUpdate: false });
		await this.currently_playing._autoFill(data);
		return this;
	}

	toggleLoop() {
		if (!this.currently_playing) throw new Error('There are no tracks in the queue!');
		if (this.currently_playing instanceof StreamTrack) throw new Error('Streams cannot be looped!');
		this.repeat = false;
		return this.loop = !this.loop;
	}

	toggleRepeat() {
		if (!this.currently_playing) throw new Error('There are no tracks in the queue!');
		if (this.currently_playing instanceof StreamTrack) throw new Error('Streams cannot be repeated!');
		this.loop = false;
		return this.currently_playing.toggleRepeat();
	}

	setVolume(integer) {
		return this.volume = integer;
	}

	pushToQueue(track = {}) {
		return this.queue.push(track);
	}

	next() {
		if (!this.queue.length) throw new Error('There are no tracks in the queue!');
		if (this.loop) {
			this.queue.push(this.queue.shift());
		} else if (this.repeat) {
			// do nothing
		} else {
			this.queue.shift();
		}
	}

	shuffleQueue() {
		return this.queue = fixedAllDifferentShuffle(this.queue, [true]);
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

class StreamTrack extends Parser {
	constructor(message, url) {
		super({ url: url, autoUpdate: false });
		this.requester = message.author;
		this.url = decodeURIComponent(url);
		this.repeat = false;
		this.skipvotes = [];
		this.isStream = true;
		this.duration = Infinity;
		this.name = 'Unknown name';
		this.artist = 'Unknown artist';
		this.album = 'Unknown album';
		this.album_year = null;
		this.album_ids = null;
		this.album_art = null;
		this.artist_id = null;
		this.search_str = null;
		this.popularity = null;
		this.search_score = null;
		this.id = null;
	}

	get title() {
		return this.artist !== 'Unknown artist' && this.name !== 'Unknown name' ? escape_markdown(`${this.artist} - ${this.name}`) : 'Unknown title';
	}

	toggleRepeat() {
		return this.repeat = !this.repeat;
	}

	async _autoFill(self = this) {
		self.once('end', (error) => {/* do nothing */});
		self.once('error', (error) => {/* do nothing */});
		self.once('empty', () => {/* do nothing */});
		const [metadata] = await once(self, 'metadata');
		const { data: { data } } = await axios.get(`https://ksoft.derpyenterprises.org/lyrics?input=${encodeURIComponent(metadata.StreamTitle)}`, { timeout: 5000 }).catch((error) => {});
		if (data.length) {
			const { artist, album, album_ids, album_year, album_art, artist_id, search_str, popularity, id, search_score, name } = data[0];
			this.artist = artist;
			this.album = album;
			this.album_ids = album_ids;
			this.album_year = album_year;
			this.album_art = album_art;
			this.artist_id = artist_id;
			this.search_str = search_str;
			this.popularity = popularity;
			this.id = id;
			this.search_score = search_score;
			this.name = name;
		}
		return this;
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
			search_score: this.search_score,
			id: this.id
		}
	}
}

class YouTubeTrack {
	constructor(message, url, playlist = false) {
		this.requester = message.author;
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
		this.is_playlist = playlist;
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