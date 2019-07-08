const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: [String] });
	}

	static truncate(str, length, ending) {
		if (length == null) length = 100;
		if (ending == null) ending = '...';
		if (str.length > length) {
			return str.substring(0, length - ending.length) + ending;
		} else {
			return str;
		}
	}

}