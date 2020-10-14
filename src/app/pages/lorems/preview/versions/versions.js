// import _ from "lodash";
import _ from "lodash";
import moment from "moment";

import ClientSocket from "@/_reactivestack/client.socket";

import {loremsStore} from "@/app/pages/lorems/_store/lorems.store";

export default {
	name: "PreviewVersions",
	store: loremsStore,
	methods: {
		getVersions() {     // this is weird, but... apparently when empty it returns {0: undefined}
			return _.isEmpty(this.$store.selectedLoremVersions[0]) ? [] : this.$store.selectedLoremVersions;
		},
		getRowClass(lorem) {
			return loremsStore.selectedLorem && lorem && lorem._id === loremsStore.selectedLorem._id ? "active" : "";
		},
		momentDate(date) {
			return moment(date).format("YYYY/MM/DD HH:mm:ss");
		},
		selectRow(lorem) {
			loremsStore.setSelectedLorem(lorem);   // optimistic update !!!

			ClientSocket.sendSubscribe({
				target: "selected",
				observe: "lorems",
				scope: "one",
				config: {
					query: {_id: lorem._id}
				}
			});
		}
	}
}
