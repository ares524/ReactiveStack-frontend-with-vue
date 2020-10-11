import {loremStore} from "./lorem.store";
import AUpdater from "@/_reactivestack/_a.updater";
import ClientSocket from "@/_reactivestack/client.socket";

const _initialConfig = () => ({_id: null});

export default class LoremUpdater extends AUpdater {
	_path = "draft";

	constructor() {
		super("LoremUpdater");
	}

	_isMyPath(path) {
		return this._path === path;
	}

	_process(message) {
		let {path, payload} = message;

		switch (path) {
			case "draft":
				loremStore.setDraft(payload.draft);
				break;

			default:
				break;
		}
	}

	setConfig(config) {
		this._config = config || _initialConfig();

		ClientSocket.send({
			type: "subscribe",
			target: "draft",
			observe: "drafts",
			scope: "one",
			config: {
				query: this._config
			}
		});
	}
}
