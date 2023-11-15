const { ActivityType } = require('discord.js');
const client = require('../index.js');
const chalk = require('chalk');

client.on("ready", () => {
	client.user.setPresence({
		activities: [
			{
				name: `all the Tinkerings`,
				type: ActivityType.Watching
			}
		]
	})
	console.log(chalk.hex("#00ffee")(`Logged in as ${client.user.tag}!`))
});