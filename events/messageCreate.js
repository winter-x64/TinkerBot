const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('../index.js');

const cooldown = new Collection();

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(client.prefix)) return;
    const [cmd, ...args] = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
    if (!command) return;
    if (command.cooldown && !client.admins.includes(message.author.id)) {
        if (cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ content: `You have to wait `+ ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true }) + `  before you can use this command again!`, ephemeral: true })
        if (command.userPerms || command.botPerms) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                const userPerms = new EmbedBuilder()
                    .setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                    .setColor('Red')
                return message.reply({ embeds: [userPerms] })
            }
            if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                const botPerms = new EmbedBuilder()
                    .setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
                    .setColor('Red')
                return message.reply({ embeds: [botPerms] })
            }

        }

        await command.run(client, message, args);
        cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
        setTimeout(() => {
            cooldown.delete(`${command.name}${message.author.id}`)
        }, command.cooldown)
    } else {
        if (command.userPerms || command.botPerms) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                const userPerms = new EmbedBuilder()
                    .setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                    .setColor('Red')
                return message.reply({ embeds: [userPerms] })
            }
            if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                const botPerms = new EmbedBuilder()
                    .setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
                    .setColor('Red')
                return message.reply({ embeds: [botPerms] })
            }

        }
        await command.run(client, message, args);
    }
});