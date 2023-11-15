const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = require('../index.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const [interactionCustomId, interactionUserId] = interaction.customId.split('__by__');
    const button = client.buttons.get(interactionCustomId);
    if (!button) return;
    try {
        if (button.permissions) {
            if (!interaction.memberPermissions.has(PermissionsBitField.resolve(button.permissions || []))) {
                const perms = new EmbedBuilder()
                    .setDescription(`🚫 ${interaction.user}, You don't have \`${button.permissions}\` permissions to interact this button!`)
                    .setColor('Red')
                return interaction.reply({ embeds: [perms], ephemeral: true })
            }
        }
        await button.run(client, interaction, interactionUserId ?? null);
    } catch (error) {
        console.log(require('chalk').redBright(`[ERROR] ${error.message}\n${error.stack}`));
    }
});