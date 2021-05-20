import {ref, computed, watch} from 'vue';

import _ from 'lodash';
import moment from 'moment';

import router from '@/router';
import Auth from '@/_reactivestack/auth.service';
import LocalStore from '@/_reactivestack/store/local.store';
import {sendGet, sendPost} from '@/factories/_f.send.fetch';

export default {
	name: 'Lorem',
	props: ['draftId'],

	route() {
		return {path: '/lorem/:draftId', component: this, props: true};
	},

	setup(props) {
		const store = ref(LocalStore.init());
		LocalStore.addTarget('draft', 'drafts', {});
		LocalStore.updateSubscription('draft', {_id: props.draftId});

		const isDisabled = (fieldName) => {
			if (store.value.draft) {
				let meta = store.value.draft.meta;
				if (meta) {
					let field = _.get(meta, fieldName);
					if (field) {
						let user = _.get(field, 'user');
						return user !== Auth.userAttribute('_id');
					}
				}
			}
			return false;
		};

		const isDraft = computed(() => !_.isEmpty(_.get(store, 'value.draft')));

		watch(isDraft, async (value) => {
			if (value !== true) await router.push('/');
		});

		return {
			store,

			notLoaded: () => !_.get(store.value, 'draft.document', false),

			SPECIES: ['Human', 'Draenei', 'Dryad', 'Dwarf', 'Gnome', 'Worgde'],

			isDraft,
			isDisabled,

			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),

			onFocus: (field) => {
				if (isDisabled(field)) return;
				sendPost('/api/draft/focus/' + store.value.draft._id, {field});
			},

			onBlur: (field) => {
				sendPost('/api/draft/blur/' + store.value.draft._id, {field});
			},

			onChange: _.throttle(
				function ({target: {name: field, value}}) {
					_.set(store.value.draft.document, field, value);
					sendPost('/api/draft/change/' + store.value.draft._id, {value, field});
				},
				250,
				{leading: true}
			),

			closeDialog: async () => {
				await sendGet('/api/draft/cancel/' + store.value.draft._id);
				// TODO: remove this and observe the data change!
				router.push('/');
			},

			saveLorem: async () => {
				await sendGet('/api/draft/save/' + store.value.draft._id);
				// TODO: remove this and observe the data change!
				router.push('/');
			}
		};
	}
};
