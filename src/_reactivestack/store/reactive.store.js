import _ from 'lodash';
import {reactive} from 'vue';
import {filter} from 'rxjs/operators';

import ClientSocket from '@/_reactivestack/client.socket';

const _isValidMessage = (targets, message) => {
	const {type, target} = message;
	return _.includes(['update', 'increment', 'delete'], type) && _.includes(_.keys(targets), target);
};

export default class ReactiveStore {
	_name;
	_subscription;
	_targets;
	_handlers;
	_sources;
	_store;

	constructor(name) {
		this._name = name;
		this._targets = {};
		this._handlers = {};
		this._sources = {};
		this._store = reactive({});

		this._subscription = ClientSocket.init() //
			.pipe(filter((message) => _isValidMessage(this._targets, message)))
			.subscribe({
				next: (message) => this._process(message),
				error: (err) => console.log('error', err),
				complete: () => console.log('completed')
			});
		console.log(this._name, 'initialized.');
	}

	getStore() {
		return this._store;
	}

	isLoaded(target) {
		return !_.isEmpty(_.get(this._store, target));
	}

	updateSubscription(target, config) {
		// console.log('updateSubscription', {target, config});
		const {observe, scope} = this._targets[target];
		if (!observe || !scope) return;
		if (!config.query) config = {query: config};
		ClientSocket.updateSubscription({target, observe, scope, config});
	}

	closeSubscription(target) {
		ClientSocket.closeSubscription({target});
	}

	removeTarget(target) {
		// console.log('removeTarget', target);
		_.unset(this._targets, target);
		_.unset(this._store, target);
		_.unset(this._sources, target);
		_.unset(this._handlers, target);
		ClientSocket.closeSubscription({target});
	}

	addTarget(target, collection, initial, handler) {
		// if (_.includes(_.keys(this._targets), target)) return console.error(`Target ${target} already exists!`);
		_.unset(this._targets, target);
		_.unset(this._store, target);
		_.unset(this._sources, target);
		_.unset(this._handlers, target);

		const targetObject = {observe: collection, initial};

		targetObject.scope = 'one';
		if (_.isArray(initial)) targetObject.scope = 'many';
		if (_.isInteger(initial)) targetObject.scope = 'count';

		_.set(this._targets, target, targetObject);
		_.set(this._store, target, initial);
		_.set(this._sources, target, initial);
		if (_.isArray(initial)) {
			_.set(this._store, target + 'Count', 0);
			_.set(this._sources, target + 'Count', 0);
		}

		if (_.isFunction(handler)) _.set(this._handlers, target, handler);
	}

	loadOnce(target, collection, initial, config) {
		const closeSubscription = () => this.closeSubscription(target);
		this.addTarget(target, collection, initial, closeSubscription);
		this.updateSubscription(target, config);
	}

	_cleanup() {
		if (this._subscription) this._subscription.unsubscribe();
		this._subscription = null;
		this._targets = null;
		this._handlers = null;
		this._sources = null;
		this._store = null;
	}

	destroy() {
		this._cleanup();
		console.log(this._name, 'destroyed.');
	}

	_process(message) {
		// console.log('_process', message);
		const {type, target, payload} = message;
		const {scope} = this._targets[target];
		if (!scope) return;

		if (type === 'delete') {
			// TODO

		} else if (type === 'increment' && scope === 'many') {
			let current = _.get(this._sources, target);

			let incoming = _.get(payload, target);
			if (!_.isEmpty(incoming)) {
				if (_.isArray(incoming)) _.each(incoming, (item) => current.push(item));
				else current.push(incoming);

				_.reverse(current);
				current = _.uniqBy(current, '_id');
				_.reverse(current);

				_.set(this._store, target, current);
				_.set(this._sources, target, current);
			}

		} else {
			let incoming = _.get(payload, target);
			_.set(this._store, target, incoming);
			_.set(this._sources, target, incoming);
			if (scope === 'many') {
				let count = _.get(payload, '_' + target + 'Count');
				_.set(this._store, target + 'Count', count);
				_.set(this._sources, target + 'Count', count);
			}
		}

		let handler = _.get(this._handlers, target);
		if (_.isFunction(handler)) handler();
	}
}
