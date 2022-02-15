const { Message, Client,} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'setautorole',
    aliases : ['setautorole'],
    description: "Stablishes the on/off autorole option and the new member role",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_ROLES",],
    cooldown: 5,
    usage: "Example 1: command on/off \nExample 2: command @rolename/role_id",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args[0]) 
            return message.reply("Choose an option first, check `help setautorole` for more info");
        
		GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
			if (err) {
				console.log(err);
				return message.reply("An error occurred while trying to set the auto role!");
			}

			if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
                data.save()
			} else {
                if(args[0] === 'on'){
                    data.allowAutoRole = true
                    message.reply(`Enabled Autorole system!`);
                } else if(args[0] === 'off'){
                    data.allowAutoRole = false
                    message.reply(`Disabled Autorole system!`);
                } else {
                    if(data.allowAutoRole == false)
                        return message.reply(`Autorole system disabled, cant choose a member role`);
                    
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
                    
                    if(!role)
                        return message.reply("You provided a non-existen role")

                    data.memberRoleId = role.id;
                    message.reply(`${role} is now set as Member Role`)
                }    
			}

			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the member role!");
				}
			})
		})
	}
}