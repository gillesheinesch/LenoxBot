const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class setsocialmediaCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'setsocialmedia',
			group: 'utility',
			memberName: 'setsocialmedia',
			description: 'Allows you to connect a social media account to your discord account',
			format: 'setsocialmedia {edit/delete/list} [youtube, twitch, instagram, twitter]',
			aliases: [],
			examples: ['setsocialmedia edit youtube Monkeyyy11', 'setsocialmedia delete twitch', 'setsocialmedia list'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const validation = ['delete', 'edit', 'list'];
		const validation2 = ['youtube', 'twitch', 'instagram', 'twitter', 'facebook', 'github', 'pinterest', 'reddit'];
		const margs = msg.content.split(' ');

		if (args.slice().length === 0) return msg.reply(lang.setsocialmedia_error1);

		for (let i = 0; i < margs.length; i++) {
			if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
				if (margs[1].toLowerCase() === 'edit') {
					if (args.slice(1).length === 0) return msg.reply(lang.setsocialmedia_error2);
					if (args.slice(2).length === 0) return msg.reply(lang.setsocialmedia_error3);
					for (let index = 0; index < margs.length; index++) {
						if (validation2.indexOf(margs[index].toLowerCase()) >= 0) {
							if (margs[2].toLowerCase() === 'youtube') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.youtube = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_newyoutube);
							} else if (margs[2].toLowerCase() === 'twitch') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.twitch = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_newtwitch);
							} else if (margs[2].toLowerCase() === 'instagram') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.instagram = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_newinstagram);
							} else if (margs[2].toLowerCase() === 'twitter') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.twitter = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_newtwitter);
							} else if (margs[2].toLowerCase() === 'facebook') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.facebook = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_newfacebook);
							} else if (margs[2].toLowerCase() === 'github') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.github = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_newgithub);
							} else if (margs[2].toLowerCase() === 'pinterest') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.pinterest = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_newpinterest);
							} else if (margs[2].toLowerCase() === 'reddit') {
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.reddit = args.slice(2).join(' ');
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_newreddit);
							}
						}
					}
					return msg.reply(lang.setsocialmedia_error4);
				} else if (margs[1].toLowerCase() === 'delete') {
					if (args.slice(1).length === 0) return msg.reply(lang.setsocialmedia_error2);
					for (let index = 0; index < margs.length; index++) {
						if (validation2.indexOf(margs[index].toLowerCase()) >= 0) {
							if (margs[2].toLowerCase() === 'youtube') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').youtube === '') return msg.reply(lang.setsocialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.youtube = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_deleteyoutube);
							} else if (margs[2].toLowerCase() === 'twitch') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').twitch === '') return msg.reply(lang.setsocialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.twitch = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_deletetwitch);
							} else if (margs[2].toLowerCase() === 'instagram') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').instagram === '') return msg.reply(lang.setsocialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.instagram = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_deleteinstagram);
							} else if (margs[2].toLowerCase() === 'twitter') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').twitter === '') return msg.reply(lang.setsocialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.twitter = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_deletetwitter);
							} else if (margs[2].toLowerCase() === 'facebook') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').facebook === '') return msg.reply(lang.setsocialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.facebook = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_deletefacebook);
							} else if (margs[2].toLowerCase() === 'github') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').github === '') return msg.reply(lang.setsocialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.github = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_deletegithub);
							} else if (margs[2].toLowerCase() === 'pinterest') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').pinterest === '') return msg.reply(lang.setsocialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.pinterest = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_deletepinterest);
							} else if (margs[2].toLowerCase() === 'reddit') {
								if (msg.client.provider.getUser(msg.author.id, 'socialmedia').reddit === '') return msg.reply(lang.setsocialmedia_notsetup);
								const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
								currentSocialmedia.reddit = '';
								await msg.client.provider.setUser(msg.author.id, currentSocialmedia);

								return msg.reply(lang.setsocialmedia_deletereddit);
							}
						}
					}
					return msg.reply(lang.setsocialmedia_error4);
				} else if (margs[1].toLowerCase() === 'list') {
					const embed = new Discord.RichEmbed()
						.setTimestamp()
						.setColor('BLUE');

					/* eslint guard-for-in: 0 */
					for (const key in msg.client.provider.getUser(msg.author.id, 'socialmedia')) {
						embed.addField(lang[`setsocialmedia_${key}`], msg.client.provider.getUser(msg.author.id, 'socialmedia')[key] === '' ? lang.setsocialmedia_notlinked : msg.client.provider.getUser(msg.author.id, 'socialmedia')[key]);
					}

					return msg.channel.send({
						embed: embed
					});
				}
			}
		}
		return msg.reply(lang.setsocialmedia_error4);
	}
};
