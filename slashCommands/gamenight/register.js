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
                        .setColor('Red')
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
                        .setColor('Yellow')
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
                    lives: 10
                }
            ]);

            if (error) {
                console.error(error);
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('ℹ️ Something went wrong!')
                            .setDescription('An error occured while registering you for the game night event.')
                            .setColor('Orange')
                            .setFooter({
                                text: `${interaction.user.username}`,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            const { registerRole, level1 } = client.gameNight.roles;
            guildMember.roles.add([registerRole, level1]);

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('✅ Successfully Registered!')
                        .setDescription(`You have been registered for the game night event.\nYou have recieved the <@&${registerRole}> role as well as 10 lives.\nYou can start submitting your answers using the **</submit:1181853531972575252>** command.\n\nYou are currently on level 1. Answering 3 questions will take you to the next level. There are a total of 4 levels and if you can complete the 4th level (12 questions), you will be the winner of the game night event.`)
                        .setColor('Aqua')
                        .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
            });

            const { registerChannel } = client.gameNight;
            interaction.guild.channels.cache.get(registerChannel).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🎉 New Registration!')
                        .setDescription(`**${interaction.user.username}** has registered for the game night event.`)
                        .setColor('Aqua')
                        .setImage(interaction.user.displayAvatarURL({
                            extension: 'png',
                        }))
                        .addFields({ name: '**User ID**', value: interaction.user.id, inline: true }, { name: '**User Name**', value: interaction.user.username, inline: true }, { name: '**Nick Name**', value: guildMember?.nickname ?? interaction.user.globalName, inline: true })
                        .setTimestamp()
                ]
            });
        }

    }
}