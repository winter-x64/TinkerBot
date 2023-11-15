const {ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder} = require("discord.js");

module.exports = {
    id: "compile_btn",
    run : async (_client, interaction, interactionUserId) => {
        const modal = new ModalBuilder()
            .setTitle("Compile")
            .setCustomId("compile_modal");

        const language = new TextInputBuilder()
            .setLabel("Language")
            .setStyle(TextInputStyle.Short)
            .setCustomId("compile_language");

        const code = new TextInputBuilder()
            .setLabel("Code")
            .setCustomId("compile_code")
            .setStyle(TextInputStyle.Paragraph);

        const row1 = new ActionRowBuilder().addComponents(language);
        const row2 = new ActionRowBuilder().addComponents(code);

        modal.addComponents(row1, row2);
        await interaction.showModal(modal);
    }
};
