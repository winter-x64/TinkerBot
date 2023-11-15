const { EmbedBuilder } = require("discord.js");

module.exports = {
    id: "compile_modal",
    run: async (_client, interaction, interactionUserId) => {
        const language = interaction.fields.getTextInputValue("compile_language");
        const code = interaction.fields.getTextInputValue("compile_code");

        const embed = new EmbedBuilder()
            .setTitle("Compile")
            .addFields({
                name: "Language",
                value: language
            }, {
                name: "Code",
                value: "```" + language + "\n" + code + "\n```"

            })
            .setColor("#2f3136")
            .setFooter({
                text: `Submitted by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        interaction.channel.send({ embeds: [embed] });
    }
};