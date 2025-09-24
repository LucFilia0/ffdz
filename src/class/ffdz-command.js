import { SlashCommandBuilder } from 'discord.js';

export default class extends SlashCommandBuilder {

	constructor (name, description) {
		super();
		this.setName(name);
		this.setDescription(description);
	}

}
