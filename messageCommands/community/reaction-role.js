const { Util, Client, Message, MessageEmbed} = require("discord.js")
const reactionRolesModel = require("../../models/reactionRoles")

module.exports = {
    name: "reactionrole",
    description: "Manages the reaction role, adding, clearing and showing the panel with the reaction to get the role.",
    aliases: ["reaction-role"],
    usage: "Example 1: command @role :emoji from the server: \nExample 2: command clear \nExample 3: command panel \nExample 4: command panel channel",
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
        let toggling = ["add", "clear", "panel"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `add`, `clear` or `panel`!")
            ]})

        reactionRolesModel.findOne({ guild_id: message.guild.id }, async (err, data) => {
            if(!data){
                data = new reactionRolesModel({
                    guild_id: message.guild.id,
                    Message: 0,
                })
                data.save()
            }

            if(args[0]?.toLowerCase() === 'add'){
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
                if (!role) return message.reply("The role you provided is not valid in this server!")

                args.shift() //Removing the role from the arguments

                let [, emoji] = args
                if (!emoji) return message.reply("Please mention a emoji first!")

                const parsedEmoji = Util.parseEmoji(emoji)

                data.Roles = {
                    [parsedEmoji.name]: [
                        role.id,
                        {
                            id: parsedEmoji.id,
                            raw: emoji
                        }
                    ]
                }

                await reactionRolesModel.findOneAndUpdate({ guild_id: message.guild.id }, data)
                message.reply("A new role has been added to the reaction role panel")    
            }

            else if(args[0]?.toLowerCase() === 'clear'){
                if (!data) return message.reply("There's no data in the reaction role panel!");
                await data.delete()
                return message.reply("Data from the reaction role panel has been cleared!")
            }

            else if(args[0]?.toLowerCase() === 'panel'){
                const channel = message.channel || message.mentions.channels.first()

                if (!data.Roles || !data.Message) return message.reply("No reaction role data can be found!")

                const mapped = Object.keys(data.Roles).map((value, index) => {
                    const role = message.guild.roles.cache.get(data.Roles[value][0])
                    return `\`${index + 1}.\` ${data.Roles[value][1].raw} -React to get: ${role}`
                }).join("\n\n")

                const rrEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("REACTION ROLES")
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setDescription("React with the emojis below to assign yourself to a role!")
                    .addField("\u200B", mapped)
                    .setTimestamp()

                channel.send({ embeds: [rrEmbed] }).then((msg) => {
                    data.Message = msg.id
                    data.save()

                    const reactions = Object.values(data.Roles).map((val) => val[1].id)

                    reactions.map(
                        (emoji) => msg.react(emoji)
                            .catch(error => {
                                message.reply("You must use emojis from this server to make it work!")
                                console.error(error)
                            })
                    )
                }) 
            }
            
            data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the reaction role!");
				}
			})
        })
    }
}