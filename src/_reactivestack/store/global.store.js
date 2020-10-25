import ReactiveStore from '@/_reactivestack/store/reactive.store';

export default class GlobalStore {
	static _instance;

	static async init(storeTargets) {
		if (!GlobalStore._instance) GlobalStore._instance = new ReactiveStore('GlobalStore');
		await GlobalStore._instance.init(storeTargets);
		return GlobalStore._instance;
	}

	static addTarget(name, collection, initial) {
		GlobalStore._instance.addTarget(name, collection, initial);
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

	static getStore() {
		return GlobalStore._instance.getStore();
	}

	static destroy() {
		GlobalStore._instance.destroy();
	}
}
