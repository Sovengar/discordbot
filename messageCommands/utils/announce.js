const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "announce",
    aliases: ["anc"],
    description: "Creates an announcement",
    usage: '<channel> <Announcement>\nExample: command #general hello -ping',
    cooldown: 5,
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_GUILD",],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let channelAux = args.shift()
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(channelAux)
        let anc = args.join(" ") //args.slice(1).join(" ")
        let mention

        if (!channel) 
            return message.reply("Please provide a channel where you wanna send the announcement!")

        if (!anc) 
            return message.reply("Please provide what to announce!")

        //If announcement ends with -ping adds an @everyone on the message.
        if (args.some((val) => val.toLowerCase() === "-ping")) {
            for (let i = 0; i < args.length; i++) {
                if (args[i].toLowerCase() === '-ping') args.splice(i, 1)
            }
            mention = true
        } else mention = false
        
        if (mention === true) 
            channel.send('@everyone')
        
        const image = message.attachments.first() ? message.attachments.first().proxyURL : null

        const ancEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }), url: '' })
            .setTitle("NEW ANNOUNCEMENT")
            .setDescription(args.slice(1).join(" "))
            .setImage(image)
            .setTimestamp()

        channel.send({ embeds: [ancEmbed] })
            .then((msg) => {
                msg.react("⬆")
                msg.react("⬇")
                message.delete().catch(err => {if (err.code !== 10008) return console.log(err)})
            })
            .catch(err => { throw err})
    },
};

//If announcement ends with -ping adds an @everyone on the message.
/*
if(anc.includes('-ping')){
    args.pop()
    anc = args
    channel.send('@everyone')
}
*/