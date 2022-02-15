const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms")

module.exports = {
    name: "slowmode",
    aliases : ['slowmode'],
    description: "Sets the channel to slowmode.",
    userPermissions: ["MANAGE_CHANNELS",],
    botPermissions: ["MANAGE_CHANNELS",],
    cooldown: 5,
    usage: "<on/off> <time> \nExample 1: command on 30s \nExample 2: command off ",
    /**
     * @Param {Client} client
     * @Param {Message} message
     * @Param {String[]} args
     */
    run: async (client, message, args) => {
        if(!args.length)
            return message.reply("Provide the right arguments, check `help slowmode` for more info.")

        if(args[0] === 'on'){
            if(!args[1])
                return message.reply("Provide a time for messages, check `help slowmode` for more info.");

            const milliseconds = ms(args[1]);

            if(isNaN(milliseconds))
                return message.reply("This is not a valid time, check `help slowmode` for more info.");

            if(milliseconds < 1000)
                return message.reply("The minimun slowmode is 1 second!");

            message.channel.setRateLimitPerUser(milliseconds / 1000);
            message.channel.send(`The slowmode for this channel has been set to ${ms(milliseconds, {long: true})}`);
        }

        else if(args[0] === 'off'){
            message.channel.setRateLimitPerUser(0);
            return message.reply("The slowmode has been removed!")
        }

        else return message.reply("Wrong arguments, check `help slowmode` for more info.")
    },
};