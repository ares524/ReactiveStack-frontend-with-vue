import ReactiveStore from './reactive.store';

export default class GlobalStore {
	static _instance;

	static getStore() {
		if (!GlobalStore._instance) GlobalStore._instance = new ReactiveStore('GlobalStore');
		return GlobalStore._instance.getStore();
	}

	static isLoaded(target) {
		return GlobalStore._instance.isLoaded(target);
	}

	static addSubscription(target, collection, initial, config, handler) {
		GlobalStore._instance.addTarget(target, collection, initial, handler);
		GlobalStore._instance.updateSubscription(target, config);
	}

	static reloadData(target) {
		GlobalStore._instance.reloadData(target);
	}

}
