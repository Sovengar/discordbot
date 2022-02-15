const reactionRolesModel = require("../../models/reactionRoles")
const { Client, Message, } = require('discord.js')

module.exports = {
    name: "reaction-clear",
    description: "Clears the reaction role data",
    aliases: ["reaction-clear"],
    usage: "",
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        reactionRolesModel.findOne({ Guild: message.guild.id }, async (err, data) => {
            if (!data) 
                return message.reply("There's no data in the reaction role panel!");

            await data.delete()
            message.reply("Data from the reaction role panel has been cleared!")
        })
    }
}