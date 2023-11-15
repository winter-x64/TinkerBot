const fs = require('fs');
const chalk = require('chalk')

module.exports = (client) => {
    fs.readdirSync('./events/').filter((file) => file.endsWith('.js')).forEach((event) => {
      	require(`../events/${event}`);
    })
	console.log(chalk.red('Events Loaded ✅'))
};
