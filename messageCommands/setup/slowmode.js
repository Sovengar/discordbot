const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms")

module.exports = {
    name: "slowmode",
    aliases : ['slowmode'],
    description: "Sets the channel to slowmode.",
    userPermissions: ["MANAGE_CHANNELS",],
    botPermissions: ["MANAGE_CHANNELS",],
    cooldown: 5,
    usage: "<on/off> <channel> <time> \nExample 1: command on channel 30s \nExample 2: command off channel ",
    /**
     * @Param {Client} client
     * @Param {Message} message
     * @Param {String[]} args
     */
    run: async (client, message, args) => {
        let toggling = ["on", "off"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `on` or `off`!")
            ]})

        const channel =  message.mentions.channels.first() || message.member.guild.channels.cache.get(args[1])
        if(!channel) return message.reply("Channel either invalid or not provided, check `help slowmode` for detailed info!")
        if(channel?.type === 'GUILD_VOICE') return message.reply("You provided a voice channel")

        if(args[0]?.toLowerCase() === 'on'){
            if(!args[2]) return message.reply("Provide the time between messages, check `help slowmode` for more info.");
            const milliseconds = ms(args[2]);
            if(!milliseconds) return message.reply("This is not a valid time, check `help slowmode` for more info.");
            if(isNaN(milliseconds)) return message.reply("This is not a valid time, check `help slowmode` for more info.");
            if(milliseconds < 1000) return message.reply("The minimun slowmode is 1 second!");

            channel.setRateLimitPerUser(milliseconds / 1000);
            message.channel.send(`The slowmode for ${channel} has been set to ${ms(milliseconds, {long: true})}`);
        }

        else if(args[0]?.toLowerCase() === 'off'){
            channel.setRateLimitPerUser(0);
            return message.reply(`The slowmode for ${channel} has been removed!`)
        }
    },
};