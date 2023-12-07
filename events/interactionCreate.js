const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('../index.js');

const cooldown = new Collection();

client.on('interactionCreate', async (interaction) => {
	const slashCommand = client.slashCommands.get(interaction.commandName);
	if (interaction.type == 4) {
		if (slashCommand.autocomplete) {
			const choices = [];
			await slashCommand.autocomplete(interaction, choices)
		}
	}
	if (!interaction.type == 2) return;

	if (!slashCommand) return client.slashCommands.delete(interaction.commandName);
	try {

		if (slashCommand.eventTeamOnly && !(interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(client.eventTeamRole))) return interaction.reply({ content: `You have to be a part of the event team to use this command!`});
		if (slashCommand.developerOnly && !client.developers.includes(interaction.user.id)) return interaction.reply({ content: `You have to be a developer to use this command!`});

		if (slashCommand.cooldown && !client.admins.includes(interaction.user.id)) {
			if (cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: `You have to wait ` + ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), { long: true }) + `  before you can use this command again!`, ephemeral: true })
			if (slashCommand.userPerms || slashCommand.botPerms) {
				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}

			}

			await slashCommand.run(client, interaction);
			cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
			setTimeout(() => {
				cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
			}, slashCommand.cooldown)
		} else {
			if (slashCommand.userPerms || slashCommand.botPerms) {
				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}

			}
			await slashCommand.run(client, interaction);
		}
	} catch (error) {
		console.log(error);
	}
});