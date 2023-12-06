const fs = require('fs');
const chalk = require('chalk')

module.exports = (client) => {
    fs.readdirSync("./commands/").forEach((dir) => {
        const commands = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let cmd = require(`../commands/${dir}/${file}`);
            if (cmd.name) {
                client.commands.set(cmd.name, cmd);
            }
            if (cmd.aliases && Array.isArray(cmd.aliases)) cmd.aliases.forEach((alias) => client.aliases.set(alias, cmd.name));
        }

    });
    console.log(chalk.hex("#C001AA")("Commands Loaded ✅"))
}