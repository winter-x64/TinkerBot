console.clear();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	],
});

const fs = require('fs');
require('dotenv').config();

const config = require('./config.json');

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

client.token = process.env?.testBot ?? process.env.token;
client.ownerId = config.ownerId;
client.prefix = config.prefix;
client.developers = config.developers;
client.admins = config.admins;

module.exports = client;

fs.readdirSync('./handlers').forEach((handler) => {
	require(`./handlers/${handler}`)(client)
});

client.login();

process.on('uncaughtException', (err) => {
	console.log(err);
});

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled Rejection at:", reason.stack || reason)
});