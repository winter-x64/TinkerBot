const fs = require('fs');
const chalk = require('chalk')

module.exports = (client) => {
    fs.readdirSync('./modals/').filter((file) => file.endsWith('.js')).forEach((file) => {
        const modal = require(`../modals/${file}`)
        client.modals.set(modal.id, modal)
    })
    console.log(chalk.magenta("Buttons Loaded ✅"))
};