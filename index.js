console.clear();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({
	intents: 3276799,
});
const chalk = require('chalk');

const fs = require('fs');
require('dotenv').config();

const supabase = require("@supabase/supabase-js");
const connectSupaClient = () => {
	try {
		supaClient = supabase.createClient(process.env.supabaseUrl, process.env.supabaseKey);
		console.log(chalk.green("Connected to Supabase!"));
	} catch (e) {
		supaClient = null;
		console.log(chalk.red("Failed to connect to Supabase!"));
	}
	return supaClient;
}
const supabaseClient = connectSupaClient();

const config = client.config = require('./config.json');

client.config.emojis = require('./emojis.json');
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
client.supabase = supabaseClient;
client.gameNight = config.gameNight;
client.eventTeamRole = config.eventTeamRole;

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