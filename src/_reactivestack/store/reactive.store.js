import _ from 'lodash';
import {reactive} from 'vue';
import {filter} from 'rxjs/operators';

import ClientSocket from '../client.socket';

const _isValidMessage = (targets, message) => {
	const {type, target} = message;
	return 'update' === type && _.includes(_.keys(targets), target);
};

export default class ReactiveStore {
	_name;
	_subscription;
	_targets;
	_store;

	constructor(name) {
		this._name = name;
		this._targets = {};
	}

	updateSubscription(target, config) {
		console.log('updateSubscription', {target, config});
		const {observe, scope} = this._targets[target];
		if (!observe || !scope) return;
		ClientSocket.updateSubscription({target, observe, scope, config});
	}

	closeSubscription(target) {
		ClientSocket.closeSubscription({target});
	}

	addTarget(name, collection, initial) {
		if (_.includes(_.keys(this._targets), name)) throw new Error(`Target ${name} already exists!`);
		const target = {observe: collection, initial};
		target.scope = _.isArray(initial) ? 'many' : 'one';

		_.set(this._targets, name, target);
		_.set(this._store, name, initial);
		if (_.isArray(initial)) _.set(this._store, name + 'Count', 0);
	}

	removeTarget(name) {
		_.unset(this._targets, name);
		_.unset(this._store, name);
	}

	init() {
		this.destroy();

		this._targets = {};
		this._store = reactive({});

		this._subscription = ClientSocket.init() //
			.pipe(filter((message) => _isValidMessage(this._targets, message)))
			.subscribe({
				next: (message) => this._process(message),
				error: (err) => console.log('error', err),
				complete: () => console.log('completed')
			});
		console.log(this._name, 'initialized.');

		return this._store;
	}

	getStore() {
		return this._store;
	}

	destroy() {
		if (this._subscription) this._subscription.unsubscribe();
		this._subscription = null;
		this._store = null;
		console.log(this._name, 'destroyed.');
	}

	_process(message) {
		const {target, payload} = message;
		const {scope} = this._targets[target];

		if (!scope) return;

		_.set(this._store, target, payload[target]);
		if (scope === 'many') _.set(this._store, target + 'Count', payload['_' + target + 'Count']);
	}
}
