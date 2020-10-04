import {reactive} from 'vue';
import _ from "lodash";

import AuthService from "@/_reactivestack/auth.service";

export const loremStore = reactive({
	lorem: {},

	reset() {
		this.lorem = {};
	},

	setLorem(lorem) {
		const userId = AuthService.user().id;
		const field = _.findKey(lorem.meta, (field) => userId === field.user);
		this.lorem = _.merge(this.lorem, _.omit(lorem, [field]));
	},
	setValue(path, value) {
		_.set(this.lorem, path, value);
	}
});
