const { ButtonBuilder, ActionRowBuilder } = require("discord.js");

function disableButtons(components) {
    const disabledComponents = [];

    for (let x = 0; x < components.length; x++) {
        const row = components[x];
        const disabledButtons = [];

        for (let y = 0; y < row.components.length; y++) {
            const button = row.components[y];

            if (button.url) {
                disabledButtons.push(button);
                continue;
            }

            const disabledButton = ButtonBuilder.from(button).setDisabled(true);
            disabledButtons.push(disabledButton);
        }

        const disabledRow = ActionRowBuilder.from(row).setComponents(disabledButtons);
        disabledComponents.push(disabledRow);
    }

    return disabledComponents;
}

module.exports = { disableButtons };