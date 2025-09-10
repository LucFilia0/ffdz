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

import FFDZ_Client from "./inc/client.ffdz.js"
import FFDZ_REST from "./inc/rest.ffdz.js";
import FFDZ_CommandData from "./data/command.data.js";
import FFDZ_Format from "./inc/format.ffdz.js";

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

	let joke = null;
	
	switch (interaction.commandName) {

		case "geda":
			await interaction.deferReply();
			joke = await blaguesAPIConnection.randomCategorized(blaguesAPIConnection.categories.DARK);
			await interaction.editReply(FFDZ_Format.joke(joke ?? "Error"));
			break;

		case "gedi":
			await interaction.deferReply();
			joke = await blaguesAPIConnection.randomCategorized(blaguesAPIConnection.categories.LIMIT);
			await interaction.editReply(FFDZ_Format.joke(joke ?? "Error"));
			break;

	}
});

// Connect bot to Discord
FFDZ_Client.getInstance().on(Events.ClientReady, () => {
	console.log(`Logged as ${FFDZ_Client.getInstance().user.tag}`);
});

FFDZ_Client.getInstance().login(process.env.BOT_TOKEN);
