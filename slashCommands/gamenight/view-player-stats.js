const { EmbedBuilder, Client, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'view-player-stats',
    description: 'View the stats of a player.',
    options: [
        {
            name: 'player',
            description: 'The player to view the stats of.',
            type: ApplicationCommandOptionType.User,
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
        const player = interaction.options.getUser('player') ?? interaction.user;
        interaction.deferReply().then(async (interaction) => {
            const { data: stats, error } = await supabase.from('participant').select('*').eq('discord_id', player.id);
            if (error) return interaction.edit('An error occurred while trying to get the stats.');
            if (stats.length === 0) return interaction.edit('This player has no stats.');
            const embed = new EmbedBuilder()
                .setTitle(`${stats[0]?.discord_nick_name ?? player?.globalName ?? player.username}'s progress`)
                .setColor('Gold');
            const hardCoreHearts = client.config.emojis.hardcoreHeart
            let fields = [
                {
                    name: "**\💖 Lives left**",
                    value: `➡️   ${hardCoreHearts.repeat(stats[0].lives)} **(${stats[0].lives})**\n`
                },
                {
                    name: "**🏆 Current Level**",
                    value: `➡️   **\`${stats[0].current_level}\`**\n`
                },
                {
                    name: "**\🎮 Next Question**",
                    value: `➡️   **\`${stats[0].question_number}\`**\n`
                },

            ];
            embed.addFields(fields);

            return interaction.edit({ embeds: [embed] });
        });
    }
}