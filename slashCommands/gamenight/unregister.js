const { Client, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "unregister",
    description: "Unregister for the game night event.",
    options: [
        {
            name: "user",
            description: "The user you want to unregister.",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    eventTeamOnly: true,
    /**
     * 
     * @param {Client} client 
     * @param {import('discord.js').CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const supabaseClient = client.supabase;
        const { registerRole, level1, level2, level3, level4 } = client.gameNight.roles;

        const { data: participant, error } = await supabaseClient.from('participant').select('*').eq('discord_id', user.id);

        if (error) {
            console.error(error);
            return interaction.reply({
                content: `An error occured while unregistering <@${user.id}> for the game night event.`,
            });
        }

        if (participant?.length > 0) {
            const { error } = await supabaseClient.from('participant').delete().eq('discord_id', user.id);

            if (error) {
                console.error(error);
                return interaction.reply({
                    content: `An error occured while unregistering <@${user.id}> for the game night event.`,
                });
            }

            const member = interaction.guild.members.cache.get(user.id);
            member.roles.remove([registerRole, level1, level2, level3, level4]);

            return interaction.reply({
                content: `__**${user.username}**__ has been unregistered for the game night event.`,
            });
        } else {
            return interaction.reply({
                content: `__**${user.username}**__ is not registered for the game night event.`,
            });
        }
    }
}