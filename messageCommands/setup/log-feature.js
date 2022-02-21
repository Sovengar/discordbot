const { Message, Client, MessageEmbed} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'logfeature',
    aliases : ['logfeature'],
    description: "Stablishes the on/off/status option and the log channel",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_CHANNELS",],
    cooldown: 5,
    usage: "Example 1: command on/off/status \nExample 2: command set channel/channel_id",
    /**
     *
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
				return message.reply("An error occurred while trying to set the log feature!");
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
                        .addField("🤐 Logs feature", `\`${data.allowLogChannel ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
                        .addField("🤐 Log channel", `${data.logChannelId ? `<#${data.logChannelId}>` : "`No channel set`"}`, true)
                    ]}) 
            }
            
            else if(args[0]?.toLowerCase() === 'on'){
                data.allowLogChannel = true
                message.reply(`Enabled log system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowLogChannel = false
                message.reply(`Disabled log system!`);
            } 

            else if(args[0]?.toLowerCase() === 'set'){
                const channel = message.mentions.channels.first() || message.member.guild.channels.cache.get(args[1])
                if(!channel) return message.reply(`You provided a wrong channel`);
                if(channel.type === 'GUILD_VOICE') return message.reply("You provided a voice channel")

                data.logChannelId = channel.id;
                message.reply(`Log channel has been set to ${channel}`);
            }
        
			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the log feature!");
				}
			})
		})
	}
}