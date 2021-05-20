import _ from 'lodash';
import Auth from '@/_reactivestack/auth.service';

let pathname = _.replace(window.location.pathname, '/', '');

export default {
	name: 'Menu',
	data() {
		return {
			isHome: _.isEmpty(pathname),
			isAbout: 'about' === pathname,
			loggedIn: Auth.loggedIn()
		};
	},
	watch: {
		$route() {
			let pathname = _.replace(window.location.pathname, '/', '');
			this.isHome = _.isEmpty(pathname);
			this.isAbout = 'about' === pathname;
			this.loggedIn = Auth.loggedIn();
		}
	}
};
