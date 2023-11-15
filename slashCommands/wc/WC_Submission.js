const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "wc_run",
    description: "Weekly submission command",
    options: [
        {
            name: "question",
            description: "The question",
            type: 3,
            required: true
        }
    ],
    run: async (_client, interaction) => {
        const question = interaction.options.getString("question");
        const embed = new EmbedBuilder()
            .setTitle("Weekly Challenge")
            .setDescription(`❔: ${question}`)
            .setColor("#2f3136")
            .setFooter({
                text: `Submitted by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        const button = new ButtonBuilder()
            .setStyle("Primary")
            .setLabel("Submit")
            .setCustomId(`wc_submit_btn__by__${interaction.user.id}`)
            .setEmoji("✅");

        const row = new ActionRowBuilder().addComponents(button);

        interaction.reply({ embeds: [embed], components: [row] });
    }
};
