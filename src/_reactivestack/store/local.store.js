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

	static isLoaded(target) {
		return LocalStore._instance.isLoaded(target);
	}

	static loadOnce(target, collection, initial, config) {
		const closeSubscription = () => LocalStore._instance.closeSubscription(target);
		LocalStore._instance.addTarget(target, collection, initial, closeSubscription);
		LocalStore._instance.updateSubscription(target, config);
	}

	static addTarget(target, collection, initial, handler) {
		LocalStore._instance.addTarget(target, collection, initial, handler);
	}

	static removeTargets() {
		LocalStore._instance.removeTargets();
	}

	static removeTarget(target) {
		LocalStore._instance.removeTarget(target);
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
