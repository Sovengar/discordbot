const { Message, Client, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'setprefix',
    aliases : ['setprefix'],
    description: "Stablishes the prefix of the classic commands for this server",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: [,],
    cooldown: 5,
    usage: "<prefix> Example: command !",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args[0])
            return message.reply("Choose a prefix first, check `help setprefix` for more info");
        
        if (args[0].length > 3) 
            return message.reply("The new prefix can't be longer than 3 characters")

        GuildSettings.findOne({ guild_id: message.member.guild.id }, (err, data) => {
            if (err) {
                console.log(err);
                return message.reply("An error occurred while trying to set the prefix!");
            }
            
            if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: args[0],
                })
                data.save()
            } else {
                data.prefix = args[0]
                data.save()
            }
        })
        message.reply(`The new Prefix is now set to ${args[0]}`)
	}
}