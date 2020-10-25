import _ from "lodash";
import {v4 as uuidv4} from 'uuid';
import queryString from "query-string";

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

const VUE_APP_API_PATH = process.env.VUE_APP_API_PATH;

const FB_APP_ID = process.env.VUE_APP_FB_APP_ID;
const FB_REDIRECT_URI = document.location.origin + "/login/facebook";

const GG_APP_ID = process.env.VUE_APP_GG_APP_ID;
const GG_REDIRECT_URI = document.location.origin + "/login/google";
const GG_SCOPE = "email profile";

let provider;

const login = async (code) => {
	const {api, redirect_uri} = _getApiAndRedirect(provider);
	const response = await fetch(VUE_APP_API_PATH + api, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify({code, redirect_uri}),
	});
	const body = await response.json();
	const {jwt, user} = body;
	AuthService.login(user, jwt);

	const initialPageRequest = localStorage.getItem("initialPageRequest");
	localStorage.removeItem("initialPageRequest");

	if (!!initialPageRequest && "/logout" !== initialPageRequest) router.push(initialPageRequest);   // window.location = initialPageRequest;
	else router.push("/");
	return true;
};

const _getApiAndRedirect = (provider) => {
	switch (provider) {
		case "facebook":
			return {
				api: "/auth/facebook",
				redirect_uri: FB_REDIRECT_URI,
			};
		case "google":
			return {
				api: "/auth/google",
				redirect_uri: GG_REDIRECT_URI,
			};
		default:
			throw new Error("Social::getApiAndRedirect:Unknown provider: " + provider);
	}
};

const _getSocialUrl = (provider) => {
	switch (provider) {
		case "facebook":
			return `https://www.facebook.com/v5.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${FB_REDIRECT_URI}&state=${uuidv4()}`;
		case "google":
			return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GG_APP_ID}&redirect_uri=${GG_REDIRECT_URI}&response_type=code&scope=${GG_SCOPE}`;
		default:
			throw new Error("Social::getSocialUrl:Unknown provider: " + provider);
	}
};

export default {
	name: "Social",
	created() {
		provider = _.replace(window.location.pathname, "/login/", "");
		const params = queryString.parse(window.location.search);
		if (!params || !params.code) {
			let url = _getSocialUrl(provider);
			window.location.replace(url);
			return null;
		}
		login(params.code);
	}
}