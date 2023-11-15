const fs = require('fs');
const chalk = require('chalk');

const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest')

const client = require('../index.js');
const { clientId } = require("../config.json")

const TOKEN = client.token;

const rest = new REST({ version: '9' }).setToken(TOKEN);

module.exports = (client) => {
	const slashCommands = [];
	const CLIENT_ID = process.env.testBotId ?? clientId;
	fs.readdirSync('./slashCommands/').forEach(async dir => {
		const files = fs.readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

		for (const file of files) {
			const slashCommand = require(`../slashCommands/${dir}/${file}`);
			slashCommands.push({
				name: slashCommand.name,
				description: slashCommand.description,
				type: slashCommand.type,
				options: slashCommand.options ? slashCommand.options : null,
				default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
				default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
			});

			if (slashCommand.name) {
				client.slashCommands.set(slashCommand.name, slashCommand)
			}
		}
	});
	console.log(chalk.blue(`Slash Commands Loaded ✅`));
	(async () => {
		try {
			await rest.put(
				Routes.applicationCommands(CLIENT_ID),
				{ body: slashCommands }
			);
			console.log(chalk.yellow('Slash Commands • Registered'))
		} catch (error) {
			console.log(error);
		}
	})();
};
