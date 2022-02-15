const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ['latency', 'lat'],
    description: "Sends the bot's current ping",
    usage: "",
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        message.reply('Loading data')
            .then (async (msg) =>{
                const ping = msg.createdTimestamp - message.createdTimestamp;
                const pingEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("⌚ Pong!")
                    .addFields([
                        { name: "Bot Latency 🤖:", value: `${ping}` },
                        { name: "API Latency 🦾:", value: `${Math.round(client.ws.ping)}` }
                    ])
                    .setTimestamp()

                msg.edit({ content: "✅ - Well, this is the current ping! 🏓", embeds: [pingEmbed] })
          })
    },
};