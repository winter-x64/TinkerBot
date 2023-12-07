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
     * @param {import("discord.js").Interaction} interaction 
     */
    run: async (client, interaction) => {
        /**
         * @type {import("@supabase/supabase-js").SupabaseClient}
         */
        const supabase = client.supabase;
        const player = interaction.options.getUser('player') ?? interaction.user;
        const { data: stats, error } = await supabase.from('participant').select('*').eq('discord_id', player.id);
        if (error) return interaction.reply('An error occurred while trying to get the stats.');
        if (stats.length === 0) return interaction.reply('This player has no stats.');
        const embed = new EmbedBuilder()
            .setTitle(`${player.username}'s Stats`)
            .setColor('Navy')
            .setDescription('Here are the stats for this player.');
        const hardCoreHearts = client.config.emojis.hardcoreHeart
        let fields = [
            {
                name : "💖 Lives left",
                value : `${hardCoreHearts.repeat(stats[0].lives)} (${stats[0].lives}) `
            },
            {
                name: "🏆 Current Level",
                value: `${stats[0].current_level}`
            },
            {
                name: "🎮 Next Question",
                value: `${stats[0].question_number}`
            },

        ];
        embed.addFields(fields);

        return interaction.reply({ embeds: [embed] });
    }
}