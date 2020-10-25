export default class StoreTargets {
	static _targets;

	constructor() {
		this._targets = {};
	}

	addTarget(name, collection, initial) {
		_.set(this._targets, name, {observe: collection, initial});
	}

	get targets() {
		return this._targets;
	}
}
