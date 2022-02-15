const { Message, Client,} = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    name: "command-disable",
    aliases: ["cmde", "ce"],
    description: "Disables a disabled command",
    usage: "<command name>",
    userPermissions: ["ADMINISTRATOR",],
    botPermissions: ["ADMINISTRATOR",],
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const command = args[0]

        if (!command) 
            return message.reply('Please specify a command')

        if (!!client.messageCommands.get(command) === false) 
            return message.reply('Invalid command, provide a valid classic command.')

        GuildSettings.findOne({ Guild: message.guild.id }, async (err, data) => {

            if (err) throw err;
            if(!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
                data.disabledMessageCommands.push(command)
                await data.save()
            } else {
                if (data.disabledMessageCommands.includes(command)) 
                    return message.reply('This command has already been disabled.');

                data.disabledMessageCommands.push(command)
                await data.save()
            }
            message.reply(`Command ${command} has been disabled`)
        })
    }
}