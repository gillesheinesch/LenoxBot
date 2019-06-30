const { Extendable } = require('klasa');
const { Collection } = require('discord.js');

module.exports = class extends Extendable {
	constructor(...args) {
		super(...args, { appliesTo: [Collection] });
	}

	mapCollection(fn, thisArg) {
  		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const collection = new Collection();
		for (const [key, value] of this) collection.set(key, fn(value, key, this));
		return collection;
	}
};
