import { REST } from "discord.js";

/**
 * Establish a connection with the Discord API
 */
export default class {

	static #version = "10";

	static #instance = null;

	static getInstance() {
		if (this.#instance == null) {
			this.#instance = new REST({ version: this.#version })
				.setToken(process.env.BOT_TOKEN);
		}
		return this.#instance;
	}

}
