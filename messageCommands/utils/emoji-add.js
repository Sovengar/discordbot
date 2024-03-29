const { Client, Message, Util } = require("discord.js");

module.exports = {
    name: "emoji-add",
    aliases : ['emoji-add'],
    description: "Adds the emotes provided on the message. You need Discord Nitro.",
    userPermissions: [,],
    botPermissions: [,],
    cooldown: 5,
    usage: "<emoji> <emoji>....",
    /**
     * @Param {Client} client
     * @Param {Message} message
     * @Param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args.length) 
            return message.reply('Please specify some emojis')

        for (const rawEmoji of args) {
            const parsedEmoji = Util.parseEmoji(rawEmoji);

            if(parsedEmoji.id){
                const extension = parsedEmoji.animated ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
                message.guild.emojis.create(url, parsedEmoji.name)
                    .then( emoji => message.channel.send(`Added: \`${emoji.url}\``) )
            }
        }
    },
};