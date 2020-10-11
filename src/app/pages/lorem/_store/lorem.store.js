import {reactive} from "vue";
import _ from "lodash";

import AuthService from "@/_reactivestack/auth.service";

export const loremStore = reactive({
	draft: {},
	lorem: {},

	reset() {
		this.draft = {};
		this.lorem = {};
	},

	setDraft(draft) {
		if (!draft) return this.reset();

		this.draft = _.omit(draft, ["document"]);
		this.setLorem(draft.document);
	},

	setLorem(lorem) {
		if (!lorem) return this.reset();

		const userId = AuthService.userId();
		const field = _.findKey(this.draft.meta, (field) => userId === field.user);
		if (field) this.lorem = _.merge(this.lorem, _.omit(lorem, [field]));
		else this.lorem = lorem;
	},

	setValue(path, value) {
		_.set(this.lorem, path, value);
	}
});
