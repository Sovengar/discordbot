const { Message, Client, MessageEmbed} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'antiadvertising',
    aliases : ['antiadvertising'],
    description: "Stablishes the on/off option for anti advertising feature",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_MESSAGES",],
    cooldown: 5,
    usage: "<on/off> Example: command on/off",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let toggling = ["on", "off", "status"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `on`, `off` or `status`!")
            ]})

		GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
			if (err) {
				console.log(err);
				return message.reply("An error occurred while trying to set the anti advertising feature!");
			}

			if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
                data.save().catch(err => console.log(err))
			} 

            if(args[0]?.toLowerCase() === "status"){
                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .addField("👨‍💻 __Anti advertising feature__", `\`${data.allowAntiAdvertising ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
                    ]})
            }
            
            if(args[0]?.toLowerCase() === 'on'){
                data.allowAntiAdvertising = true
                message.reply(`Enabled anti advertising system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowAntiAdvertising = false
                message.reply(`Disabled anti advertising system!`);   
            }
            
			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the anti advertising feature!");
				}
			})
		})
	}
}