const { Message, Client,} = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    name: "command-enable",
    aliases: ["cmde", "ce"],
    description: "Enables a disabled command",
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
                data.save()
                message.reply('There are no commands disabled since there is no database yet')
                return message.reply('Creating Database...')
                    .then (async (msg) =>{ msg.edit({ content: "✅ - Database created, disable a command first in order to use this command!", }) }) 
            } else {
                if (data.disabledMessageCommands.includes(command)) {
                    for (let i = 0; i < data.disabledMessageCommands.length; i++) {
                        if (data.disabledMessageCommands[i] === command) data.disabledMessageCommands.splice(i, 1)
                    }

                    await data.save()
                    message.reply(`Enabled ${command}!`)

                } else return message.reply('That command isnt turned off.')
            }
        })
    }
}