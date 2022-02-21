const { Message, Client, MessageEmbed} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'autorole',
    aliases : ['autorole'],
    description: "Stablishes the on/off autorole option, the status of the feature and the new member role",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_ROLES",],
    cooldown: 5,
    usage: "Example 1: command on/off/status \nExample 2: command set @rolename/role_id",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let toggling = ["on", "off", "status", "set"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `status`, `on`, `off`, `set`!")
            ]})

		GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
			if (err) {
				console.log(err);
				return message.reply("An error occurred while trying to set the auto role feature!");
			}

			if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
                data.save().catch(err => console.log(err))
			} 
            
            if(args[0]?.toLowerCase() === 'status'){
                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .addField("👨‍💻 __Auto role feature__", `\`${data.allowAntiBL_members ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
                        .addField("🧛‍♂️ New Member Role", `${data.memberRoleId ? `<@&${data.memberRoleId}>` : "`No member role set`"}`, true)
                    ]}) 
            }
            
            else if(args[0]?.toLowerCase() === 'on'){
                data.allowAutoRole = true
                message.reply(`Enabled Autorole system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowAutoRole = false
                message.reply(`Disabled Autorole system!`);
            } 

            else if(args[0]?.toLowerCase() === 'set'){
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
                if(!role) return message.reply("You provided a non-existen role")

                data.memberRoleId = role.id;
                message.reply(`${role} is now set as Member Role`)
            }

            data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the auto role feature!");
				}
			})
		})
	}
}