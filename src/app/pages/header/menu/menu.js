import _ from "lodash";
import AuthService from "@/_reactivestack/auth.service";

let pathname = _.replace(window.location.pathname, "/", "");

export default {
	name: "Menu",
	data() {
		return {
			isHome: _.isEmpty(pathname),
			isAbout: "about" === pathname,
			loggedIn: AuthService.loggedIn()
		}
	},
	watch: {
		$route() {
			let pathname = _.replace(window.location.pathname, "/", "");
			this.isHome = _.isEmpty(pathname);
			this.isAbout = "about" === pathname;
			this.loggedIn = AuthService.loggedIn();
		}
	}
}
