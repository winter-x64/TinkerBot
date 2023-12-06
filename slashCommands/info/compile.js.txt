const { ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, ApplicationCommandType, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "compile",
    description: "Compile your code online.",
    // type: ApplicationCommandType.ChatInput,
    run: async (_client, interaction) => {
        const btn = new ButtonBuilder()
            .setStyle("Success")
            .setLabel("Start")
            .setCustomId(`compile_btn__by__${interaction.user.id}`)
            .setEmoji("👨‍💻");
        interaction.reply({ephemeral: true, components: [new ActionRowBuilder().addComponents(btn)]})
    }
};
