// submit a game game night 
/**
 * /submit, question_number , answer
 */

const { EmbedBuilder, Client, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'submit',
    description: 'Submit answer to the question.',
    options: [
        {
            name: 'question_number',
            description: 'The question number you are submitting the answer for.',
            type: ApplicationCommandOptionType.Integer,
            choices: [{ name: "1", value: 1 }, { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 }, { name: "5", value: 5 }, { name: "6", value: 6 }, { name: "7", value: 7 }, { name: "8", value: 8 }, { name: "9", value: 9 }, { name: "10", value: 10 }, { name: "11", value: 11 }, { name: "12", value: 12 }],
            required: true
        },
        {
            name: 'answer',
            description: 'Your answer to the question.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {import('discord.js').Interaction} interaction 
     * @returns 
     */
    run: async (client, interaction) => {
        /**
         * @type {import("@supabase/supabase-js").SupabaseClient}
         */

        const supabaseClient = client.supabase;

        const { data: participant, error } = await supabaseClient.from('participant').select('*').eq('discord_id', interaction.user.id);

        // If error, return.
        if (error) {
            console.error(error);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('ℹ️ Something went wrong!')
                        .setDescription('An error occured while submitting your answer.')
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

        // If user is not registered, return.
        if (participant?.length == 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('ℹ️ Not registered!')
                        .setDescription('You have not registered for the game night event.')
                        .setColor('#ff0000')
                        .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        } else if (participant[0].lives == 0) {
            // If no lives left, return.
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('ℹ️ No Lives Left :(')
                        .setDescription('You have no lives left. You cannot submit any more answers.')
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
            // If user is registered and has lives, submit their answer.
            // Fields : discord_id, discord_user_name, discord_nick_name, current_level = 1, question_number = 1, lives = 10
            const question_number = interaction.options.getInteger('question_number');
            let answer = interaction.options.getString('answer');
            answer = answer.trim().toLowerCase();

            // check question_number from participant db and check if user has same as that. if not return the question they have and to submit for that!
            if (participant[0].question_number != question_number) {
                if (participant[0].question_number > question_number) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('ℹ️ Wrong question!')
                                .setDescription(`You have already submitted answer upto question number ${participant[0].question_number - 1}.`)
                                .setColor('#ff0000')
                                .setFooter({
                                    text: `${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL()
                                })
                                .setTimestamp()
                        ],
                        ephemeral: true
                    });
                } else if (participant[0].question_number < question_number) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('ℹ️ Wrong question!')
                                .setDescription(`You have to submit answer for question number ${participant[0].question_number}.`)
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

            } else {
                // Connect with GameNight db and check if answer is correct.
                const { data: gameNight, error } = await supabaseClient.from('GameNight').select('*').eq('question_number', question_number);
                console.log(gameNight);
                if (error) {
                    console.error(error);
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('ℹ️ Something went wrong!')
                                .setDescription('An error occured while submitting your answer.')
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

                // Check answer
                let gameNightAnswer = gameNight[0].answer;
                gameNightAnswer = gameNightAnswer.trim().toLowerCase();

                if (answer === gameNightAnswer) {
                    // Answer is correct
                    // Update question_number and current_level
                    // update current level such that for each 3 successful submissions, current_level increases by 1
                    const oldLevel = participant[0].current_level;
                    let newLevel = participant[0].current_level;
                    if (participant[0].question_number % 3 == 0) {
                        newLevel = participant[0].current_level + 1;
                    }
                    console.log("New Level : " + newLevel);
                    const { data: _updatedParticipant, error } = await supabaseClient.from('participant').update({ question_number: question_number + 1, current_level: newLevel }).eq('discord_id', interaction.user.id);

                    if (error) {
                        console.error(error);
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('ℹ️ Something went wrong!')
                                    .setDescription('An error occured while submitting your answer.')
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
                    if (oldLevel != newLevel) {
                        const guildMember = interaction.guild.members.cache.get(interaction.user.id);
                        const { level1, level2, level3, level4 } = client.gameNight.roles;
                        if (newLevel === 2) {
                            guildMember.roles.add(level2);
                            guildMember.roles.remove([level1]);
                        } else if (newLevel === 3) {
                            guildMember.roles.add(level3);
                            guildMember.roles.remove([level2]);
                        } else if (newLevel === 4) {
                            guildMember.roles.add(level4);
                            guildMember.roles.remove([level3]);
                        }
                    }
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('✅ Correct answer!')
                                .setDescription(`You have submitted the correct answer for question number ${question_number}.`)
                                .addFields({
                                    name: "💖Lives left",
                                    value: `${participant[0].lives}`
                                }, {
                                    name: "🏆Current level",
                                    value: `${newLevel}`,
                                    inline: true
                                }, {
                                    name: "⁉️ Next Question",
                                    value: `${participant[0].question_number + 1}`,
                                    inline: true
                                })
                                .setColor('#00ff00')
                                .setFooter({
                                    text: `${interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL()
                                })
                                .setTimestamp()
                        ],
                        ephemeral: true
                    });
                } else {
                    // Answer is incorrect
                    // Deduct a life
                    const { data: _updatedParticipant, error } = await supabaseClient.from('participant').update({ lives: participant[0].lives - 1 }).eq('discord_id', interaction.user.id);

                    if (error) {
                        console.error(error);
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('ℹ️ Something went wrong!')
                                    .setDescription('An error occured while submitting your answer.')
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

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('❌ Incorrect answer!')
                                .setDescription(`You have submitted the incorrect answer for question number ${question_number}.`)
                                .addFields({
                                    name: "💖Lives left",
                                    value: `${participant[0].lives - 1}`
                                }, {
                                    name: "🏆Current level",
                                    value: `${participant[0].current_level}`,
                                    inline: true
                                }, {
                                    name: "⁉️ Question",
                                    value: `${participant[0].question_number}`,
                                    inline: true
                                })
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
            }
        }
    }
}