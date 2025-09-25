import { Client, GatewayIntentBits, REST, Routes, Events } from 'discord.js';
import JokeConnection from 'blagues-api';
import FFDZ_Command from './class/ffdz-command.js';
import FFDZ_Format from './class/ffdz-format.js';
import { readFileSync } from 'fs';

// -- CONSTANTS

const PORT = process.env.PORT || 1212;

const CLIENT_ID 	= process.env.CLIENT_ID		|| 'Not found';
const GUILD_ID 		= process.env.GUILD_ID 		|| 'Not found';
const BOT_TOKEN 	= process.env.BOT_TOKEN 	|| 'Not found';
const REST_VERSION 	= process.env.REST_VERSION	|| '10';

const JOKE_TOKEN	= process.env.JOKE_TOKEN	|| 'Not found';

const GOUFFRE_RULES = JSON.parse(readFileSync('/app/data/gouffre.json', 'utf8'));

// -- CONNECTIONS

// Creating Discord's client, waiting for incomming messages
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
]});

// Creating Discord's REST object, allowing to send data to the server
const rest = new REST({ version: REST_VERSION }).setToken(BOT_TOKEN);

// Creating BlaguesAPI connection
const jokeConnection = new JokeConnection(JOKE_TOKEN);

// -- COMMANDS

// Definition
const botCommands = [
	new FFDZ_Command('geda', 'Raconte une blague "DARK"'),
	new FFDZ_Command('gedi', 'Raconte une blague "LIMIT"'),
	new FFDZ_Command('gouffre', 'Finis ton verre')
];

// Registering slash commands to the server
(async () => {
	try {
		console.log('Registering commands to the server...');
		await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: botCommands.map(cmd => cmd.toJSON()) }
		);
		console.log('Commands are successfully registered!');
	} catch (err) {
		console.error(`Something went wrong while registering commands to the server : ${err.message}`);
		process.exit(1);
	}
})();

// -- ACTIONS

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand())
		return false;

	let buffer = null;
	const defaultJoke = {
		joke: 'Une erreur est survenue',
		answer: 'Mange tes morts'
	};

	switch (interaction.commandName) {

		case 'geda':
			await interaction.deferReply();
			buffer = await jokeConnection.randomCategorized(jokeConnection.categories.DARK);
			await interaction.editReply(FFDZ_Format.joke(buffer || defaultJoke));
			break;

		case 'gedi':
			await interaction.deferReply();
			buffer = await jokeConnection.randomCategorized(jokeConnection.categories.LIMIT);
			await interaction.editReply(FFDZ_Format.joke(buffer || defaultJoke));
			break;

		case 'gouffre':
			buffer = parseInt(( Math.random() * 100 ) % 69);
			interaction.reply(FFDZ_Format.gouffre(GOUFFRE_RULES[buffer]));
			break;

	}
});

client.on(Events.ClientReady, () => {
	console.log(`Logged as ${client.user.tag}`);
});

// -- CONNECT

client.login(BOT_TOKEN);
