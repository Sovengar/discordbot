const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "announce",
    aliases: ["anc"],
    description: "Creates an announcement on a channel, optionally to a role or @everyone",
    usage: '<channel> <Announcement> [role] \nExample 1: command #general hello \nExample 2: command #channel hello @everyone/@mods',
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
        let anc, auxArgs = [...args]

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel) return message.reply("Channel either missing or invalid, check `help announce`")
        if(channel.type === 'GUILD_VOICE') return message.reply("You provided a voice channel, check `help announce`")

        const role = message.mentions.roles.first()
        const everyone = auxArgs.pop().toString()

        if(role) {
            anc = args.slice(0, -1).slice(1).join(" ")
            channel.send(`${role}`)
        } 

        else if(everyone === '@everyone'){
            anc = args.slice(0, -1).slice(1).join(" ")
            channel.send(`@everyone`)
        }
        
        else {
            anc = args.slice(1).join(" ")
        }

        if (!anc) return message.reply("Please provide what to announce!")

        const image = message.attachments.first() ? message.attachments.first().proxyURL : null

        const ancEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }), url: '' })
            .setTitle("NEW ANNOUNCEMENT")
            .setDescription(anc)
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