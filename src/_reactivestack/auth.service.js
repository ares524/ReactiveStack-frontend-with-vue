import _ from 'lodash';
import ClientSocket from '@/_reactivestack/client.socket';

const DEFAULT_USER_INFO = {user: {}, jwt: ''};

const _getLocalStorageUserInfo = () => {
	let userInfo = localStorage.getItem('userInfo');
	return userInfo ? JSON.parse(userInfo) : DEFAULT_USER_INFO;
};

class AuthService {
	_user;
	_jwt;

	constructor() {
		this._user = {};
		this._jwt = '';
		this._checkLocalStorage();
	}

	getAuthHeader() {
		return {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + _getLocalStorageUserInfo().jwt,
			FusionPage: _.trim(_.get(window, 'location.pathname', '/'))
		};
	}

	refresh({user, jwt}) {
		console.log('[Auth] refresh:', {user, jwt});
		if (!!user && !!jwt) {
			localStorage.setItem('userInfo', JSON.stringify({user, jwt}));
			this._setData({user, jwt});
		} else {
			// TODO: error?
		}
	}

	login(user, jwt) {
		console.log('[Auth] auth:', {user, jwt});
		if (!!user && !!jwt) {
			localStorage.setItem('userInfo', JSON.stringify({user, jwt}));
			this._setData({user, jwt});
			ClientSocket.authenticate();
		} else {
			this.logout();
		}
	}

	logout() {
		console.log('[Auth] logout.');
		localStorage.removeItem('userInfo');
		this._setData(DEFAULT_USER_INFO);
	}

	jwt() {
		return this._jwt;
	}

	user() {
		return this._user;
	}

	userAttribute(name) {
		return _.get(this._user, name);
	}

	loggedIn() {
		return !_.isEmpty(this._user);
	}

	_setData(data) {
		let {user, jwt} = data;
		this._user = user;
		this._jwt = jwt;
	}

	_checkLocalStorage() {
		let userInfo = _getLocalStorageUserInfo();
		if (!!userInfo?.user?.expires_at) {
			const expiresAt = userInfo.user.expires_at;
			const now = new Date().getTime();
			if (now < expiresAt) return this._setData(userInfo);
		}
		this.logout();
	}
}

export default new AuthService();
