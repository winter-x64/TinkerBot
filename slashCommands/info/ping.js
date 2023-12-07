const { ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'ping',
	description: "Check the bot's latency.",
	type: ApplicationCommandType.ChatInput,
	developerOnly: true,
	cooldown: 3000,
	run: async (client, interaction) => {
		interaction.reply({ content: `🏓 Pong! Latency: **${Math.round(client.ws.ping)} ms**` })
	}
};