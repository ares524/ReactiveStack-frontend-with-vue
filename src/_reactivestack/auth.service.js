/* eslint-disable no-debugger */
const DEFAULT_USER_INFO = {user: {}, jwt: ''};

const _getLocalStorageUserInfo = () => {
	let userInfo = localStorage.getItem('userInfo');
	return userInfo ? JSON.parse(userInfo) : DEFAULT_USER_INFO;
};

class AuthService {
	_user = {};
	_jwt = '';

	constructor() {
		this.checkLocalStorage();
	}

	user() {
		return this._user;
	}

	jwt() {
		return this._jwt;
	}

	loggedIn() {
		return !!this._user.id;
	}

	sendState(state) {
		let {user, jwt} = state;
		this._user = user;
		this._jwt = jwt;
	}

	checkLocalStorage() {
		let userInfo = _getLocalStorageUserInfo();
		if (!!userInfo && !!userInfo.user && !!userInfo.user.expires_at) {
			const expiresAt = userInfo.user.expires_at;
			const now = new Date().getTime();
			console.log({userInfo, now, expiresAt, check: now < expiresAt})
			if (now < expiresAt) return this.sendState(userInfo);
		}
		this.logout();
	}

	refresh({user, jwt}) {
		if (!!user && !!jwt) {
			localStorage.setItem('userInfo', JSON.stringify({user, jwt}));
			this.sendState({user, jwt});
		} else {
			// TODO: error?
		}
	}

	login(user, jwt) {
		// debugger;
		if (!!user && !!jwt) {
			localStorage.setItem('userInfo', JSON.stringify({user, jwt}));
			this.sendState({user, jwt});
		} else {
			this.logout();
		}
	}

	logout() {
		// debugger;
		localStorage.removeItem('userInfo');
		this.sendState(DEFAULT_USER_INFO);
	}

	getAuthHeader() {
		return {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + _getLocalStorageUserInfo().jwt,
		};
	}
}

export default new AuthService();
