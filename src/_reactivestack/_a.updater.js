import {filter} from "rxjs/operators";
import ClientSocket from "./client.socket";

export default class AUpdater {
	_initialized = false;
	_name;
	_subscription;
	_config;

	destroy() {
		this._subscription.unsubscribe();
		this._subscription = null;
		console.log(this._name, "destroyed.");
	}

	constructor(name, config) {
		if (!name) throw new Error("AUpdater::constructor error: Name is required.");
		this._name = name;

		this._init(config)
			.then(() => {
				this._initialized = true;
				console.log(this._name, "initialized.");
			})
			.catch((err) => console.error(this._name, "initialization error", err));
	}

	_isMyPath(path) {
		return !!path;
	}

	_process() {
	}

	isInitialized() {
		return this._initialized;
	}

	async _init(config) {
		let clientSocket = await ClientSocket.init();
		this._subscription = clientSocket
			.pipe(filter((message) => {
				let {type, path} = message;
				return "update" === type && this._isMyPath(path);
			}))
			.subscribe({
				next: (message) => this._process(message),
				error: (err) => console.log("error", err),
				complete: () => console.log("completed")
			});

		if (config) this.setConfig(config);
	}

	_initialConfig() {
		return {};
	}

	setConfig() {
	}
}
