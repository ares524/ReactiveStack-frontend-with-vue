import _ from 'lodash';

import router from '@/router';
import Auth from '@/_reactivestack/auth';

if (window.location.pathname !== '/' && !_.startsWith(window.location.pathname, '/login')) {
	localStorage.setItem('initialPageRequest', window.location.pathname);
}

let user = Auth.user();

export default {
	name: 'User',
	data() {
		return {
			provider: _.toLower(_.first(_.words(_.get(user, 'provider', '')))),
			providerId: _.toLower(_.first(_.words(_.get(user, 'providerId', '')))),
			notLoggedIn: !Auth.loggedIn()
		};
	},
	methods: {
		facebook() {
			router.push('/login/facebook');
		},
		google() {
			router.push('/login/google');
		}
	},
	watch: {
		$route() {
			let user = Auth.user();
			this.provider = _.toLower(_.first(_.words(_.get(user, 'provider', ''))));
			this.providerId = _.toLower(_.first(_.words(_.get(user, 'providerId', ''))));
			this.notLoggedIn = !Auth.loggedIn();
		}
	}
};
