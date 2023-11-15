const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = require('../index.js');

client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    const [interactionCustomId, interactionUserId] = interaction.customId.split('__by__');
    const modal = client.modals.get(interactionCustomId);
    if (!modal) return;
    try {
        if (modal.permissions) {
            if (!interaction.memberPermissions.has(PermissionsBitField.resolve(modal.permissions || []))) {
                const perms = new EmbedBuilder()
                    .setDescription(`🚫 ${interaction.user}, You don't have \`${modal.permissions}\` permissions to interact this modal!`)
                    .setColor('Red')
                return interaction.reply({ embeds: [perms], ephemeral: true })
            }
        }
        await modal.run(client, interaction, interactionUserId ?? null);
    } catch (error) {
        console.log(require('chalk').redBright(`[ERROR] ${error.message}\n${error.stack}`));
    }
});