import ReactiveStore from '@/_reactivestack/store/reactive.store';

export default class GlobalStore {
	static _instance;

	static getStore() {
		if (!GlobalStore._instance) {
			GlobalStore._instance = new ReactiveStore('GlobalStore');
			return GlobalStore._instance.init();
		}
		return GlobalStore._instance.getStore();
	}

	static addTarget(name, collection, initial, handler) {
		GlobalStore._instance.addTarget(name, collection, initial, handler);
	}

	static removeTarget(name) {
		GlobalStore._instance.removeTarget(name);
	}

	static updateSubscription(target, config) {
		GlobalStore._instance.updateSubscription(target, config);
	}

	static closeSubscription(target) {
		GlobalStore._instance.closeSubscription(target);
	}

	static destroy() {
		GlobalStore._instance.destroy();
	}
}
