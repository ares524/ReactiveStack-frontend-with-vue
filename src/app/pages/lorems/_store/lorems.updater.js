import _ from "lodash";

import AUpdater from "@/_reactivestack/_a.updater";
import {loremsStore} from "./lorems.store";
import ClientSocket from "@/_reactivestack/client.socket";

const _initialConfig = () => ({
	page: 1,
	pageSize: 10,
	search: "",
	sort: {createdAt: -1}
});

const STRING_COLUMNS = ["firstname", "lastname", "email", "description"];
const NUMBER_COLUMNS = ["iteration", "rating"];

export default class LoremsUpdater extends AUpdater {
	static _SECTIONS = ["lorems", "selected", "selectedVersions"];

	constructor() {
		super("LoremsUpdater");
		this.setConfig(_initialConfig());
	}

	_isMyPath(path) {
		return _.includes(LoremsUpdater._SECTIONS, path);
	}

	_process(message) {
		let {path, payload} = message;

		switch (path) {
			case "lorems":
				loremsStore.setLorems(payload.lorems);
				loremsStore.setLoremsTotalCount(payload._loremsCount);
				break;

			case "selected":
				loremsStore.setSelectedLorem(payload.selected);
				break;

			case "selectedVersions":
				loremsStore.setSelectedLoremVersions(payload.selectedVersions);
				break;

			default:
				break;
		}
	}

	setConfig(config) {
		this._config = config || _initialConfig();
		let {search, sort, page, pageSize} = this._config;

		let query = {isLatest: true};
		if (!_.isEmpty(search)) {
			let or = _.map(STRING_COLUMNS, (column) => {
				let q = {};
				_.set(q, column, {$regex: search});
				return q;
			});
			if (!isNaN(search)) {
				let number = _.toInteger(search);
				let numberOr = _.map(NUMBER_COLUMNS, (column) => {
					let q = {};
					_.set(q, column, number);
					return q;
				});
				or = _.concat(or, numberOr);
			}

			query = {
				isLatest: true,
				$or: or
			};
		}

		ClientSocket.sendSubscribe({
			target: "lorems",
			observe: "lorems",
			scope: "many",
			config: {query, sort, page, pageSize}
		});
	}

	unselect() {
		if (_.isEmpty(loremsStore.selectedLorem)) return;
		loremsStore.setSelectedLorem({});
		loremsStore.setSelectedLoremVersions([]);

		ClientSocket.sendUnsubscribe({target: "selected"});
		ClientSocket.sendUnsubscribe({target: "selectedVersions"});
	}

	select(lorem) {
		loremsStore.setSelectedLorem(lorem);		// optimistic update
		loremsStore.setSelectedLoremVersions([]);	// cleanup

		ClientSocket.sendSubscribe({
			target: "selected",
			observe: "lorems",
			scope: "one",
			config: {
				query: {
					itemId: lorem.itemId,
					isLatest: true
				}
			}
		});

		ClientSocket.sendSubscribe({
			target: "selectedVersions",
			observe: "lorems",
			scope: "many",
			config: {
				query: {
					itemId: lorem.itemId
				},
				sort: {iteration: -1}
			}
		});
	}

}
