import {loremStore} from "./lorem.store";
import AUpdater from "@/_reactivestack/_a.updater";
import ClientSocket from "@/_reactivestack/client.socket";

const _initialConfig = () => ({_id: null});

export default class LoremUpdater extends AUpdater {

	constructor() {
		super("LoremUpdater");
		this._targets = 'draft';
	}

	_process(message) {
		let {target, payload} = message;

		switch (target) {
			case "draft":
				loremStore.setDraft(payload.draft);
				break;

			default:
				break;
		}
	}

	setConfig(config) {
		this._config = config || _initialConfig();

		ClientSocket.sendSubscribe({
			target: "draft",
			observe: "drafts",
			scope: "one",
			config: {
				query: this._config
			}
		});
	}
}
