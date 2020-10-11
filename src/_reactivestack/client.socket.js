import _ from "lodash";
import {Subject} from "rxjs";
import ReconnectingWebSocket from "reconnecting-websocket";

import uuidv4 from "./_f.uuidv4";
import AuthService from "./auth.service";

// TODO: should depend on environment...
const WS_URI = "ws://localhost:3003/ws";

const _path = () => {
	let path = _.trim(_.get(window, "location.pathname", ""));
	if (_.startsWith(path, "/")) path = path.substr(1);
	return path;
};

export default class ClientSocket extends Subject {
	static _instance;
	static _socket;

	static _queue = [];

	static _onError = (err) => console.error(`[error] ${err.message}`);

	static _onClose = (e) => {
		if (e.wasClean) console.log(`[WS] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
		else console.log("[WS] Connection crashed.");
	};

	static _onOpen = async (e) => {
		console.log("[WS] Connection open.");
		ClientSocket._socket = e.target;
		// await ClientSocket.register(e.target);
		await ClientSocket.location(_path());

		_.each(this._queue, ClientSocket.send);
		this._queue = [];
	};

	static _onMessage = async (e) => {
		let {data: message} = e;
		message = JSON.parse(message);
		// console.log("[WS] Message received from server:", ClientSocket._socket.id, _.omit(message, "payload"), AuthService.loggedIn());
		console.log("[WS] Server message:", AuthService.loggedIn(), ClientSocket._socket.id, message.type, message.path, message.payload);

		let {payload} = message;
		switch (message.type) {
			case "socketId":
				ClientSocket._socket.id = message.socketId;
				await ClientSocket.register();
				return;

			case "refresh":
				AuthService.refresh(payload);
				return;

			case "update":
				if (!AuthService.loggedIn()) return;
				this._instance.next(message);
				return;

			default:
				return;
		}
	};

	static _connect = async () => {
		console.log("[WS] Connecting...");
		ClientSocket._socket = new ReconnectingWebSocket(WS_URI);

		ClientSocket._socket.onopen = ClientSocket._onOpen;
		ClientSocket._socket.onclose = ClientSocket._onClose;
		ClientSocket._socket.onerror = ClientSocket._onError;
		ClientSocket._socket.onmessage = ClientSocket._onMessage;
	};

	static async init() {
		if (!ClientSocket._instance) {
			ClientSocket._instance = new ClientSocket();
			await ClientSocket._connect();
		}
		return ClientSocket._instance;
	}

	static async register(socket) {
		if (socket) ClientSocket._socket = socket;
		if (!AuthService.loggedIn()) return;
		await ClientSocket.send({type: "register", jwt: AuthService.jwt()});
	}

	static send(message) {
		if (!message.id) message.id = uuidv4();
		if (!ClientSocket._socket || ClientSocket._socket.readyState !== WebSocket.OPEN) {
			this._queue.push(message);
			return;
		}

		message = _.isString(message) ? message : JSON.stringify(message);
		return ClientSocket._socket.send(message);
	}

	static async location(path) {
		if (!ClientSocket._instance) {
			ClientSocket._instance = new ClientSocket();
			await ClientSocket._connect();
		}

		ClientSocket.send({
			type: "location",
			path: path
		});
	}

}
