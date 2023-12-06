// Register command to register for the game night event.

const { EmbedBuilder, Client } = require('discord.js');

module.exports = {
    name: 'register',
    description: 'Register for the game night event.',
    /**
     * 
     * @param {Client} client 
     * @param {import('discord.js').Interaction} interaction 
     * @returns 
     */
    run: async (client, interaction) => {
        // Register with db

        /**
         * @type {import("@supabase/supabase-js").SupabaseClient}
         */

        const supabaseClient = client.supabase;
        // from participant table, fetch user.

        const { data: participant, error } = await supabaseClient.from('participant').select('*').eq('discord_id', interaction.user.id);

        // If error, return.
        if (error) {
            console.error(error);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('ℹ️ Something went wrong!')
                        .setDescription('An error occured while registering you for the game night event.')
                        .setColor('#ff0000')
                        .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }

        // If user is already registered, return.
        if (participant?.length > 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('ℹ️ Already registered!')
                        .setDescription('You have already registered for the game night event.')
                        .setColor('#ff0000')
                        .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        } else {
            // If user is not registered, register them.
            // Fields : discord_id, discord_user_name, discord_nick_name, current_level = 1, question_number = 1, lives = 10

            const guildMember = await interaction.guild.members.fetch(interaction.user.id);
            const { data: _newParticipant, error } = await supabaseClient.from('participant').insert([
                {
                    discord_id: interaction.user.id,
                    discord_user_name: interaction.user.username,
                    discord_nick_name: guildMember?.nickname ?? interaction.user.globalName,
                    current_level: 1,
                    question_number: 1,
                    lives : 10
                }
            ]);

            if (error) {
                console.error(error);
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('ℹ️ Something went wrong!')
                            .setDescription('An error occured while registering you for the game night event.')
                            .setColor('#ff0000')
                            .setFooter({
                                text: `${interaction.user.username}`,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('✅ Registered!')
                        .setDescription('You have been registered for the game night event.')
                        .setColor('#00ff00')
                        .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });

            const gameNightRegister = client.gameNight.registerChannel;
            interaction.guild.channels.cache.get(gameNightRegister).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🎉 New Registration!')
                        .setDescription(`**${interaction.user.username}** has registered for the game night event.`)
                        .setColor('#00ff00')
                        .setImage(interaction.user.displayAvatarURL({
                            extension: 'png',
                        }))
                        .setTimestamp()
                ]
            });
        }

    }
}