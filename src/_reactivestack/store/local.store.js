import ReactiveStore from '@/_reactivestack/store/reactive.store';

export default class LocalStore {
	static _instance;

	static init() {
		if (!LocalStore._instance) LocalStore._instance = new ReactiveStore('LocalStore');
		return LocalStore._instance.init();
	}

	static getStore() {
		if (!LocalStore._instance) return LocalStore.init();
		return LocalStore._instance.getStore();
	}

	static addTarget(name, collection, initial) {
		LocalStore._instance.addTarget(name, collection, initial);
	}

	static removeTarget(name) {
		LocalStore._instance.removeTarget(name);
	}

	static updateSubscription(target, config) {
		LocalStore._instance.updateSubscription(target, config);
	}

	static closeSubscription(target) {
		LocalStore._instance.closeSubscription(target);
	}

	static destroy() {
		LocalStore._instance.destroy();
	}
}
