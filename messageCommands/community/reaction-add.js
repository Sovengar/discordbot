const { Util, Client, Message, } = require("discord.js")
const reactionRolesModel = require("../../models/reactionRoles")

module.exports = {
    name: "reaction-add",
    description: "Adds a new reaction role to the reaction role panel",
    aliases: ["reaction-add"],
    usage: "<role> <emoji> \nExample: command @role :happy_face:",
    botPermissions: ["ADD_REACTIONS"],
    userPermissions: ["ADMINISTRATOR"],
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) 
            return message.reply("Please mention a role first!")

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])

        if (!role) 
            return message.reply("The role you provided is not valid in this server!")

        let [, emoji] = args

        if (!emoji) 
            return message.reply("Please mention a emoji first!")

        const parsedEmoji = Util.parseEmoji(emoji)

        reactionRolesModel.findOne({ Guild: message.guild.id }, async (err, data) => {
            if(!data){
                data = new reactionRolesModel({
                    Guild: message.guild.id,
                    Message: 0,
                    Roles: {
                        [parsedEmoji.name]: [
                            role.id,
                            {
                                id: parsedEmoji.id,
                                raw: emoji
                            }
                        ]
                    }
                })
                data.save()
                return message.reply("A new role has been added to the reaction role panel")
            }
            
            data.Roles[parsedEmoji.name] = [
                role.id,
                {
                    id: parsedEmoji.id,
                    raw: emoji
                }
            ]

            await reactionRolesModel.findOneAndUpdate({ Guild: message.guild.id }, data)
            message.reply("A new role has been added to the reaction role panel")
        })
    }
}