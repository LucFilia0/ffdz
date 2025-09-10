import dotenv from "dotenv";

// Launching environment variables
dotenv.config();

// Checking if file was correctly launched
if (
	process.env.BOT_TOKEN == null ||
	process.env.CLIENT_ID == null ||
	process.env.GUILD_ID == null
) {
	console.error("Can't read .env file.");
	process.exit(1);
}

import { Routes, Events } from "discord.js";
import BlaguesAPI from "blagues-api";

import FFDZ_Client from "./class/client.ffdz.js";
import FFDZ_REST from "./class/rest.ffdz.js";
import FFDZ_CommandData from "./data/command.data.js";

// Registering commands on guild
(async () => {
	try {
		console.log("Registering commands on guild...");
		await FFDZ_REST.getInstance().put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: FFDZ_CommandData.map(cmd => cmd.toJSON()) }
		);
		console.log("Command registered.");
	} catch (err) {
		console.log(err);
		console.error("Can't register commands.");
		process.exit(1);
	}
})();

// Blaques API setup
const blaguesAPIConnection = new BlaguesAPI(process.env.BLAGUES_TOKEN);

// Client actions
FFDZ_Client.getInstance().on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand())
		return;
	
	switch (interaction.commandName) {

		case "geda":
			const joke = await blaguesAPIConnection.randomCategorized(blaguesAPIConnection.categories.DARK);
			await interaction.reply(`"*${joke.joke}*"\n||"*${joke.answer}*"||`);
			break;

		case "gedi":
			await interaction.reply("gedi");
			break;

	}
});

// Connect bot to Discord
FFDZ_Client.getInstance().on(Events.ClientReady, () => {
	console.log(`Logged as ${FFDZ_Client.getInstance().user.tag}`);
});

FFDZ_Client.getInstance().login(process.env.BOT_TOKEN);
