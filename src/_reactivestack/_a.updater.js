import {filter} from 'rxjs/operators';
import ClientSocket from './client.socket';
import _ from 'lodash';

export default class AUpdater {
	_targets;
	_name;
	_subscription;
	_config;

	constructor(name, config) {
		if (!name) throw new Error('AUpdater::constructor error: Name is required.');
		this._name = name;
		this._targets = '';

		this._init(config)
			.then(() => console.log(this._name, 'initialized.'))
			.catch((err) => console.error(this._name, 'initialization error', err));
	}

	async _init(config) {
		let clientSocket = await ClientSocket.init();
		this._subscription = clientSocket //
			.pipe(filter((message) => this._isValidMessage(message)))
			.subscribe({
				next: (message) => this._process(message),
				error: (err) => console.log('error', err),
				complete: () => console.log('completed')
			});

		if (config) this.setConfig(config);
	}

	destroy() {
		this._subscription.unsubscribe();
		this._subscription = null;
		console.log(this._name, 'destroyed.');
	}

	set targets(target) {
		this._targets = target;
	}

	_isValidMessage(message) {
		const {type, target} = message;
		return 'update' === type && _.includes(this._targets, target);
	}

	_process() {
	}

	setConfig() {
	}
}
