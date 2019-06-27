const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: [Map] });
	}

	map(fn, thisArg) {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const arr = new Array(this.size);
		let i = 0;
		for (const [key, val] of this) arr[i++] = fn(val, key, this);
		return arr;
	}

	filter(fn, thisArg) {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = new this.constructor[Symbol.species]();
		for (const [key, val] of this) {
			if (fn(val, key, this)) results.set(key, val);
		}
		return results;
	}

}