module.exports = {
    id: "wc_submission_modal",
    run: async (_client, interaction, _interactionUserId) => {
        interaction.reply({
            content: "Your response has been recorded!",
        });
    }
}