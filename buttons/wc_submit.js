const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    id: "wc_submit_btn",
    run: async (_client, interaction, interactionUserId) => {
        if (interaction.user.id !== interactionUserId) {
            interaction.reply({
                content: `This submission is only for <@${interactionUserId}> !`,
                ephemeral: true
            });
        } else {
            const modal = new ModalBuilder()
                .setCustomId('wc_submission_modal')
                .setTitle('Weekly Challenge Submission');
            const favoriteColorInput = new TextInputBuilder()
                .setCustomId('favoriteColorInput')
                .setLabel("What's your favorite color?")
                .setStyle(TextInputStyle.Short);

            const hobbiesInput = new TextInputBuilder()
                .setCustomId('hobbiesInput')
                .setLabel("What's some of your favorite hobbies?")
                .setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
            const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

            modal.addComponents(firstActionRow, secondActionRow);

            await interaction.showModal(modal);

        }
    }
};