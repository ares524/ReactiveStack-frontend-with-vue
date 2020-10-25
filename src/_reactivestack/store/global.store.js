import ReactiveStore from '@/_reactivestack/store/reactive.store';

export default class GlobalStore {
	static _instance;

	static async init(storeTargets) {
		if (!GlobalStore._instance) GlobalStore._instance = new ReactiveStore('GlobalStore');
		await GlobalStore._instance.init(storeTargets);
		return GlobalStore._instance;
	}

	static sendSubscribe(target, config) {
		GlobalStore._instance.sendSubscribe(target, config);
	}

	static sendUnsubscribe(target) {
		GlobalStore._instance.sendUnsubscribe(target);
	}

	static getStore() {
		return GlobalStore._instance.getStore();
	}

	static destroy() {
		GlobalStore._instance.destroy();
	}
}
