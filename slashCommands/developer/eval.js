const { developers } = require("../../config.json");
const Discord = require("discord.js");
const { inspect } = require("util");
const { exec } = require("child_process");

module.exports = {
    name: 'eval',
    description: 'Makes the bot evaluate the code/command provided.',
    options: [
        {
            type: 3,
            name: 'code',
            description: 'The code to evaluate / command to run.',
            required: true,
        },
        {
            type: 5,
            name: 'command',
            description: 'Whether the code is a shell command or not.',
            required: false,
            choices: [
                {
                    name: 'true',
                    value: true,
                },
                {
                    name: 'false',
                    value: false,
                }
            ]
        }
    ],
    run: async (client, interaction) => {

        if (!developers.includes(interaction.user.id)) return interaction.reply('This command is only for development purposes only.');

        try {
            let code = interaction.options.getString("code");
            let isCommand = interaction.options.getBoolean("command") || false;
            code = code.trim().replace(/(^`{3}(\w+)?|`{3}$)/g, "");
            if (code.startsWith("$")) { isCommand = true; code = code.slice(1); }
            if (!isCommand) {
                let evaled = await (async () => eval(code))();

                if (typeof evaled !== "string") evaled = inspect(evaled);

                const evalEmbed = new Discord.EmbedBuilder()
                    .setAuthor({ name: "💲Evaluate ", iconURL: interaction.user.displayAvatarURL() })
                    .addFields(
                        { name: "Input", value: `\`\`\`js\n${code}\n\`\`\`` },
                        { name: "Output", value: `\`\`\`js\n${evaled.slice(0, 1000) + (evaled.length > 1000 ? " ..." : "")}\n\`\`\`` },
                    )
                    .setColor("#2f3136");

                interaction.reply({
                    embeds: [evalEmbed],
                    ephemeral: true,
                });
            } else {
                exec(code, (err, stdout, stderr) => {
                    if (err || stderr) {
                        let error = err || stderr;
                        const errorExecEmbed = new Discord.EmbedBuilder()
                            .setAuthor({ name: "Error", iconURL: interaction.user.displayAvatarURL() })
                            .addFields(
                                {
                                    name: "Message",
                                    value: `\`${JSON.stringify(error).slice(0, 1000)}\``
                                }
                            )
                            .setColor("Red");

                        interaction.reply({
                            embeds: [errorExecEmbed],
                            ephemeral: true,
                        });
                    } else {
                        const embedFields = [
                            { name: "Input", value: `\`\`\`sh\n${code}\n\`\`\`` },
                            { name: "Output", value: `\`\`\`sh\n${stdout.slice(0, 1000)}\n\`\`\`` },
                        ];


                        const execEmbed = new Discord.EmbedBuilder()
                            .setAuthor({ name: "💲Execute", iconURL: interaction.user.displayAvatarURL() })
                            .addFields(embedFields)
                            .setColor("#2f3136");

                        interaction.reply({
                            embeds: [execEmbed],
                            ephemeral: true,
                        }).catch(err => console.log(err));
                    }
                });
            }
        } catch (err) {
            const errorEvalEmbed = new Discord.EmbedBuilder()
                .setAuthor({ name: "Error", iconURL: interaction.user.displayAvatarURL() })
                .addFields(
                    {
                        name: "Message",
                        value: `\`${err.message}\``
                    },
                    {
                        name: "Name",
                        value: `\`${err?.name ?? 'Error'}\``,
                        inline: true
                    },
                    {
                        name: "Code",
                        value: `\`${err?.code ?? '0'}\``,
                        inline: true
                    },
                    {
                        name: "Stack Trace",
                        value: `\`\`\`js\n${err.stack.slice(0, 1000)}\n\`\`\``
                    }

                )
                .setColor("Red");

            interaction.reply({
                embeds: [errorEvalEmbed],
                ephemeral: true,
            });
        }
    }
};