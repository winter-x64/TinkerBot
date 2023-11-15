module.exports = {
    name: 'ping',
    description: "Check bot's ping.",
    run: async (client, message, _args) => {
        message.channel.send(`🏓 Pong! Latency: **${Math.round(client.ws.ping)} ms**`)
    }
};