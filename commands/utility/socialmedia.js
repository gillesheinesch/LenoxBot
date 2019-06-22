const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class socialmediaCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'socialmedia',
			group: 'utility',
			memberName: 'socialmedia',
			description: 'Allows you to connect a social media account to your discord account',
			format: 'socialmedia {edit/delete/list} [youtube, twitch, instagram, twitter]',
			aliases: [],
			examples: ['socialmedia edit youtube Monkeyyy11', 'socialmedia delete twitch', 'socialmedia list'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const validation = ['delete', 'edit', 'list'];
		const validation2 = ['youtube', 'twitch', 'instagram', 'twitter', 'facebook', 'github', 'pinterest', 'reddit'];
		const margs = msg.content.split(' ');

		if (args.slice().length === 0) return msg.reply(lang.socialmedia_error1);

		for (let i = 0; i < margs.length; i++) {
			if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
				if (margs[1].toLowerCase() === 'edit') {
					if (args.slice(1).length === 0) return msg.reply(lang.socialmedia_error2);
					if (args.slice(2).length === 0) return msg.reply(lang.socialmedia_error3);
					for (let index = 0; index < margs.length; index++) {
						if (validation2.indexOf(margs[index].toLowerCase()) >= 0) {
							if (margs[2].toLowerCase() === 'youtube') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.youtube = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_newyoutube);
							} else if (margs[2].toLowerCase() === 'twitch') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.twitch = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_newtwitch);
							} else if (margs[2].toLowerCase() === 'instagram') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.instagram = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_newinstagram);
							} else if (margs[2].toLowerCase() === 'twitter') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.twitter = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_newtwitter);
							} else if (margs[2].toLowerCase() === 'facebook') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.facebook = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_newfacebook);
							} else if (margs[2].toLowerCase() === 'github') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.github = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_newgithub);
							} else if (margs[2].toLowerCase() === 'pinterest') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.pinterest = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_newpinterest);
							} else if (margs[2].toLowerCase() === 'reddit') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.reddit = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_newreddit);
							}
						}
					}
					return msg.reply(lang.socialmedia_error4);
				} else if (margs[1].toLowerCase() === 'delete') {
					if (args.slice(1).length === 0) return msg.reply(lang.socialmedia_error2);
					for (let index = 0; index < margs.length; index++) {
						if (validation2.indexOf(margs[index].toLowerCase()) >= 0) {
							if (margs[2].toLowerCase() === 'youtube') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').youtube === '') return msg.reply(lang.socialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.youtube = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_deleteyoutube);
							} else if (margs[2].toLowerCase() === 'twitch') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').twitch === '') return msg.reply(lang.socialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.twitch = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_deletetwitch);
							} else if (margs[2].toLowerCase() === 'instagram') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').instagram === '') return msg.reply(lang.socialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.instagram = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_deleteinstagram);
							} else if (margs[2].toLowerCase() === 'twitter') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').twitter === '') return msg.reply(lang.socialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.twitter = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_deletetwitter);
							} else if (margs[2].toLowerCase() === 'facebook') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').facebook === '') return msg.reply(lang.socialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.facebook = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_deletefacebook);
							} else if (margs[2].toLowerCase() === 'github') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').github === '') return msg.reply(lang.socialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.github = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_deletegithub);
							} else if (margs[2].toLowerCase() === 'pinterest') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').pinterest === '') return msg.reply(lang.socialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.pinterest = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_deletepinterest);
							} else if (margs[2].toLowerCase() === 'reddit') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').reddit === '') return msg.reply(lang.socialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.reddit = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.socialmedia_deletereddit);
							}
						}
					}
					return msg.reply(lang.socialmedia_error4);
				} else if (margs[1].toLowerCase() === 'list') {
					const embed = new Discord.MessageEmbed()
						.setTimestamp()
						.setColor('BLUE');

					/* eslint guard-for-in: 0 */
					for (const key in msg.client.provider.getUser(msg.author.id, 'socialmedia')) {
						embed.addField(lang[`socialmedia_${key}`], msg.client.provider.getUser(msg.author.id, 'socialmedia')[key] === '' ? lang.socialmedia_notlinked : msg.client.provider.getUser(msg.author.id, 'socialmedia')[key]);
					}

					return msg.channel.send({
						embed: embed
					});
				}
			}
		}
		return msg.reply(lang.socialmedia_error4);
	}
};
