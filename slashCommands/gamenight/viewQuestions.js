const { EmbedBuilder, Client, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "view-questions",
    description: "View the questions for the current game night event.",
    options: [
        {
            name: "question_number",
            description: "The question number to view, default all.",
            type: ApplicationCommandOptionType.Integer,
            choices: [{ name: "1", value: 1 }, { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 }, { name: "5", value: 5 }, { name: "6", value: 6 }, { name: "7", value: 7 }, { name: "8", value: 8 }, { name: "9", value: 9 }, { name: "10", value: 10 }, { name: "11", value: 11 }, { name: "12", value: 12 }],
            required: false
        },
        {
            name: "show-answers",
            description: "View answers (staff only).",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        /**
         * @type {import("@supabase/supabase-js").SupabaseClient}
         */
        const supabase = client.supabase;
        const questionNumber = interaction.options.getInteger("question_number") ?? null;
        let showAnswers = interaction.options.getBoolean("show-answers") ?? false;
        const { guild, user: interactionUser } = interaction;

        interaction.deferReply({ephemeral: showAnswers}).then(async (interaction) => {


            if (showAnswers && !(guild.members.cache.get(interactionUser.id).roles.cache.has(client.eventTeamRole))) showAnswers = false;

            let response;
            if (questionNumber === null) {
                response = await supabase.from("GameNight").select("question_number, questions" + showAnswers ? ", answers" : "");
            }
            else {
                response = await supabase.from("GameNight").select("question_number, questions" + showAnswers ? ", answers" : "").eq("question_number", questionNumber);
            }
            const { data: questions, error } = response;

            if (error) return interaction.reply("An error occurred while trying to get the questions.");
            if (questions.length === 0) return interaction.reply("There are no questions for the current game night event.");
            const embed = new EmbedBuilder()
                .setTitle("🎮 Game Night Questions ")
                .setColor("Gold");
            let fields = [];
            for (let i = 0; i < questions.length; i++) {
                fields.push({
                    name: `#️⃣  **__Question ${questions[i].question_number}__**`,
                    value: `➡️  \`${questions[i].question}\`${showAnswers ? `\n\n✅  ||**\`Answer:\`**\` ${questions[i].answer}\`||\n\n` : "\n\n"}`
                });
            }
            embed.addFields(fields);
            interaction.edit({ embeds: [embed], ephemeral: showAnswers });
        });
    }
}