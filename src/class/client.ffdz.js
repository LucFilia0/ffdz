import { Client, GatewayIntentBits } from "discord.js";

export default class {

	static #intents = [];

	static #instance = null;

	static getInstance() {
		if (this.#instance == null) {
			this.#instance = new Client({ intents: this.#intents });
		}
		return this.#instance;
	}

}
