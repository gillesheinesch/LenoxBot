const DiscordCommando = require('discord.js-commando');

module.exports = class LenoxCommand extends DiscordCommando.Command {
	constructor(client, info) {
		super(client, info);
		this.constructor.validateInfo(client, info);

		/**
				 * Client that this command is for
				 * @name Command#client
				 * @type {CommandoClient}
				 * @readonly
				 */
		Object.defineProperty(this, 'client', {
			value: client
		});

		/**
				 * Name of this command
				 * @type {string}
				 */
		this.name = info.name;

		/**
				 * Aliases for this command
				 * @type {string[]}
				 */
		this.aliases = info.aliases || [];
		if (typeof info.autoAliases === 'undefined' || info.autoAliases) {
			if (this.name.includes('-')) this.aliases.push(this.name.replace(/-/g, ''));
			for (const alias of this.aliases) {
				if (alias.includes('-')) this.aliases.push(alias.replace(/-/g, ''));
			}
		}

		/**
				 * ID of the group the command belongs to
				 * @type {string}
				 */
		this.groupID = info.group;

		/**
				 * The group the command belongs to, assigned upon registration
				 * @type {?CommandGroup}
				 */
		this.group = null;

		/**
				 * Name of the command within the group
				 * @type {string}
				 */
		this.memberName = info.memberName;

		/**
				 * Short description of the command
				 * @type {string}
				 */
		this.description = info.description;

		/**
				 * Usage format string of the command
				 * @type {string}
				 */
		this.format = info.format || null;

		/**
				 * Long description of the command
				 * @type {?string}
				 */
		this.details = info.details || null;

		/**
				 * Example usage strings
				 * @type {?string[]}
				 */
		this.examples = info.examples || null;

		/**
				 * Whether the command can only be run in a guild channel
				 * @type {boolean}
				 */
		this.guildOnly = Boolean(info.guildOnly);

		/**
				 * Whether the command can only be used by an owner
				 * @type {boolean}
				 */
		this.ownerOnly = Boolean(info.ownerOnly);

		/**
				 * Permissions required by the client to use the command.
				 * @type {?PermissionResolvable[]}
				 */
		this.clientPermissions = info.clientPermissions || null;

		/**
				 * Permissions required by the user to use the command.
				 * @type {?PermissionResolvable[]}
				 */
		this.userPermissions = info.userPermissions || null;

		/**
				 * Whether the command can only be used in NSFW channels
				 * @type {boolean}
				 */
		this.nsfw = Boolean(info.nsfw);

		/**
				 * Whether the default command handling is enabled for the command
				 * @type {boolean}
				 */
		this.defaultHandling = 'defaultHandling' in info ? info.defaultHandling : true;

		/**
				 * Options for throttling command usages
				 * @type {?ThrottlingOptions}
				 */
		this.throttling = info.throttling || null;

		/**
				 * The argument collector for the command
				 * @type {?ArgumentCollector}
				 */
		this.argsCollector = info.args && info.args.length
			? new ArgumentCollector(client, info.args, info.argsPromptLimit) : null;
		if (this.argsCollector && typeof info.format === 'undefined') {
			this.format = this.argsCollector.args.reduce((prev, arg) => {
				const wrapL = arg.default !== null ? '[' : '<';
				const wrapR = arg.default !== null ? ']' : '>';
				return `${prev}${prev ? ' ' : ''}${wrapL}${arg.label}${arg.infinite ? '...' : ''}${wrapR}`;
			}, '');
		}

		/**
				 * How the arguments are split when passed to the command's run method
				 * @type {string}
				 */
		this.argsType = info.argsType || 'single';

		/**
				 * Maximum number of arguments that will be split
				 * @type {number}
				 */
		this.argsCount = info.argsCount || 0;

		/**
				 * Whether single quotes are allowed to encapsulate an argument
				 * @type {boolean}
				 */
		this.argsSingleQuotes = 'argsSingleQuotes' in info ? info.argsSingleQuotes : true;

		/**
				 * Regular expression triggers
				 * @type {RegExp[]}
				 */
		this.patterns = info.patterns || null;

		/**
				 * Whether the command is protected from being disabled
				 * @type {boolean}
				 */
		this.guarded = Boolean(info.guarded);

		/**
				 * Whether the command should be hidden from the help command
				 * @type {boolean}
				 */
		this.hidden = Boolean(info.hidden);

		/**
				 * Whether the command is enabled globally
				 * @type {boolean}
				 * @private
				 */
		this._globalEnabled = true;

		/**
				 * Current throttle objects for the command, mapped by user ID
				 * @type {Map<string, Object>}
				 * @private
				 */
		this._throttles = new Map();
		this.shortDescription = info.shortDescription || null;
		this.cooldown = info.cooldown || null;
		this.dashboardsettings = info.dashboardsettings || null;
	}

	hasPermission(message, ownerOverride = true) {
		if (!this.ownerOnly && !this.userPermissions) return true;
		if (ownerOverride && this.client.isOwner(message.author)) return true;

		const provider = message.client.provider;
		const langSet = provider.getGuild(message.guild.id, 'language', 'en-US');
		const lang = require(`../languages/${langSet}.json`);

		if (this.ownerOnly && (ownerOverride || !this.client.isOwner(message.author))) {
			return `${lang.botownercommands_error}`;
		}

		if (message.channel.type === 'text' && this.userPermissions) {
			const missing = message.channel.permissionsFor(message.author).missing(this.userPermissions);
			if (missing.length > 0) {
				const botnopermission = lang.messageevent_botnopermission.replace('%missingpermissions', missing.map(perm => missing[perm]).join(', '));
				if (missing.length === 1) {
					return `${botnopermission}`;
				}
				return `${botnopermission}`;
			}
		}

		return true;
	}
};
