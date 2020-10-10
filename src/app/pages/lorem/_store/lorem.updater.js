import {loremStore} from "./lorem.store";
import AUpdater from "@/_reactivestack/_a.updater";
import ClientSocket from "@/_reactivestack/client.socket";

const _initialConfig = () => ({_id: null});

export default class LoremUpdater extends AUpdater {
	_path = "lorem";

	constructor() {
		super("LoremUpdater");
	}

	_isMyPath(path) {
		return this._path === path;
	}

	_process(message) {
		let {path, payload} = message;

		switch (path) {
			case "lorem":
				loremStore.setLorem(payload.lorem);
				break;

			default:
				break;
		}
	}

	setConfig(config) {
		this._config = config || _initialConfig();

		ClientSocket.send({
			type: "subscribe",
			target: "lorem",
			observe: "lorems",
			scope: "one",
			config: {
				query: this._config
			}
		});
	}
}
