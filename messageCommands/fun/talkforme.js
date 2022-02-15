const { Message, Client, } = require("discord.js");

module.exports = {
    name: "talkforme",
    aliases: ['talk', 'say'],
    description: "Makes the bot say something instead of you!",
    usage: "[text] \nExample: command text",
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if(!args[0]){
            return message.reply({ content: "Tell the bot what to say, my god!" });
        } else {
            message.channel.send(`${args}. By ${message.author} `)
                .then(message.delete().catch(err => console.log(err)))
        }
    },
};